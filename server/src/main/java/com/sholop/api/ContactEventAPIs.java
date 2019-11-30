package com.sholop.api;

import com.sholop.db.repositories.RepositoryFactory;
import com.sholop.objects.ContactEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ContactEventAPIs {

    @Autowired
    RepositoryFactory repositoryFactory;

    @GetMapping("/contact-event/{id}")
    public ContactEvent getContactEvent(@PathVariable String id){
        int blogId = Integer.parseInt(id);
        return repositoryFactory.getContactEventRepository().findById(blogId).orElse(null);
    }

}
