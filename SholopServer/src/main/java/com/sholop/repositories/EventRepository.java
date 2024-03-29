package com.sholop.repositories;

import com.sholop.objects.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

//Mohammed test comments    
// custom query to search to blog post by title or content
//    List<Contact> findByTitleContainingOrContentContaining(String name, String textAgain);


    @Query(value = "SELECT distinct s.* FROM sh_event s " +
            "inner join sh_event_date d on s.id=d.event_id " +
            "inner join sh_contact_event ec on s.id=ec.event_id " +
            "inner join sh_contact c on c.id=ec.contact_id " +
            "WHERE d.date=:date and event_type=:type " +
            "and (s.chair_id=:user_id or c.email=:email) ", nativeQuery=true)
    List<Event> getEventsByType(@Param("type") String type,
                                @Param("user_id") int userId,
                                @Param("email") String email,
                                @Param("date") Date date);


    @Query( value = "select distinct e.* from sh_event e " +
            "inner join sh_contact_event sce on e.id = sce.event_id " +
            "where " +
            " exists( select 1 from sh_event_date ed where ed.event_id = e.id and " +
            " ((:showAll = false && ed.date = :date) || (:showAll = true && ed.date >= :date) ) ) and " +
            " ( e.chair_id = :user_id " +
            "      or sce.email = :email ) ", nativeQuery = true)
    List<Event> findMyMeetings(@Param("user_id") int userId,
                               @Param("email") String email,
                               @Param("date") Timestamp date,
                               @Param("showAll") Boolean showAll);

    @Query( value = "select distinct e.* from sh_event e " +
            "inner join sh_contact_event sce on e.id = sce.event_id " +
            "where " +
            " exists( select 1 from sh_event_date ed where ed.event_id = e.id and " +
            " (ed.date between :date and  DATE(DATE_ADD(:date, INTERVAL + :period  DAY)) ) ) and " +
            " ( e.chair_id = :user_id " +
            "      or sce.email = :email ) ", nativeQuery = true)
    List<Event> findMyMeetingsByPeriod(@Param("user_id") int userId,
                               @Param("email") String email,
                               @Param("date") Timestamp date,
                               @Param("period") Integer period);

    List<Event> findAllByEventType(String type);


    @Query("select s FROM sh_event s WHERE s.id in :ids")
    List<Event> getEventsByIds(@Param("ids") List<Integer> eventIDs);

}

