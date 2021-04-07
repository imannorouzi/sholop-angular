package com.sholop.api;

import com.google.gson.Gson;
import com.sholop.objects.*;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.FileStorageService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import java.util.Optional;

@RestController
public class ReceptionAPIs {

    final RepositoryFactory repositoryFactory;

    private final FileStorageService fileStorageService;

    Gson gson = new Gson();

    public ReceptionAPIs(RepositoryFactory repositoryFactory, FileStorageService fileStorageService) {
        this.repositoryFactory = repositoryFactory;
        this.fileStorageService = fileStorageService;
    }

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
