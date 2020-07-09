package com.sholop.api;

import com.sholop.objects.Event;
import com.sholop.repositories.RepositoryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventAPIs {

    @Autowired
    RepositoryFactory repositoryFactory;

    @GetMapping("/event/{id}")
    public Event getEvent(@PathVariable String id){
        int blogId = Integer.parseInt(id);
        return repositoryFactory.getEventRepository().findById(blogId).orElse(null);
    }

}
