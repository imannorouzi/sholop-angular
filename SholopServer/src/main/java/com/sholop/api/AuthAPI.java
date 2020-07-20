package com.sholop.api;

import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.auth.JwtTokenUtil;
import com.sholop.auth.JwtUserDetailsService;
import com.sholop.auth.PasswordHash;
import com.sholop.mail.MailUtils;
import com.sholop.objects.Contact;
import com.sholop.objects.ResponseObject;
import com.sholop.objects.User;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.FileStorageService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.ws.rs.core.Response;
import javax.xml.crypto.Data;
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
    private FileStorageService fileStorageService;

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

                // To update the id
                newUser.setConfirmEmailUUID(Utils.generateRandomString());
                newUser = repositoryFactory.getUserRepository().save(newUser);
                newUser.setToken( jwtTokenUtil.generateToken(newUser));
                newUser.setPassword("");

                MailUtils.sendRegisterMail(newUser);
                return Response.ok(gson.toJson(new ResponseObject("OK", newUser)))
                        .build();

            }else if(user.getPassword() == null || "".equals(user.getPassword())){
                return Response.status(200).entity(gson.toJson(new ResponseObject("NO_PASSWORD", null))).build();
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
    public Response updateContact(@AuthenticationPrincipal UserDetails u,
                                  @RequestParam(value = "file", required = false) MultipartFile file,
                                  @RequestParam("user") String userJsonString,
                                  @RequestParam(value = "filename", required = false) String filename) {


        User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        User updatedUser;
        try {
            JSONObject jsonContact = new JSONObject(userJsonString);
            updatedUser = new User(jsonContact);

            if(filename != null && file != null) {
                filename = "user_" + user.getId() + "_" + filename.replaceAll("\\s+", "");
                String fileName = fileStorageService.storeFile(file, filename, "/users");
                String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/download/users/")
                        .path(fileName)
                        .toUriString();

                user.setImageUrl(Utils.fixUri(fileDownloadUri));
            }

            user.setName(updatedUser.getName());
            user.setPhone(updatedUser.getPhone());
            user.setLatitude(updatedUser.getLatitude());
            user.setLongitude(updatedUser.getLongitude());
            user.setFarsiAddress1(updatedUser.getFarsiAddress1());
            user.setFarsiAddress2(updatedUser.getFarsiAddress2());
            user.setDescription(updatedUser.getDescription());

            user = repositoryFactory.getUserRepository().save(user);

        } catch (Exception e) {
            e.printStackTrace();

            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", ""))).build();
        }


        return Response.ok(gson.toJson(new ResponseObject("OK", user))).build();
    }

}
