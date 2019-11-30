package com.sholop.api;

import com.sholop.db.repositories.RepositoryFactory;
import com.sholop.objects.SholopDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class sholopDateAPIs {

    @Autowired
    RepositoryFactory repositoryFactory;

    @GetMapping("/sholop-date/{id}")
    public SholopDate getSholopDate(@PathVariable String id){
        int blogId = Integer.parseInt(id);
        return repositoryFactory.getSholopDateRepository().findById(blogId).orElse(null);
    }

}
