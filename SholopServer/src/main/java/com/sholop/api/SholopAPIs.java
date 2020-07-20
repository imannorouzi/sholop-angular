package com.sholop.api;

import com.amazonaws.util.json.JSONArray;
import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.ApplicationConfiguration;
import com.sholop.mail.MailMessage;
import com.sholop.mail.MailUtils;
import com.sholop.objects.*;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.FileStorageService;
import com.sholop.utils.Utils;
import org.apache.commons.io.FileUtils;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

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
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class SholopAPIs {


    @Autowired
    RepositoryFactory repositoryFactory;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/send-mail/{template}/{to}")
    public Response sendmail(@PathVariable("template") String template, @PathVariable("to") String to){
        MailUtils.sendTemplate( template, to);
        return Response.ok("OK").build();
    }

//    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PostMapping("/create-tiny-event")
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
                event.setVenue(repositoryFactory.getLocationRepository().save(event.getVenue()));
            }else{
                event.setVenueId(event.getVenue().getId());
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

                event = repositoryFactory.getEventRepository().save(event);
            }

            repositoryFactory.getSholopDateRepository().saveAll(event.getDates());

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



    @PostMapping("/contact-us")
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



    @GetMapping("/get-events")
    public Response getEvents( User user, String userId) throws JSONException {

        Gson gson = new Gson();
        try {

            List<Event> events = repositoryFactory.getEventRepository().findAll();
            for(Event event : events){
                event.setDates(repositoryFactory.getSholopDateRepository().findAllByEventId(event.getId()));
                event.setVenue(repositoryFactory.getLocationRepository().findById(event.getVenueId()).orElse(null));
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", events))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }



    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PermitAll
    @PostMapping("/upload-file")
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

    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PermitAll
    @PostMapping("/upload-album-image")
    public Response uploadAlbumImage(@FormDataParam("file") InputStream uploadedInputStream,
                                     @FormDataParam("file") FormDataContentDisposition fileDetail,
                                     @FormDataParam("file") FormDataBodyPart body){

        Gson gson = new Gson();

        String url = "";//Utils.saveFile(uploadedInputStream, fileDetail, body, "/images/event/album");

        return Response.ok(gson.toJson(new ResponseObject("OK", url)))
                .build();
    }

    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PermitAll
    @PostMapping("/upload-event-attachment")
    public Response uploadAttachment(@FormDataParam("file") InputStream uploadedInputStream,
                                     @FormDataParam("file") FormDataContentDisposition fileDetail,
                                     @FormDataParam("file") FormDataBodyPart body){

        Gson gson = new Gson();

        String url = "";//Utils.saveFile(uploadedInputStream, fileDetail, body, "/docs/event/attachments");

        return Response.ok(gson.toJson(new ResponseObject("OK", url)))
                .build();
    }

    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PermitAll
    @PostMapping("/invite-event")
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
            Event event = repositoryFactory.getEventRepository().getOne(eventId);
            event.setImageUrl(url);
            repositoryFactory.getEventRepository().save(event);

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
                    c = repositoryFactory.getContactRepository().save(c);
                }

                // Relate this contact to the event
                ContactEvent ce = new ContactEvent(c.getId(), eventId,
                        ContactEvent.TYPE.CONTACT,
                        ContactEvent.STATUS.NOT_REPLIED.name(),
                        c.getName(),
                        c.getEmail(),
                        c.getPhone());
                repositoryFactory.getContactEventRepository().save(ce);
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
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/delete-venue")
    public Response deleteVenue( User user,
                                String venueId) {

        Gson gson = new Gson();
        try {
            repositoryFactory.getLocationRepository().deleteById(Integer.parseInt(venueId));
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", "Venue id " + venueId + " deleted."))).build();
    }


    @GetMapping("/")
    public Map<String, String> getAppDetails() {
        Map<String, String> appDetails = new HashMap<>();
//        appDetails.put("name", appProperties.getName());
//        appDetails.put("description", appProperties.getDescription());

        return appDetails;
    }
}
