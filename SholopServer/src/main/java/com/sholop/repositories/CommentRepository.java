package com.sholop.repositories;

import com.sholop.objects.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    // custom query to search to blog post by title or content
//    List<Comment> findByTitleContainingOrContentContaining(String name, String textAgain);

    Page<Comment> findAllByEventId(int eventId, Pageable pr);
}

