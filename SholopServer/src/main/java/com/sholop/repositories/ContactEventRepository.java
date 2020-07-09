package com.sholop.repositories;

import com.sholop.objects.ContactEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactEventRepository extends JpaRepository<ContactEvent, Integer> {

    // custom query to search to blog post by title or content
//    List<Contact> findByTitleContainingOrContentContaining(String name, String textAgain);

    List<ContactEvent> getEventContactsByEventId(int eventId);

    ContactEvent findByUuid(String uuid);

    void deleteByEventId(int eventId);
}

