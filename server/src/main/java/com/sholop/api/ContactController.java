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
import com.sholop.auth.JWTHelper;
import com.sholop.auth.PasswordHash;
import com.sholop.db.dao.*;
import com.sholop.mail.MailMessage;
import com.sholop.mail.MailUtils;
import com.sholop.objects.*;
import io.dropwizard.auth.Auth;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.annotation.security.PermitAll;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
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
public class ContactController {

    private final EventDao eventDao;
    private final LocationDao locationDao;
    private final SholopDateDao sholopDateDao;
    private final ContactDao contactDao;
    private final ContactEventDao contactEventDao;
    private final UserDao userDao;
    private final CommentDao commentDao;

    @Inject
    public ContactController(EventDao eventDao,
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
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/update-contact-status")
    public Response updateContactStatus(@Auth User user, String objectString){

        Gson gson = new Gson();
        try {
            JSONObject jsonObject = new JSONObject(objectString);

            ContactEvent contactEvent = contactEventDao.getEventContactById(jsonObject.getInt("contactEventId"));
            contactEvent.setStatus(ContactEvent.STATUS.valueOf(jsonObject.getString("status")));
            contactEventDao.updateStatus( jsonObject.getInt("contactEventId"), contactEvent.getStatus() );

            return Response.ok(gson.toJson(new ResponseObject("OK", contactEvent))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    @Path("/get-contacts")
    public Response getContacts(@Auth User user, @QueryParam("type") String type,
                                @QueryParam("hint") String hint) throws JSONException {

        Gson gson = new Gson();
        try {

            //TODO user ID !!!
            List<Contact> contacts = null;
            type = type.isEmpty() ? Contact.CONTACT_TYPE.CONTACT.name() : type;

            if(hint == null || hint.isEmpty()){
                contacts = contactDao.getContactByUserId(user.getId(), type,  "");
            }else{
                contacts = contactDao.getContactByUserId(user.getId(), type,  hint);
            }

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
    @Path("/update-contact")
    public Response updateContact(@Auth User user,
                                  @FormDataParam("file") InputStream uploadedInputStream,
                                  @FormDataParam("file") FormDataContentDisposition fileDetail,
                                  @FormDataParam("file") FormDataBodyPart body,
                                  @FormDataParam("contact") String contactJsonString,
                                  @FormDataParam("filename") String filename) {


        Gson gson = new Gson();
        Contact contact;
        try {
            JSONObject jsonContact = new JSONObject(contactJsonString);
            contact = new Contact(jsonContact);

            String relationalUrl = "";

            if(filename != null) {
                filename = filename.replaceAll("\\s+", "");

                Files.copy(uploadedInputStream,
                        Paths.get("./contents/images/contacts/" +  /*fileDetail.getFileName()*/ filename),
                        StandardCopyOption.REPLACE_EXISTING);
                relationalUrl = Utils.RELATIONAL_WEBSITE_URL + "/contents/images/contacts/" + filename;
                contact.setImageUrl(relationalUrl);
            }

            contact.setUserId(user.getId());

            if(contact.getId() != -1 )
                contactDao.update(contact);
            else
                contact.setId(contactDao.insert(contact));

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", contact))).build();
    }


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
    }



}