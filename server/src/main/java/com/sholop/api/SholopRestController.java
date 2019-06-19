package com.sholop.api;

/**
 * Created by Pooyan on 11/11/2017.
 */
import com.amazonaws.util.json.JSONArray;
import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.codahale.metrics.annotation.Timed;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.sholop.Utils;
import com.sholop.db.dao.*;
import com.sholop.mail.MailMessage;
import com.sholop.mail.MailUtils;
import com.sholop.objects.*;
import io.dropwizard.auth.Auth;
import org.apache.commons.io.FileUtils;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.annotation.security.PermitAll;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Path("/")
@Singleton
@Timed
public class SholopRestController {

    private final EventDao eventDao;
    private final LocationDao locationDao;
    private final SholopDateDao sholopDateDao;
    private final ContactDao contactDao;
    private final ContactEventDao contactEventDao;
    private final UserDao userDao;
    private final CommentDao commentDao;

    @Inject
    public SholopRestController(EventDao eventDao,
                                SholopDateDao sholopDateDao,
                                LocationDao locationDao,
                                ContactDao contactDao,
                                ContactEventDao contactEventDao,
                                UserDao userDao,
                                CommentDao commentDao) {
        this.eventDao = eventDao;
        this.sholopDateDao = sholopDateDao;
        this.locationDao = locationDao;
        this.contactDao = contactDao;
        this.contactEventDao = contactEventDao;
        this.userDao = userDao;
        this.commentDao = commentDao;
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Path("/create-tiny-event")
    public Response createTinyEvent(@FormDataParam("file") InputStream uploadedInputStream,
                               @FormDataParam("file") FormDataContentDisposition fileDetail,
                               @FormDataParam("file") FormDataBodyPart body,
                               @FormDataParam("eventString") String jsonEventString) throws JSONException, IOException {

        Gson gson = new Gson();
        int id = -1;
        try {
            JSONObject jsonEvent = new JSONObject(jsonEventString);

            Files.copy(uploadedInputStream,
                    Paths.get("./contents/images/events/" + fileDetail.getFileName()),
                    StandardCopyOption.REPLACE_EXISTING);
            String relationalUrl = Utils.RELATIONAL_WEBSITE_URL + "/contents/images/events/" + fileDetail.getFileName();

            Event event = new Event(jsonEvent);
            if(event.getVenue().getId() == -1) {
                event.setVenueId(locationDao.insert(event.getVenue()));
            }else{
                event.setVenueId(event.getVenue().getId());
            }


            if(event.getId() > 0){
                // It means user is editing this event
                eventDao.update(event);
                id = event.getId();

                //delete previous dates and contacts
                sholopDateDao.deleteEventDates(id);
                contactEventDao.deleteEventContacts(id);
            }else{

                //create a link for the event
                event.createLink();

                id = eventDao.insert(event);
                event.setId(id);
            }

            for( SholopDate date : event.getDates()){
                sholopDateDao.insert(date, id);
            }

            if(id == -1){
                return Response.ok(gson.toJson(new ResponseObject("FAIL", null)))
                        .build();
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", event))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/create-meeting")
    public Response createMeeting(@Auth User user, String jsonMeetingString) throws JSONException, IOException {

        Gson gson = new Gson();
        int id = -1;
        try {
            JSONObject jsonEvent = new JSONObject(jsonMeetingString);

            Event event = new Event(jsonEvent);
            if(event.getVenue().getId() <= 0) {
                event.getVenue().setUserId(user.getId());
                event.getVenue().downloadMap();
                event.setVenueId(locationDao.insert(event.getVenue()));
            }else{
                event.setVenueId(event.getVenue().getId());
            }

            if(event.getChairId() <= 0){
                event.setChairId(user.getId());
            }

            if(event.getId() > 0){
                // It means user is editing this event
                eventDao.update(event);
                id = event.getId();

                //delete previous dates and contacts
                contactEventDao.deleteEventContacts(id);
                sholopDateDao.deleteEventDates(id);
            }else{

                //create a link for the event
                event.createLink();
                event.setCreatedBy(user.getId());
                id = eventDao.insert(event);
                event.setId(id);
            }

            for( SholopDate date : event.getDates()){
                sholopDateDao.insert(date, id);
            }

            List<ContactEvent> contactEvents = new ArrayList<>();
            for( Contact contact: event.getAttendees()){
                ContactEvent contactEvent = new ContactEvent(contact.getId(), id, ContactEvent.STATUS.NOT_REPLIED.name());
                contactEvent.generateQRCodeImage();
                contactEventDao.insert(contactEvent);

                contactEvents.add(contactEvent);
            }

            event.setContactEvents(contactEvents);


            if(id == -1){
                return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", null)))
                        .build();
            }

            event.setChair(userDao.getUserById(event.getChairId()));
            event.setPointedDate(event.getDates().get(0));
            MailUtils.sendMeetingCreatedMessages(event);
            return Response.ok(gson.toJson(new ResponseObject("OK", event))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/get-meetings")
    public Response getMeetings(@Auth User user,
                                @QueryParam("date") String dateString) throws JSONException {

        Gson gson = new Gson();
        try {

//            DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            Date date = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z").parse(dateString);

            Date dbDate = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss").parse(dateString); // Parse without timezone for db

            List<Event> events = eventDao.getEventsByType("MEETING", user, dbDate);
            for(Event event : events){
                List<SholopDate> dates = sholopDateDao.getDatesByEventId(event.getId());
                event.setDates(dates);
                for(SholopDate sd : dates){
                    if(sd.getDate().equals(date)){
                        event.setPointedDate(sd);
                    }
                }
                event.setVenue(locationDao.getLocationById(event.getVenueId()));
                List<ContactEvent> contactEvents = contactEventDao.getEventContactsByEventId(event.getId());

                List<String> contactIds = new ArrayList<>();
                for(ContactEvent contactEvent : contactEvents){
                    contactIds.add(String.valueOf(contactEvent.getContactId()));
                }

                event.setContactEvents(contactEvents);
                event.setAttendees(contactDao.getContactByContactIds(contactIds));
                event.getAttendees().forEach(att ->{
                    if(user.getEmail().equals(att.getEmail())){
                        contactEvents.stream().filter(ce -> ce.getContactId() == att.getId()).findFirst().ifPresent(
                                event::setContactEvent);
                    }
                });

                event.setChair(userDao.getUserById(event.getChairId()));
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", events))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/get-meeting-dates")
    public Response getMeetingDates(@Auth User user,
                                @QueryParam("startDate") String startDateString,
                                @QueryParam("endDate") String endDateString) throws JSONException {

        Gson gson = new Gson();
        try {

            Date dbStartDate = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss").parse(startDateString); // Parse without timezone for db
            Date dbEndDate = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss").parse(endDateString); // Parse without timezone for db

            List<SholopDate> dates = sholopDateDao.getEDatesByPeriod("MEETING", user, dbStartDate, dbEndDate);

            dates.forEach(date -> {
                try {
                    date.setDate(Utils.readFromGMT(date.getDate()));
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            });


            return Response.ok(gson.toJson(new ResponseObject("OK", dates))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/get-meeting")
    public Response getMeeting(@Auth User user,
                                @QueryParam("meetingId") String meetingId) throws JSONException {

        Gson gson = new Gson();
        try {


            Event event = eventDao.getEventById("MEETING", Integer.parseInt(meetingId));
            List<SholopDate> dates = sholopDateDao.getDatesByEventId(event.getId());
            event.setDates(dates);
            event.setVenue(locationDao.getLocationById(event.getVenueId()));
            List<ContactEvent> contactEvents = contactEventDao.getEventContactsByEventId(event.getId());

            List<String> contactIds = new ArrayList<>();
            for(ContactEvent contactEvent : contactEvents){
                contactIds.add(String.valueOf(contactEvent.getContactId()));
            }
            event.setContactEvents(contactEvents);
            event.setAttendees(contactDao.getContactByContactIds(contactIds));

            event.getAttendees().forEach(att ->{
                if(user.getEmail().equals(att.getEmail())){
                    contactEvents.stream().filter(ce -> ce.getContactId() == att.getId()).findFirst().ifPresent(
                            event::setContactEvent);
                }
            });

            return Response.ok(gson.toJson(new ResponseObject("OK", event))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/get-meeting-by-uuid")
    public Response getMeetingByUUID(
                               @QueryParam("uuid") String uuid,
                               @QueryParam("action") String action)  {

        Gson gson = new Gson();
        try {
            ContactEvent contactEvent = contactEventDao.getEventContactByUUID(uuid);
            if(action != null && !action.isEmpty()) {
                contactEventDao.updateStatus(contactEvent.getId(), ContactEvent.STATUS.valueOf(action));
                contactEvent.setStatus(ContactEvent.STATUS.valueOf(action));
            }

            Contact contact = contactDao.getContactById(contactEvent.getContactId());
            Event event = eventDao.getEventById("MEETING", contactEvent.getEventId());

            List<SholopDate> dates = sholopDateDao.getDatesByEventId(event.getId());
            event.setDates(dates);
            event.setVenue(locationDao.getLocationById(event.getVenueId()));
            List<ContactEvent> contactEvents = contactEventDao.getEventContactsByEventId(event.getId());

            List<String> contactIds = new ArrayList<>();
            for(ContactEvent ce : contactEvents){
                contactIds.add(String.valueOf(ce.getContactId()));
            }
            event.setContactEvents(contactEvents);
            List<Contact> attendees = contactDao.getContactByContactIds(contactIds);
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


    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/create-comment")
    public Response createComment(@Auth User user, String jsonCommentString) throws JSONException, IOException {

        Gson gson = new Gson();
        int id = -1;
        try {
            JSONObject jsonComment = new JSONObject(jsonCommentString);

            Comment comment = new Comment(jsonComment);

            comment.setUserId(user.getId());
            comment.setUserImageUrl(user.getImageUrl());
            comment.setUserName(user.getName());
            comment.setId(commentDao.insert(comment));

            return Response.ok(gson.toJson(new ResponseObject("OK", comment))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/create-comment-guest")
    public Response createComment(String jsonCommentString) throws JSONException, IOException {

        Gson gson = new Gson();
        int id = -1;
        try {
            JSONObject jsonComment = new JSONObject(jsonCommentString);

            String uuid = jsonComment.getString("uuid");
            ContactEvent contactEvent = contactEventDao.getEventContactByUUID(uuid);
            Contact contact = contactDao.getContactById(contactEvent.getContactId());

            Comment comment = new Comment(jsonComment);

            comment.setUserId(-1);
            comment.setContactId(contactEvent.getContactId());
            comment.setEventId(contactEvent.getEventId());
            comment.setUserName(contact.getName());
            comment.setUserImageUrl(contact.getImageUrl());
            comment.setId(commentDao.insert(comment));

            return Response.ok(gson.toJson(new ResponseObject("OK", comment))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/delete-comment")
    public Response deleteComment(@Auth User user,
                                  String id){

        Gson gson = new Gson();
        Comment comment = null;
        try {
            commentDao.delete(Integer.parseInt(id), user.getId());

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", comment))).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/contact-us")
    public Response contactUs(String jsonCommentString) {

        Gson gson = new Gson();
        try {
            JSONObject jsonComment = new JSONObject(jsonCommentString);

            ContactUsMessage cum = new ContactUsMessage(jsonComment);

            MailMessage msg = new MailMessage();
            msg.setSubject(cum.getTitle());
            msg.setTo("iman.norouzy@gmail.com");
            msg.setFrom(cum.getEmail());

            String htmlString = FileUtils.readFileToString(new File("./server/src/main/templates/meeting/newMeeting.html"));
            htmlString = htmlString.replace("$title", cum.getTitle());
            htmlString = htmlString.replace("$message", cum.getMessage());


            msg.setBody(htmlString);
            MailUtils.sendMail(msg);

            return Response.ok(gson.toJson(new ResponseObject("OK", "Recieved"))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/get-comments")
    public Response getComments(@Auth User user,
                                @QueryParam("event_id") int eventId,
                                @QueryParam("page") int page) throws JSONException {

        Gson gson = new Gson();
        try {


            List<Comment> comments = commentDao.getCommentsByEventId(eventId, page);
            Utils.setCommentsAuthor(comments, userDao, contactDao);

            return Response.ok(gson.toJson(new ResponseObject("OK", comments))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }



    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/get-comments-guest")
    public Response getComments(@QueryParam("uuid") String uuid,
                                @QueryParam("page") int page) {

        Gson gson = new Gson();
        try {

            ContactEvent contactEvent = contactEventDao.getEventContactByUUID(uuid);
            List<Comment> comments = commentDao.getCommentsByEventId(contactEvent.getEventId(), page);

            Utils.setCommentsAuthor(comments, userDao, contactDao);


            return Response.ok(gson.toJson(new ResponseObject("OK", comments))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/get-events")
    public Response getEvents(@Auth User user, String userId) throws JSONException {

        Gson gson = new Gson();
        try {

            List<Event> events = eventDao.getAllEvents();
            for(Event event : events){
                event.setDates(sholopDateDao.getDatesByEventId(event.getId()));
                event.setVenue(locationDao.getLocationById(event.getVenueId()));
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", events))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/get-venues")
    public Response getVenues(@Auth User user, @QueryParam("hint") String hint) throws JSONException {

        Gson gson = new Gson();
        try {

            List<Location> locations = locationDao.getAllLocations(user.getId(), hint);

            return Response.ok(gson.toJson(new ResponseObject("OK", locations))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PermitAll
    @Path("/upload-file")
    public Response uploadFile(@FormDataParam("file") InputStream uploadedInputStream,
                                @FormDataParam("file") FormDataContentDisposition fileDetail,
                                @FormDataParam("file") FormDataBodyPart body) throws JSONException, IOException {


        final String SRC_UPLOAD_PATH = "./ui/app/images/event/";


        String uploadedFileName =  fileDetail.getFileName();
        String uniqueUploadedFileName =  (uploadedFileName + "_"
                + (new Date()).toString()).replace(" ", "").replace(":","")
                + "." + body.getMediaType().getSubtype();

        Files.copy(uploadedInputStream, Paths.get(SRC_UPLOAD_PATH + uniqueUploadedFileName),
                StandardCopyOption.REPLACE_EXISTING);


        Gson gson = new Gson();
        try {

            String url = "/images/event/" + uniqueUploadedFileName;

            return Response.ok(gson.toJson(new ResponseObject("OK", url)))
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PermitAll
    @Path("/upload-album-image")
    public Response uploadAlbumImage(@FormDataParam("file") InputStream uploadedInputStream,
                                @FormDataParam("file") FormDataContentDisposition fileDetail,
                                @FormDataParam("file") FormDataBodyPart body){

        Gson gson = new Gson();

        try {
            String url = Utils.saveFile(uploadedInputStream, fileDetail, body, "/images/event/album");

            return Response.ok(gson.toJson(new ResponseObject("OK", url)))
                    .build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PermitAll
    @Path("/upload-event-attachment")
    public Response uploadAttachment(@FormDataParam("file") InputStream uploadedInputStream,
                                @FormDataParam("file") FormDataContentDisposition fileDetail,
                                @FormDataParam("file") FormDataBodyPart body){

        Gson gson = new Gson();

        try {
            String url = Utils.saveFile(uploadedInputStream, fileDetail, body, "/docs/event/attachments");

            return Response.ok(gson.toJson(new ResponseObject("OK", url)))
                    .build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PermitAll
    @Path("/invite-event")
    public Response inviteEvent(@FormDataParam("file") InputStream uploadedInputStream,
                                @FormDataParam("file") FormDataContentDisposition fileDetail,
                                @FormDataParam("file") FormDataBodyPart body,
                                @FormDataParam("info") String jsonInviteString) throws JSONException, IOException {

        final String SRC_UPLOAD_PATH = "./ui/app/images/event/";


        String uploadedFileName =  fileDetail.getFileName();
        String uniqueUploadedFileName =  (uploadedFileName + "_"
                + (new Date()).toString()).replace(" ", "").replace(":","")
                + "." + body.getMediaType().getSubtype();

        Files.copy(uploadedInputStream, Paths.get(SRC_UPLOAD_PATH + uniqueUploadedFileName),
                StandardCopyOption.REPLACE_EXISTING);


        Gson gson = new Gson();
        try {

            JSONObject jsonInvites = new JSONObject(jsonInviteString);

            int eventId = jsonInvites.getInt("event_id");
            int userId = jsonInvites.getInt("user_id");

            String url = "/images/event/" + uniqueUploadedFileName;
            eventDao.updateImageUrl(eventId, url);

            JSONArray jsonContacts = jsonInvites.getJSONArray("contacts");
            JSONArray jsonEmails = jsonInvites.getJSONArray("emails");


            List<Contact> contacts = new ArrayList<>();

            Contact contact;
            for(int i=0; i<jsonContacts.length(); i++){
                contact = new Contact(jsonContacts.getJSONObject(i));
                contact.setUserId(userId);
                contacts.add(contact);
            }

            // For now we store the emails in the same contacts table with valid=false
            // indicating this is not a complete contact
            for(int i=0; i<jsonEmails.length(); i++){
                contact = new Contact(jsonEmails.getJSONObject(i).getString("email"));
                contact.setUserId(userId);
                contacts.add(contact);

            }

            for(Contact c : contacts) {
                // store in db
                if (c.getId() == -1) { // it means it's a newly added contact so we should insert it
                    c.setId(contactDao.insert(c));
                }

                // Relate this contact to the event
                contactEventDao.insert(new ContactEvent(c.getId(), eventId, ContactEvent.STATUS.NOT_REPLIED.name()));
            }
            return Response.ok(gson.toJson(new ResponseObject("OK", eventId)))
                        .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/update-venue")
    public Response updateVenue(@Auth User user,
                                String venueJsonString) throws JSONException, IOException {

        Gson gson = new Gson();
        Location location = null;
        try {

            JSONObject jsonLocation = new JSONObject(venueJsonString);
            location = new Location(jsonLocation);

            location.setUserId(user.getId());
            location.downloadMap();

            if(location.getId() != -1){
                locationDao.update(location);
            }else{
                location.setId(locationDao.insert(location));
            }



        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", location))).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/delete-venue")
    public Response deleteVenue(@Auth User user,
                                String venueId) {

        Gson gson = new Gson();
        try {
            locationDao.delete(Integer.parseInt(venueId), user.getId());
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", "Venue id " + venueId + " deleted."))).build();
    }

    /*
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/delete-contact")
    public Response deleteContact(@Auth User user,
                                String id){

        Gson gson = new Gson();
        Contact contact = null;
        try {
            contactDao.delete(Integer.parseInt(id), user.getId());

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", contact))).build();
    }*/

}