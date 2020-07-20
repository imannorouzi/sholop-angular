package com.sholop.repositories;

import com.sholop.objects.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {

    // custom query to search to blog post by title or content
    List<Location> findAllByUserIdAndIsActive(Integer userId, boolean isActive);

}

