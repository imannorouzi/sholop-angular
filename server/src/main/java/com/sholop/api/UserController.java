package com.sholop.api;

/**
 * Created by Pooyan on 11/11/2017.
 */
import com.amazonaws.util.json.JSONObject;
import com.codahale.metrics.annotation.Timed;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.sholop.Utils;
import com.sholop.auth.JWTHelper;
import com.sholop.auth.PasswordHash;
import com.sholop.db.dao.*;
import com.sholop.mail.MailUtils;
import com.sholop.objects.ResponseObject;
import com.sholop.objects.User;
import io.dropwizard.auth.Auth;
import org.apache.commons.io.FilenameUtils;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.annotation.security.PermitAll;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


@Path("/")
@Singleton
@Timed
public class UserController {

    private final EventDao eventDao;
    private final LocationDao locationDao;
    private final SholopDateDao sholopDateDao;
    private final ContactDao contactDao;
    private final ContactEventDao contactEventDao;
    private final UserDao userDao;
    private final CommentDao commentDao;

    @Inject
    public UserController(EventDao eventDao,
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
    @Path("/authenticate")
    public Response authenticate(String jsonSchedule){

        Gson gson = new Gson();
        try {
            JSONObject jsonUser = new JSONObject(jsonSchedule);

            User user = userDao.getUserByUsername(jsonUser.getString("username"));

            if( user != null &&  PasswordHash.check(jsonUser.getString("password"), user.getPassword()) ){
                user.setToken(JWTHelper.createAndSignToken(
                        jsonUser.getString("username"),
                        jsonUser.getString("password")));

                return Response.ok(gson.toJson(new ResponseObject("OK", user)))
                        .build();
            }else{
                return Response.ok(gson.toJson(new ResponseObject("INVALID_CREDENTIALS", null))).build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .entity(gson.toJson(new ResponseObject("Internal Error", 500)))
                    .build();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/authenticate-with-google")
    public Response authenticateWithGoogle(String jsonSchedule){

        Gson gson = new Gson();
        try {
            JSONObject jsonUser = new JSONObject(jsonSchedule);

            User user = userDao.getUserByUsername(jsonUser.getString("username"));
            String plainPassword = Utils.generateRandomString();

            if(user == null){
                // User is not registered, so register him


                User newUser = new User(
                        jsonUser.getString("name"),
                        jsonUser.has("type") ? jsonUser.getString("type") : "",
                        jsonUser.getString("email"),
                        PasswordHash.getSaltedHash(plainPassword),
                        jsonUser.has("imageUrl") ? jsonUser.getString("imageUrl") : "",
                        jsonUser.has("phone") ? jsonUser.getString("phone") : "");

                if(newUser.getImageUrl() != null && !newUser.getImageUrl().isEmpty()){

                    URL url = new URL(newUser.getImageUrl());
                    ReadableByteChannel rbc = Channels.newChannel(url.openStream());


                    FileOutputStream fos = new FileOutputStream("./contents/images/users/" + newUser.getEmail()+ "_" + FilenameUtils.getName(url.getPath()));
                    fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);

                    String relationalUrl = Utils.RELATIONAL_WEBSITE_URL + "/contents/images/users/" + newUser.getEmail()+ "_" +FilenameUtils.getName(url.getPath());
                    newUser.setImageUrl(relationalUrl);
                }

                // To update the id
                MailUtils.sendRegisterMail(newUser);
                newUser.setGooglePassword(newUser.getPassword());
                newUser = userDao.updateUser(newUser);


                newUser.setToken(JWTHelper.createAndSignToken(
                        jsonUser.getString("email"),
                        plainPassword));
                newUser.setPassword("");

                return Response.ok(gson.toJson(new ResponseObject("OK", newUser)))
                        .build();
            }else {

//                user.setGooglePassword(plainPassword);
                userDao.updateGooglePassword(user.getId(), PasswordHash.getSaltedHash(plainPassword));
                user.setToken(JWTHelper.createAndSignToken(
                        user.getUsername(),
                        plainPassword));
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", user)))
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }


    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/register")
    public Response register(String jsonSchedule){

        try {
            JSONObject jsonUser = new JSONObject(jsonSchedule);

            User user = userDao.getUserByUsername(jsonUser.getString("email"));

            Gson gson = new Gson();
            if( user == null ){

                User newUser = new User(
                        jsonUser.getString("name"),jsonUser.has("type") ? jsonUser.getString("type") : "",
                        jsonUser.getString("email"),
                        PasswordHash.getSaltedHash(jsonUser.getString("password")),
                        jsonUser.has("imageUrl") ? jsonUser.getString("imageUrl") : "",
                        jsonUser.has("phone") ? jsonUser.getString("phone") : "");

                // To update the id
                MailUtils.sendRegisterMail(newUser);
                newUser = userDao.updateUser(newUser);

                newUser.setToken(JWTHelper.createAndSignToken(
                        jsonUser.getString("email"),
                        jsonUser.getString("password")));
                newUser.setPassword("");


                return Response.ok(gson.toJson(new ResponseObject("OK", newUser)))
                        .build();
            }else{
                return Response.status(200).entity(gson.toJson(new ResponseObject("DUPLICATE", null))).build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @PermitAll
    @Path("/update-user")
    public Response updateUser(@Auth User u,
                                  @FormDataParam("file") InputStream uploadedInputStream,
                                  @FormDataParam("file") FormDataContentDisposition fileDetail,
                                  @FormDataParam("file") FormDataBodyPart body,
                                  @FormDataParam("user") String userJsonString,
                                  @FormDataParam("filename") String filename)  {


        Gson gson = new Gson();
        User user;
        try {
            JSONObject jsonContact = new JSONObject(userJsonString);
            user = new User(jsonContact);

            String relationalUrl;

            if(filename != null) {
                filename = filename.replaceAll("\\s+", "");

                Files.copy(uploadedInputStream,
                        Paths.get("./contents/images/users/" +  /*fileDetail.getFileName()*/ filename),
                        StandardCopyOption.REPLACE_EXISTING);
                relationalUrl = Utils.RELATIONAL_WEBSITE_URL + "/contents/images/users/" + filename;
                user.setImageUrl(relationalUrl);
            }

            userDao.updateUser(user);

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", user))).build();
    }


}