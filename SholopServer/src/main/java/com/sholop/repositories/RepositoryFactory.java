package com.sholop.repositories;


import com.sholop.objects.SholopDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Singleton;

@Service
public class RepositoryFactory {


    ContactRepository contactRepository;
    CommentRepository commentRepository;
    EventRepository eventRepository;

    @Autowired
    UserRepository userRepository;
    ContactEventRepository contactEventRepository;
    SholopDateRepository sholopDateRepository;
    LocationRepository locationRepository;

    public RepositoryFactory(){
    }


    public ContactRepository getContactRepository() {
        return contactRepository;
    }

    public CommentRepository getCommentRepository() {
        return commentRepository;
    }

    public EventRepository getEventRepository() {
        return eventRepository;
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }

    public ContactEventRepository getContactEventRepository() {
        return contactEventRepository;
    }

    public SholopDateRepository getSholopDateRepository() {
        return sholopDateRepository;
    }

    public LocationRepository getLocationRepository() {
        return locationRepository;
    }
}
