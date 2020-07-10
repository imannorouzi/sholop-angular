package com.sholop.api;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.objects.Contact;
import com.sholop.objects.ContactEvent;
import com.sholop.objects.ResponseObject;
import com.sholop.objects.User;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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
                                      @RequestParam("type") String type,
                                      @RequestParam("hint") String hint)  {

        try {

            List<Contact> contacts = null;
            User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
            type = type.isEmpty() ? Contact.CONTACT_TYPE.CONTACT.name() : type;

            if(hint == null || hint.isEmpty()){
                contacts = repositoryFactory.getContactRepository().findAllByUserIdAndContactType(user.getId(), type);
            }else{
                contacts = repositoryFactory.getContactRepository().findAllByUserIdAndContactType(user.getId(), type);
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

            if(filename != null && file != null) {
                filename = "contact_" + user.getId() + "_" + filename.replaceAll("\\s+", "");

                String fileName = fileStorageService.storeFile(file, filename, "/contacts");

                String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/download/contacts/")
                        .path(fileName)
                        .toUriString();

                contact.setImageUrl(fileDownloadUri);
            }

            contact.setUserId(user.getId());

            repositoryFactory.getContactRepository().save(contact);

        } catch (Exception e) {
            e.printStackTrace();

            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", ""))).build();
        }


        return Response.ok(gson.toJson(new ResponseObject("OK", contact))).build();
    }
}
