package com.sholop.db.repositories;

import com.sholop.objects.SholopDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SholopDateRepository extends JpaRepository<SholopDate, Integer> {

    // custom query to search to blog post by title or content
//    List<Contact> findByTitleContainingOrContentContaining(String name, String textAgain);


    List<SholopDate> findAllByEventId(int eventId);

    void deleteByEventId(int eventId);

    @Query( value = "SELECT distinct d.* FROM sh_event s " +
            "inner join sh_event_date d on s.id=d.event_id " +
            "inner join sh_contact_event ec on s.id=ec.event_id " +
            "inner join sh_contact c on c.id=ec.contact_id " +
            "WHERE d.date between :start_date and :end_date " +
            "and event_type=:type " +
            "and (s.chair_id=:user_id or c.email=:email) ", nativeQuery = true)
    List<SholopDate> getDatesByPeriod(@Param("type") String type,
                                      @Param("user_id") int userId,
                                      @Param("email") String email,
                                      @Param("start_date") Date startDate,
                                      @Param("end_date") Date endDate);

}
