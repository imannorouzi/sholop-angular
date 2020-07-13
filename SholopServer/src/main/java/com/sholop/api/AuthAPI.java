package com.sholop.api;

import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.auth.JwtTokenUtil;
import com.sholop.auth.JwtUserDetailsService;
import com.sholop.auth.PasswordHash;
import com.sholop.mail.MailUtils;
import com.sholop.objects.ResponseObject;
import com.sholop.objects.User;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.Utils;
import org.apache.commons.io.FilenameUtils;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@CrossOrigin
public class AuthAPI {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;


    @Autowired
    RepositoryFactory repositoryFactory;

    @Autowired
    private AuthenticationManager authenticationManager;

    Gson gson = new Gson();

    public AuthAPI() {
    }


    @GetMapping("/user/{id}")
    public User getUser(@PathVariable String id){
        int blogId = Integer.parseInt(id);
        return repositoryFactory.getUserRepository().findById(blogId).orElse(null);
    }

    private void authenticate(String username, String password)  {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new DisabledException("USER_DISABLED", e);
        } catch (BadCredentialsException  e) {
            throw new BadCredentialsException("INVALID_CREDENTIALS", e);
        }
    }


    @CrossOrigin
    @PostMapping("/authenticate")
    public Response authenticate(@RequestBody String jsonSchedule){

        Gson gson = new Gson();
        try {
            JSONObject jsonUser = new JSONObject(jsonSchedule);

            authenticate(jsonUser.getString("username"), jsonUser.getString("password"));
            User user = repositoryFactory.getUserRepository().findByUsername(jsonUser.getString("username"));

            user.setToken( jwtTokenUtil.generateToken(user));
            return Response.ok(gson.toJson(new ResponseObject("OK", user)))
                    .build();

        } catch (DisabledException | BadCredentialsException e) {
            return Response.ok(gson.toJson(new ResponseObject("INVALID_CREDENTIALS", null))).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .entity(gson.toJson(new ResponseObject("Internal Error", 500)))
                    .build();
        }
    }

    @PostMapping("/register")
    public Response register(@RequestBody String jsonSchedule){

        try {
            JSONObject jsonUser = new JSONObject(jsonSchedule);

            User user = repositoryFactory.getUserRepository().findByUsername(jsonUser.getString("email"));

            if( user == null ){

                BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
                User newUser = new User(
                        jsonUser.getString("name"),jsonUser.has("type") ? jsonUser.getString("type") : "",
                        jsonUser.getString("email"),
                        bCryptPasswordEncoder.encode(jsonUser.getString("password")),
                        jsonUser.has("imageUrl") ? jsonUser.getString("imageUrl") : "",
                        jsonUser.has("phone") ? jsonUser.getString("phone") : "");

//                MailUtils.sendRegisterMail(newUser);
                // To update the id
                newUser = repositoryFactory.getUserRepository().save(newUser);
                newUser.setToken( jwtTokenUtil.generateToken(newUser));
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

    @PostMapping("/authenticate-with-google")
    public Response authenticateWithGoogle(String jsonSchedule){

        Gson gson = new Gson();
        try {
            JSONObject jsonUser = new JSONObject(jsonSchedule);

            User user = repositoryFactory.getUserRepository().findByUsername(jsonUser.getString("username"));
            String plainPassword = Utils.generateRandomString();

            if(user == null){
                // User is not registered, so register him

                User newUser = new User(
                        jsonUser.getString("name"),
                        jsonUser.has("type") ? jsonUser.getString("type") : "",
                        jsonUser.getString("email"),
                        /*PasswordHash.getSaltedHash(plainPassword)*/ "",
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
                newUser = repositoryFactory.getUserRepository().save(newUser);


                /*newUser.setToken(JWTHelper.createAndSignToken(
                        jsonUser.getString("email"),
                        plainPassword));*/
                newUser.setPassword("");

                return Response.ok(gson.toJson(new ResponseObject("OK", newUser)))
                        .build();
            }else {

//                user.setGooglePassword(plainPassword);
                user.setGooglePassword(/*PasswordHash.getSaltedHash(plainPassword)*/ "");
                repositoryFactory.getUserRepository().save(user);
                user.setToken(/*JWTHelper.createAndSignToken(
                        user.getUsername(),
                        plainPassword)*/"");
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", user)))
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }


    @PostMapping("/update-user")
    public Response updateUser( User u,
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

            repositoryFactory.getUserRepository().save(user);

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", user))).build();
    }

}
