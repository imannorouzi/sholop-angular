package com.sholop.api;

import com.sholop.objects.Comment;
import com.sholop.repositories.RepositoryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class commentAPIs {

    @Autowired
    RepositoryFactory repositoryFactory;

    @GetMapping("/comment/{id}")
    public Comment getComment(@PathVariable String id){
        int blogId = Integer.parseInt(id);
        return repositoryFactory.getCommentRepository().findById(blogId).orElse(null);
    }
}
