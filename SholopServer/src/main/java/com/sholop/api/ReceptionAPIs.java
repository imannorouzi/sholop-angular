package com.sholop.api;

import com.amazonaws.util.json.JSONArray;
import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class ReceptionAPIs {


    @Autowired
    RepositoryFactory repositoryFactory;

    @Autowired
    private FileStorageService fileStorageService;

    Gson gson = new Gson();

    @GetMapping("/get-reception")
    public Response getMeetings( @AuthenticationPrincipal UserDetails u,
                                 @QueryParam("uuid") String uuid)  {

        User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        try {

            ContactEvent ce = repositoryFactory.getContactEventRepository().findByUuid(uuid);

            if(ce != null){

                Contact c = repositoryFactory.getContactRepository().findContactById(ce.getContactId());
                if(c == null){
                    c = new Contact();
                    c.setEmail(ce.getEmail());
                    c.setName(ce.getName());
                    c.setPhone(ce.getPhone());
                }

                //TODO: Check if user has permission to view this event
                Optional<Event> event = repositoryFactory.getEventRepository().findById(ce.getEventId());

                if(event.isPresent()){
                    return Response.ok(gson.toJson(new ResponseObject("OK", new Reception(event.get(), c)))).build();
                }
            }


            return Response.ok(gson.toJson(new ResponseObject("NOT_FOUND", ""))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", e.getMessage())))
                    .build();
        }
    }

    private class Reception {
        Event event;
        Contact contact;
        public Reception(Event event, Contact c) {
            this.event = event;
            this.contact = c;
        }
    }
}
