package com.sholop.api;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.objects.Contact;
import com.sholop.objects.ContactEvent;
import com.sholop.objects.ResponseObject;
import com.sholop.objects.User;
import com.sholop.repositories.RepositoryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@RestController
public class ContactAPIs {

    @Autowired
    RepositoryFactory repositoryFactory;

//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @GetMapping("/contact/{id}")
    public Contact getContact(@PathVariable String id){
        int blogId = Integer.parseInt(id);
        return repositoryFactory.getContactRepository().findById(blogId).orElse(null);
    }


    @PostMapping("/get-contacts")
    public ResponseObject getContacts(@RequestBody User user,
                                @RequestParam("type") String type,
                                @RequestParam("hint") String hint) throws JSONException {

        Gson gson = new Gson();
        try {

            //TODO user ID !!!
            List<Contact> contacts = null;
            type = type.isEmpty() ? Contact.CONTACT_TYPE.CONTACT.name() : type;

            if(hint == null || hint.isEmpty()){
                contacts = repositoryFactory.getContactRepository().findAll();
//                contacts = repositoryFactory.getContactRepository().getContactsByUserId(user.getId(), "", "");
            }else{
                contacts = repositoryFactory.getContactRepository().findAll();
//                contacts = repositoryFactory.getContactRepository().getContactsByUserId(user.getId(), type, hint);
            }

            return new ResponseObject("OK", contacts);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseObject("FAIL", e.getMessage());
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
    public ResponseObject updateContact(@RequestBody User user,
                                  @RequestParam("file") InputStream uploadedInputStream,
//                                  @RequestParam("file") FormDataContentDisposition fileDetail,
//                                  @RequestParam("file") FormDataBodyPart body,
                                  @RequestParam("contact") String contactJsonString,
                                  @RequestParam("filename") String filename) {


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
//                relationalUrl = Utils.RELATIONAL_WEBSITE_URL + "/contents/images/contacts/" + filename;
                contact.setImageUrl(relationalUrl);
            }

            contact.setUserId(user.getId());

            repositoryFactory.getContactRepository().save(contact);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseObject("FAIL", e.getMessage());
        }

        return new ResponseObject("OK", contact);
    }
}
