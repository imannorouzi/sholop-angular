package com.sholop.db.dao;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.sholop.db.mapper.EventMapper;
import com.sholop.objects.Event;
import org.joda.time.DateTime;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;


public abstract class EventDao implements Transactional<EventDao> {
    @CreateSqlObject
    abstract Dao ttDao();

    public List<Event> getAllEvents(){
        return ttDao().listAllEvents();
    }

    public Event getEventById(int id){ return ttDao().getEventById(id); }

    public Event update(Event event){
        ttDao().update(
                event.getId(),
                event.getUserId(),
                event.getTitle(),
                event.getDescription(),
                event.getVenueId(),
                event.isConfirmNeeded(),
                event.isAllowJoinViaLink(),
                event.isLimitGuests(),
                event.getMaxGuests(),
                event.isAllowComments(),
                event.getTags());

        return event;
    }

    public int insert(Event event){
        return ttDao().insert(
                event.getTitle(),
                event.getDescription(),
                event.getVenueId(),
                event.getUserId(),
                event.isConfirmNeeded(),
                event.isAllowJoinViaLink(),
                event.isLimitGuests(),
                event.getMaxGuests(),
                event.isAllowComments(),
                event.getLink(),
                event.getTags(),
                event.getEventType().name(),
                event.getCreatedBy()
        );
    }

    public void stepTwoUpdate(Event event){
        ttDao().stepTwoUpdate(event.getId(),
                event.getImageUrl(),
                event.getTags());
    }

    public void updateImageUrl(int id, String url) {
        ttDao().updateImageUrl(id, url);
    }

    public List<Event> getEventsByType(String eventType, Date date){
        return ttDao().getEventsByType(eventType, date);
    }

    public Event getEventById(String eventType, int meetingId) {
        return ttDao().getEventById(eventType, meetingId);
    }

    @RegisterMapper(EventMapper.class)
    private interface Dao {
        @SqlQuery("SELECT * FROM sh_event WHERE 1=1 ORDER BY 1 ")
        List<Event> listAllEvents();

        @SqlQuery("SELECT s.* FROM sh_event s inner join sh_event_date d on s.id=d.event_id WHERE d.date=:date and event_type=:type")
        List<Event> getEventsByType(@Bind("type") String type, @Bind("date") Date date);

        @SqlQuery("SELECT s.* FROM sh_event s inner join sh_event_date d on s.id=d.event_id WHERE s.id=:id and event_type=:type")
        Event getEventById(@Bind("type") String type, @Bind("id") int id);

        @SqlUpdate("update sh_event set title=:title, description=:description, venue_id=:venue_id," +
                " confirm_needed=:confirm_needed, join_via_link=:join_via_link, limit_guests=:limit_guests," +
                " max_guests=:max_guests, allow_comments=:allow_comments, tags=:tags " +
                " where user_id=:user_id and id=:id")
        int stepTwoUpdate(
                @Bind("id") int id,
                @Bind("image_url") String imageUrl,
                @Bind("tags") String tags);

        @SqlUpdate("update sh_event set title=:title, description=:description, venue_id=:venue_id," +
                " confirm_needed=:confirm_needed, join_via_link=:join_via_link, limit_guests=:limit_guests," +
                " max_guests=:max_guests, allow_comments=:allow_comments, tags=:tags " +
                " where user_id=:user_id and id=:id")
        int update(
                @Bind("id") int id,
                @Bind("user_id") int userId,
                @Bind("title") String title,
                @Bind("description") String description,
                @Bind("venue_id") int venueId,
                @Bind("confirm_needed") boolean confirmNeeded,
                @Bind("join_via_link") boolean allowJoinViaLink,
                @Bind("limit_guests") boolean limitGuests,
                @Bind("max_guests") int maxGuests,
                @Bind("allow_comments") boolean allowComments,
                @Bind("tags") String tags);

        @SqlQuery("SELECT * FROM as_users WHERE upper(username)=upper(:username)")
        Event getEventById(@Bind("id") int id);

        @SqlUpdate("update as_users set full_name=:name WHERE username=:username")
        void updateFullName(@Bind("username") String username,
                            @Bind("name") String name);

        @SqlUpdate("update as_users set password=:password WHERE username=:username")
        void updatePassword(@Bind("username") String username,
                            @Bind("password") String password);

        @GetGeneratedKeys
        @SqlUpdate("insert into sh_event (title, description, venue_id, user_id, confirm_needed, join_via_link, limit_guests, max_guests, allow_comments, link, tags, event_type, created_by)" +
                " values(:title, :description, :venue_id, :user_id, :confirm_needed, :join_via_link, :limit_guests, :max_guests, :allow_comments, :link, :tags, :event_type, :created_by)")
        int insert(@Bind("title") String title,
                   @Bind("description") String description,
                   @Bind("venue_id") int venueId,
                   @Bind("user_id") int userId,
                   @Bind("confirm_needed") boolean confirmNeeded,
                   @Bind("join_via_link") boolean allowJoinViaLink,
                   @Bind("limit_guests") boolean limitGuests,
                   @Bind("max_guests") int maxGuests,
                   @Bind("allow_comments") boolean allowComments,
                   @Bind("link") String link,
                   @Bind("tags") String tags,
                   @Bind("event_type") String eventType,
                   @Bind("created_by") int createdBy);

        @SqlUpdate("update sh_event set image_url=:image_url WHERE id=:event_id")
        void updateImageUrl(@Bind("event_id") int id,
                            @Bind("image_url") String url);
    }
}
