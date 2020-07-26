package com.sholop.api;

import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.objects.*;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.FileStorageService;
import com.sholop.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.annotation.security.PermitAll;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@RestController
public class ContactAPIs {

    @Autowired
    RepositoryFactory repositoryFactory;

    @Autowired
    private FileStorageService fileStorageService;

    Gson gson = new Gson();

//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @GetMapping("/contact/{id}")
    public Contact getContact(@PathVariable String id){
        int blogId = Integer.parseInt(id);
        return repositoryFactory.getContactRepository().findById(blogId).orElse(null);
    }


    @GetMapping("/get-contacts")
    public Response getContacts(@AuthenticationPrincipal UserDetails u,
                                @RequestParam("hint") String hint)  {

        try {

            List<Contact> contacts = null;
            User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());

            if(hint == null || hint.isEmpty()){
                contacts = repositoryFactory.getContactRepository().findAllByUserId(user.getId());
            }else{
                contacts = repositoryFactory.getContactRepository().findAllByUserId(user.getId());
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", contacts))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", e.getMessage()))).build();
        }
    }

    @PostMapping("/update-contact-status")
    public ResponseObject updateContactStatus(@RequestBody User user, String objectString){

        Gson gson = new Gson();
        try {
            JSONObject jsonObject = new JSONObject(objectString);

            Optional<ContactEvent> contactEvent = repositoryFactory.getContactEventRepository().findById(jsonObject.getInt("contactEventId"));
            if(contactEvent.isPresent()){
                contactEvent.get().setStatus(ContactEvent.STATUS.valueOf(jsonObject.getString("status")));
                repositoryFactory.getContactEventRepository().save(contactEvent.get());
                return new ResponseObject("OK", contactEvent);
            }else{
                return new ResponseObject("FAIL", contactEvent);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseObject("FAIL", e.getMessage());
        }
    }


    @PostMapping("/update-contact")
    public Response updateContact(@AuthenticationPrincipal UserDetails u,
                                  @RequestParam(value = "file", required = false) MultipartFile file,
                                  @RequestParam("contact") String contactJsonString,
                                  @RequestParam(value = "filename", required = false) String filename) {


        User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        Contact contact;
        try {
            JSONObject jsonContact = new JSONObject(contactJsonString);
            contact = new Contact(jsonContact);

            // check if any user has been registered with the same email
            User cu = repositoryFactory.getUserRepository().findByUsername(contact.getEmail());
            if(cu != null && // found one with the same email
                    (
                            (cu.getParentId() != -1 && cu.getParentId().equals(user.getParentId())) || // under the same manager
                                    (cu.getParentId() == user.getId()) // under me
                    )
            ){
                return Response.ok(gson.toJson(new ResponseObject("USER_EXISTS", cu))).build();
            }

            Contact repetitive = repositoryFactory.getContactRepository().findFirstByEmailAndUserId(contact.getEmail(), user.getId());
            if(repetitive != null){
                return Response.ok(gson.toJson(new ResponseObject("CONTACT_EXISTS", repetitive))).build();
            }

            if(filename != null && !filename.isEmpty() && file != null) {
                filename = "contact_" + user.getId() + "_" + filename.replaceAll("\\s+", "");

                String fileName = fileStorageService.storeFile(file, filename, "/contacts");

                String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/download/contacts/")
                        .path(fileName)
                        .toUriString();

                contact.setImageUrl(Utils.fixUri(fileDownloadUri));
            }

            contact.setUserId(user.getId());

            contact = repositoryFactory.getContactRepository().save(contact);

        } catch (Exception e) {
            e.printStackTrace();

            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", ""))).build();
        }


        return Response.ok(gson.toJson(new ResponseObject("OK", contact))).build();
    }

    @PermitAll
    @PostMapping("/delete-contact")
    public Response deleteContact( @AuthenticationPrincipal UserDetails u,
                                   @RequestBody Integer id){

        User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        Contact contact = null;
        try {
            contact = repositoryFactory.getContactRepository().findContactById(id);
            if(contact != null && contact.getUserId() == user.getId()){
                repositoryFactory.getContactRepository().delete(contact);
                return Response.ok(gson.toJson(new ResponseObject("OK", contact))).build();
            }else{
                return Response.ok(gson.toJson(new ResponseObject("FAIL", "NOT FOUND."))).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.ok(gson.toJson(new ResponseObject("FAIL", e.getMessage()))).build();
        }

    }
}
