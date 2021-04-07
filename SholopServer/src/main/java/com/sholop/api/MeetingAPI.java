package com.sholop.api;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.Application;
import com.sholop.mail.MailUtils;
import com.sholop.objects.*;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.FileStorageService;
import com.sholop.utils.Utils;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.annotation.security.PermitAll;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class MeetingAPI {

    final RepositoryFactory repositoryFactory;

    private final FileStorageService fileStorageService;

    Gson gson = new Gson();

    public MeetingAPI(RepositoryFactory repositoryFactory, FileStorageService fileStorageService) {
        this.repositoryFactory = repositoryFactory;
        this.fileStorageService = fileStorageService;
    }

    @PermitAll
    @PostMapping("/create-meeting")
    public Response createMeeting(@AuthenticationPrincipal UserDetails u, @RequestBody String jsonMeetingString)  {

        int id = -1;
        User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        try {
            JSONObject jsonEvent = new JSONObject(jsonMeetingString);

            Event event = new Event(jsonEvent);
            if(event.getVenue().getId() <= 0) {
                event.getVenue().setUserId(user.getId());
                event.getVenue().setMapUrl(this.fileStorageService.downloadMap(
                        event.getVenue().getLatitude(),
                        event.getVenue().getLongitude()
                ));
                event.getVenue().setActive(true);
                event.setVenueId(repositoryFactory.getLocationRepository().save(event.getVenue()).getId());
            }else{
                event.setVenueId(event.getVenue().getId());
            }

            if(event.getChairId() <= 0){
                event.setChairId(user.getId());
            }

            if(event.getId() > 0){
                // It means user is editing this event

                event = repositoryFactory.getEventRepository().save(event);
                id = event.getId();

                //delete previous dates and contacts
                repositoryFactory.getSholopDateRepository().deleteByEventId(id);
                repositoryFactory.getContactEventRepository().deleteByEventId(id);
            }else{

                //create a link for the event
                event.createLink();
                event.setCreatedBy(user.getId());
                event.setStatus(Event.EVENT_STATUS.PUBLISHED.name());
                Event savedEvent = repositoryFactory.getEventRepository().save(event);
                id = savedEvent.getId();
                event.setId(savedEvent.getId());
            }

            // save dates
            if(event.getDates() != null && event.getDates().size() > 0) {
                for(EventDate date: event.getDates()){
                    date.setEventId(event.getId());
                }
                repositoryFactory.getSholopDateRepository().saveAll(event.getDates());
            }

            // save contact events
            List<ContactEvent> contactEvents = new ArrayList<>();
            if(event.getAttendees() != null && event.getAttendees().size() > 0) {
                for (Attendee attendee : event.getAttendees()) {
                    ContactEvent contactEvent;
                    if(attendee instanceof Contact){
                        Contact contact = (Contact) attendee;
                        contactEvent = new ContactEvent(
                                contact.getId(),
                                id,
                                ContactEvent.TYPE.CONTACT,
                                ContactEvent.STATUS.NOT_REPLIED.name(),
                                contact.getName(),
                                contact.getEmail(),
                                contact.getPhone()
                        );
                    }else{
                        User us = (User) attendee;
                        contactEvent = new ContactEvent(
                                us.getId(),
                                id,
                                ContactEvent.TYPE.USER,
                                ContactEvent.STATUS.NOT_REPLIED.name(),
                                us.getName(),
                                us.getEmail(),
                                us.getPhone()
                        );
                    }

                    String uuid = Utils.generateRandomString();
                    contactEvent.setUuid(uuid);
                    contactEvent.setQRCodeUrl(this.fileStorageService.generateQRCodeImage(
                            uuid
                    ));
                    contactEvent = repositoryFactory.getContactEventRepository().save(contactEvent);
                    contactEvents.add(contactEvent);

                }
            }
            event.setContactEvents(contactEvents);

            event.setChair(repositoryFactory.getUserRepository().findById(event.getChairId()).orElse(null));


            MailUtils.sendMeetingCreatedMessages(event);
            return Response.ok(gson.toJson(new ResponseObject("OK", event))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", null)))
                    .build();
        }
    }

    @GetMapping("/get-meetings")
    public Response getMeetings( @AuthenticationPrincipal UserDetails u,
                                 @RequestParam("date") String dateString,
                                 @RequestParam(value = "limit", required = false) Integer limit, // days with meetings
                                 @RequestParam(value = "period", required = false) Integer period)  {

        User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        try {
            Date date = Utils.convertStringToDateUTC(dateString);
            List<Event> events = new ArrayList<>();

            if(limit != null){
                // we need to query all the dates because we don't know what is client's timezone
                List<EventDate> eventDates = limit > 0 ? // negative limit means go backwards
                        repositoryFactory.getSholopDateRepository().findEventDatesForward(user.getId(),
                                user.getEmail(),
                                new Timestamp(date.getTime()))
                        :
                        repositoryFactory.getSholopDateRepository().findEventDatesBackward(user.getId(),
                                user.getEmail(),
                                new Timestamp(date.getTime()));

                List<Integer> eventIds = new ArrayList<>();
                int i = 0, daysWithMeetings = 0;
                while (eventDates.size() > 0 && daysWithMeetings < Math.abs(limit)){
                    Date dt = new Date(date.getTime());
                    Calendar c = Calendar.getInstance();
                    c.setTime(dt);
                    c.add(Calendar.DATE, (limit < 0 ? -1 : 1) * ++i);
                    List<Integer> ids = eventDates.stream()
                            .filter(ed -> (limit < 0 ? ed.getDate().after(c.getTime()) : ed.getDate().before(c.getTime())))
                            .map(EventDate::getEventId).collect(Collectors.toList());
                    eventIds.addAll(ids);
                    daysWithMeetings += ids.size() > 0 ? 1 : 0;
                    eventDates.removeIf( ed -> (limit < 0 ? ed.getDate().after(c.getTime()) : ed.getDate().before(c.getTime())));
                }

                events = repositoryFactory.getEventRepository().getEventsByIds(eventIds);
            } else if (period != null){
                events = repositoryFactory.getEventRepository().findMyMeetingsByPeriod(
                        user.getId(),
                        user.getEmail(),
                        new Timestamp(date.getTime()),
                        period
                );
            }

            for(Event event : events){
                List<EventDate> dates = repositoryFactory.getSholopDateRepository().findAllByEventId(event.getId());
                event.setDates(dates);
                for(EventDate sd : dates){
                    if(true /*check if date string falls in this one*/){
                        event.setPointedDate(sd);
                    }
                }
                event.setVenue(repositoryFactory.getLocationRepository().findById(event.getVenueId()).orElse(null));

                List<ContactEvent> contactEvents = repositoryFactory.getContactEventRepository().getEventContactsByEventId(event.getId());
                event.setContactEvents(contactEvents);

                // add attending contacts
                event.setAttendees(new ArrayList<>());
                List<Integer> contactIds = new ArrayList<>();
                List<ContactEvent> contacts = contactEvents.stream().filter(ce -> ce.getType().equals(ContactEvent.TYPE.CONTACT.name())).collect(Collectors.toList());
                for (ContactEvent contactEvent : contacts) {
                    contactIds.add(contactEvent.getContactId());
                }
                event.getAttendees().addAll(repositoryFactory.getContactRepository().getContactsByContactIds(contactIds));

                // add attending users
                List<Integer> userIds = new ArrayList<>();
                for(ContactEvent contactEvent : contactEvents.stream().filter(ce -> ce.getType().equals(ContactEvent.TYPE.USER.name())).collect(Collectors.toList())){
                    userIds.add(contactEvent.getContactId());
                }
                event.getAttendees().addAll(repositoryFactory.getUserRepository().getUsersByContactIds(userIds));

                /* add contacts of event who are not in contact list*/
                contactEvents.forEach( ce -> {
                    if(ce.getContactId() == -1){
                        event.getAttendees().add(new Contact(ce.getName(), ce.getPhone(), ce.getEmail()));
                    }
                });

                event.setChair(repositoryFactory.getUserRepository().findById(event.getChairId()).orElse(null));
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", events))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", e.getMessage())))
                    .build();
        }
    }

    @GetMapping("/get-contact-event-meeting/{uuid}")
    public Response getContactEventMeeting( @PathVariable("uuid") String uuid)  {

        try {

            ContactEvent uuidCE = repositoryFactory.getContactEventRepository().findByUuid(uuid);
            Optional<Event> eventOptional = Optional.empty();
            if(uuid != null){
                eventOptional = repositoryFactory.getEventRepository().findById(uuidCE.getEventId());
            }

            if(eventOptional.isPresent()){
                Event event = eventOptional.get();

                List<EventDate> dates = repositoryFactory.getSholopDateRepository().findAllByEventId(event.getId());
                event.setDates(dates);
                for(EventDate sd : dates){
                    if(true /*check if date string falls in this one*/){
                        event.setPointedDate(sd);
                    }
                }
                event.setVenue(repositoryFactory.getLocationRepository().findById(event.getVenueId()).orElse(null));

                List<ContactEvent> contactEvents = repositoryFactory.getContactEventRepository().getEventContactsByEventId(event.getId());
                event.setContactEvents(contactEvents);

                // add attending contacts
                event.setAttendees(new ArrayList<>());
                List<Integer> contactIds = new ArrayList<>();
                List<ContactEvent> contacts = contactEvents.stream().filter(ce -> ce.getType().equals(ContactEvent.TYPE.CONTACT.name())).collect(Collectors.toList());
                for (ContactEvent contactEvent : contacts) {
                    contactIds.add(contactEvent.getContactId());
                }
                event.getAttendees().addAll(repositoryFactory.getContactRepository().getContactsByContactIds(contactIds));

                // add attending users
                List<Integer> userIds = new ArrayList<>();
                for(ContactEvent contactEvent : contactEvents.stream().filter(ce -> ce.getType().equals(ContactEvent.TYPE.USER.name())).collect(Collectors.toList())){
                    userIds.add(contactEvent.getContactId());
                }
                event.getAttendees().addAll(repositoryFactory.getUserRepository().getUsersByContactIds(userIds));

                /* add contacts of event who are not in contact list*/
                contactEvents.forEach( ce -> {
                    if(ce.getContactId() == -1){
                        event.getAttendees().add(new Contact(ce.getName(), ce.getPhone(), ce.getEmail()));
                    }
                });

                event.setChair(repositoryFactory.getUserRepository().findById(event.getChairId()).orElse(null));

                return Response.ok(gson.toJson(new ResponseObject("OK", event))).build();
            }

            return Response.ok(gson.toJson(new ResponseObject("NOT_FOUND", null))).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", e.getMessage())))
                    .build();
        }
    }

    @GetMapping("/get-meeting-dates")
    public Response getMeetingDates( User user,
                                     @QueryParam("startDate") String startDateString,
                                     @QueryParam("endDate") String endDateString) throws JSONException {

        Gson gson = new Gson();
        try {

            Date dbStartDate = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss").parse(startDateString); // Parse without timezone for db
            Date dbEndDate = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss").parse(endDateString); // Parse without timezone for db

            List<EventDate> dates = repositoryFactory.getSholopDateRepository().getDatesByPeriod("MEETING", user.getId(), user.getEmail(), null, null);

            dates.forEach(date -> {
                // TODO: change to timestamp
                /*try {
                    date.setDate(Utils.readFromGMT(date.getDate()));
                } catch (ParseException e) {
                    e.printStackTrace();
                }*/
            });


            return Response.ok(gson.toJson(new ResponseObject("OK", dates))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }


    @PostMapping("/uploadFile")
    public Response uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        String fileName = fileStorageService.storeFile(file, file.getOriginalFilename(), "/images");

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();

        return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", Utils.fixUri(fileDownloadUri))))
                .build();
    }

    @PostMapping("/uploadMultipleFiles")
    public List<Response> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        return Arrays.stream(files)
                .map(file -> {
                    try {
                        return uploadFile(file);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return null;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/download/{dir}/{type}/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName,
                                                 @PathVariable String type,
                                                 @PathVariable String dir,
                                                 HttpServletRequest request) throws Exception {
        // type could be venues, users, contacts
        Resource resource = fileStorageService.loadFileAsResource(fileName, dir + "/" + type);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            Application.logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }



}
