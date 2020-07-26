package com.sholop.repositories;

import com.sholop.objects.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {

    // custom query to search to blog post by title or content
//    List<Contact> findByTitleContainingOrContentContaining(String name, String textAgain);


    List<Contact> findAllByUserIdAndContactType(int userId, String type);

    List<Contact> findAllByUserId(int userId);

    Contact findContactById(int contactId);

    Contact findFirstByEmailAndUserId(String email, int userId);


    @Query("select s FROM sh_contact s WHERE s.id in :ids")
    List<Contact> getContactsByContactIds(@Param("ids") List<Integer> contactIds);
}

