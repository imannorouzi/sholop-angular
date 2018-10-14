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
import com.sholop.auth.JWTHelper;
import com.sholop.auth.PasswordHash;
import com.sholop.objects.User;
import com.sholop.db.dao.*;
import com.sholop.objects.*;
import io.dropwizard.auth.Auth;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.security.PermitAll;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


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

    @Inject
    public SholopRestController(EventDao eventDao,
                                SholopDateDao sholopDateDao,
                                LocationDao locationDao,
                                ContactDao contactDao,
                                ContactEventDao contactEventDao,
                                UserDao userDao) {
        this.eventDao = eventDao;
        this.sholopDateDao = sholopDateDao;
        this.locationDao = locationDao;
        this.contactDao = contactDao;
        this.contactEventDao = contactEventDao;
        this.userDao = userDao;
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/authenticate")
    public Response authenticate(String jsonSchedule){

        try {
            JSONObject jsonUser = new JSONObject(jsonSchedule);

//            User user = userDao.getUserByUsername(jsonUser.getString("username"));
            User user = new User();

            Gson gson = new Gson();
            if( true || PasswordHash.check(jsonUser.getString("password"), user.getPassword()) ){
                user.setToken(JWTHelper.createAndSignToken(
                        jsonUser.getString("username"),
                        jsonUser.getString("password")));

                return Response.ok(gson.toJson(new ResponseObject("OK", user)))
                        .build();
            }else{
                return Response.ok(gson.toJson(new ResponseObject("FAIL", null))).build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
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
                    Paths.get("./ui/src/assets/images/event/" + fileDetail.getFileName()),
                    StandardCopyOption.REPLACE_EXISTING);
            String relationalUrl = "../assets/images/" + fileDetail.getFileName();

            Event event = new Event(jsonEvent);
            if(event.getLocation().getId() == -1) {
                event.setVenueId(locationDao.insert(event.getLocation()));
            }else{
                event.setVenueId(event.getLocation().getId());
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

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/get-events")
    public Response getEvents(/*@Auth User user, String userId*/) throws JSONException {

        Gson gson = new Gson();
        try {

            List<Event> events = eventDao.getAllEvents();
            for(Event event : events){
                event.setDates(sholopDateDao.getDatesByEventId(event.getId()));
                event.setLocation(locationDao.getLocationById(event.getVenueId()));
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
    public Response getVenues(@Auth User user) throws JSONException {

        Gson gson = new Gson();
        try {

            List<Location> locations = locationDao.getAllLocations();

            return Response.ok(gson.toJson(new ResponseObject("OK", locations))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
//    @PermitAll
    @Path("/get-contacts")
    public Response getContacts(/*@Auth User user*/) throws JSONException {

        Gson gson = new Gson();
        try {

            //TODO user ID !!!
            List<Contact> contacts = contactDao.getContactByUserId(/*user.getId()*/1);

            return Response.ok(gson.toJson(new ResponseObject("OK", contacts))).build();

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
            String url = saveFile(uploadedInputStream, fileDetail, body, "/images/event/album");

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
            String url = saveFile(uploadedInputStream, fileDetail, body, "/docs/event/attachments");

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

            locationDao.update(location);

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", location))).build();
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/delete-venue")
    public Response deleteVenue(@Auth User user,
                                String venueJsonString) throws JSONException, IOException {

        Gson gson = new Gson();
        Location location = null;
        try {

            JSONObject jsonLocation = new JSONObject(venueJsonString);
            location = new Location(jsonLocation);

            locationDao.delete(location.getId(), user.getId());

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", location))).build();
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
//    @PermitAll
    @Path("/update-contact")
    public Response updateContact(/*@Auth User user,*/
                                  @FormDataParam("file") InputStream uploadedInputStream,
                                  @FormDataParam("file") FormDataContentDisposition fileDetail,
                                  @FormDataParam("file") FormDataBodyPart body,
                                  @FormDataParam("contact") String contactJsonString) throws JSONException, IOException {

        final String SRC_UPLOAD_PATH = "./ui/app/images/contact/";

        Gson gson = new Gson();
        Contact contact = null;
        try {

            Files.copy(uploadedInputStream,
                    Paths.get("./ui/src/assets/images/contacts/" + fileDetail.getFileName()),
                    StandardCopyOption.REPLACE_EXISTING);
            String relationalUrl = "../assets/images/contacts/" + fileDetail.getFileName();

            JSONObject jsonContact = new JSONObject(contactJsonString);
            contact = new Contact(jsonContact);

            //TODO user id should be replaces
            contact.setUserId(1/*user.getId()*/);
            contact.setImageUrl(relationalUrl);

            if(contact.getId() != -1 )
                contactDao.update(contact);
            else
                contactDao.insert(contact);

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", contact))).build();
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/delete-contact")
    public Response deleteContact(@Auth User user,
                                String contactJsonString) throws JSONException, IOException {

        Gson gson = new Gson();
        Contact contact = null;
        try {

            JSONObject jsonContact = new JSONObject(contactJsonString);
            contact = new Contact(jsonContact);

            contactDao.delete(contact.getId(), user.getId());

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", contact))).build();
    }


    public String saveFile(InputStream uploadedInputStream,
                           FormDataContentDisposition fileDetail,
                           FormDataBodyPart body,
                           String relPath) throws IOException {

        final String SRC_UPLOAD_PATH = "./ui/app" + relPath;

        String uploadedFileName =  fileDetail.getFileName();
        String uniqueUploadedFileName =  (uploadedFileName + "_"
                + (new Date()).toString()).replace(" ", "").replace(":","")
                + "." + body.getMediaType().getSubtype();

        Files.copy(uploadedInputStream, Paths.get(SRC_UPLOAD_PATH + uniqueUploadedFileName),
                StandardCopyOption.REPLACE_EXISTING);

        return relPath + uniqueUploadedFileName;
    }
}