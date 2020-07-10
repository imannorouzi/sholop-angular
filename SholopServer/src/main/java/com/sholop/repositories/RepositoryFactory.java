package com.sholop.repositories;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RepositoryFactory {



    @Autowired
    ContactRepository contactRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ContactEventRepository contactEventRepository;

    @Autowired
    SholopDateRepository sholopDateRepository;

    @Autowired
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
