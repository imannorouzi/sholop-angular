package com.sholop.api;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.Application;
import com.sholop.mail.MailUtils;
import com.sholop.objects.*;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.core.io.Resource;

@RestController
public class MeetingAPI {

    @Autowired
    RepositoryFactory repositoryFactory;

    @Autowired
    private FileStorageService fileStorageService;

    Gson gson = new Gson();

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
                event = repositoryFactory.getEventRepository().save(event);
                event.setId(id);
            }

            // save dates
            if(event.getDates() != null && event.getDates().size() > 0) {
                repositoryFactory.getSholopDateRepository().saveAll(event.getDates());
            }

            // save contact events
            List<ContactEvent> contactEvents = new ArrayList<>();
            if(event.getAttendees() != null && event.getAttendees().size() > 0) {
                for (Contact contact : event.getAttendees()) {
                    ContactEvent contactEvent = new ContactEvent(contact.getId(), id, ContactEvent.STATUS.NOT_REPLIED.name());
                    contactEvent.generateQRCodeImage();
                    contactEvent = repositoryFactory.getContactEventRepository().save(contactEvent);

                    contactEvents.add(contactEvent);
                }
            }
            event.setContactEvents(contactEvents);

            event.setChair(repositoryFactory.getUserRepository().findById(event.getChairId()).orElse(null));
//            event.setPointedDate(event.getDates().get(0));
            MailUtils.sendMeetingCreatedMessages(event);
            return Response.ok(gson.toJson(new ResponseObject("OK", event))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", null)))
                    .build();
        }
    }

    @GetMapping("/get-meetings")
    public Response getMeetings( User user,
                                 @QueryParam("date") String dateString)  {

        Gson gson = new Gson();
        try {

//            DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            Date date = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z").parse(dateString);

            Date dbDate = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss").parse(dateString); // Parse without timezone for db

            List<Event> events = repositoryFactory.getEventRepository().getEventsByType("MEETING", user.getId(), user.getEmail(),  date);
            for(Event event : events){
                List<SholopDate> dates = repositoryFactory.getSholopDateRepository().findAllByEventId(event.getId());
                event.setDates(dates);
                for(SholopDate sd : dates){
                    if(sd.getDate().equals(date)){
                        event.setPointedDate(sd);
                    }
                }
                event.setVenue(repositoryFactory.getLocationRepository().findById(event.getVenueId()).orElse(null));
                List<ContactEvent> contactEvents = repositoryFactory.getContactEventRepository().getEventContactsByEventId(event.getId());

                List<String> contactIds = new ArrayList<>();
                for(ContactEvent contactEvent : contactEvents){
                    contactIds.add(String.valueOf(contactEvent.getContactId()));
                }

                event.setContactEvents(contactEvents);
                event.setAttendees(repositoryFactory.getContactRepository().getContactsByContactIds(contactIds));
                event.getAttendees().forEach(att ->{
                    if(user.getEmail().equals(att.getEmail())){
                        contactEvents.stream().filter(ce -> ce.getContactId() == att.getId()).findFirst().ifPresent(
                                event::setContactEvent);
                    }
                });

                event.setChair(repositoryFactory.getUserRepository().findById(event.getChairId()).orElse(null));
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", events))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
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

            List<SholopDate> dates = repositoryFactory.getSholopDateRepository().getDatesByPeriod("MEETING", user.getId(), user.getEmail(), dbStartDate, dbEndDate);

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

    @GetMapping("/get-meeting")
    public Response getMeeting( User user,
                                @QueryParam("meetingId") String meetingId) throws JSONException {

        Gson gson = new Gson();
        try {


            Optional<Event> event = repositoryFactory.getEventRepository().findById(Integer.parseInt(meetingId));

            if(event.isPresent()){
                List<SholopDate> dates = repositoryFactory.getSholopDateRepository().findAllByEventId(event.get().getId());
                event.get().setDates(dates);
                event.get().setVenue(repositoryFactory.getLocationRepository().findById(event.get().getVenueId()).orElse(null));
                List<ContactEvent> contactEvents = repositoryFactory.getContactEventRepository().getEventContactsByEventId(event.get().getId());

                List<String> contactIds = new ArrayList<>();
                for(ContactEvent contactEvent : contactEvents){
                    contactIds.add(String.valueOf(contactEvent.getContactId()));
                }
                event.get().setContactEvents(contactEvents);
                event.get().setAttendees(repositoryFactory.getContactRepository().getContactsByContactIds(contactIds));

                event.get().getAttendees().forEach(att ->{
                    if(user.getEmail().equals(att.getEmail())){
                        contactEvents.stream().filter(ce -> ce.getContactId() == att.getId()).findFirst().ifPresent(
                                event.get()::setContactEvent);
                    }
                });

                return Response.ok(gson.toJson(new ResponseObject("OK", event))).build();
            }else{
                return Response.status(500)
                        .build();
            }


        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @GetMapping("/get-meeting-by-uuid")
    public Response getMeetingByUUID(
            @QueryParam("uuid") String uuid,
            @QueryParam("action") String action)  {

        Gson gson = new Gson();
        try {
            ContactEvent contactEvent = repositoryFactory.getContactEventRepository().findByUuid(uuid);
            if(action != null && !action.isEmpty()) {
                contactEvent.setStatus(ContactEvent.STATUS.valueOf(action));
                contactEvent = repositoryFactory.getContactEventRepository().save(contactEvent);
            }

            Contact contact = repositoryFactory.getContactRepository().getOne(contactEvent.getContactId());
            Event event = repositoryFactory.getEventRepository().getOne(contactEvent.getEventId());

            List<SholopDate> dates =  repositoryFactory.getSholopDateRepository().findAllByEventId(event.getId());
            event.setDates(dates);
            event.setVenue(repositoryFactory.getLocationRepository().getOne(event.getVenueId()));
            List<ContactEvent> contactEvents = repositoryFactory.getContactEventRepository().getEventContactsByEventId(event.getId());

            List<String> contactIds = new ArrayList<>();
            for(ContactEvent ce : contactEvents){
                contactIds.add(String.valueOf(ce.getContactId()));
            }
            event.setContactEvents(contactEvents);
            List<Contact> attendees = repositoryFactory.getContactRepository().getContactsByContactIds(contactIds);
            for(Contact at : attendees){
                if(at.getId() == contact.getId()){
                    at.setYou(true);
                    break;
                }
            }
            event.setAttendees(attendees);

            return Response.ok(gson.toJson(new ResponseObject("OK", event))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }


    @PostMapping("/uploadFile")
    public Response uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        String fileName = fileStorageService.storeFile(file, file.getOriginalFilename(), "/");

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();

        return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", fileDownloadUri)))
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

    @GetMapping("/download/{type}/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName,
                                                 @PathVariable String type,
                                                 HttpServletRequest request) throws Exception {
        // type could be venues, users, contacts
        Resource resource = fileStorageService.loadFileAsResource(fileName, "/" + type);

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
