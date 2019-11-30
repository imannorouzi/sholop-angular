package com.sholop.db.repositories;

import org.springframework.beans.factory.annotation.Autowired;

import javax.inject.Singleton;

@Singleton
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
