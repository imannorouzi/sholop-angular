package com.sholop.db.repositories;

import com.sholop.objects.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // custom query to search to blog post by title or content
//    List<Contact> findByTitleContainingOrContentContaining(String name, String textAgain);

    User findByUsername(String username);
}

