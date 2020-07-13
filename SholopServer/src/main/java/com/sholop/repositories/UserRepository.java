package com.sholop.repositories;

import com.sholop.objects.Contact;
import com.sholop.objects.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // custom query to search to blog post by title or content
//    List<Contact> findByTitleContainingOrContentContaining(String name, String textAgain);

    User findByUsername(String username);

    List<User> findAllByParentId(int id);

    List<User> findAllByParentIdAndRole(int id, String role);

    List<User> findAllByParentIdOrParentId(int id, int parentId);

    @Query("select s FROM sh_user s WHERE s.id in :ids")
    List<User> getUsersByContactIds(@Param("ids") List<Integer> userIds);
}

