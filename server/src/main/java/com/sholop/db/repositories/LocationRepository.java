package com.sholop.db.repositories;

import com.sholop.objects.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {

    // custom query to search to blog post by title or content
//    List<Location> findByTitleContainingOrContentContaining(String name, String textAgain);

}

