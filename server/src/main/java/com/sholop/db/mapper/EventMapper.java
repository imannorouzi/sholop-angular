package com.sholop.db.mapper;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.google.inject.Inject;
import com.sholop.db.dao.ContactEventDao;
import com.sholop.db.dao.LocationDao;
import com.sholop.db.dao.SholopDateDao;
import com.sholop.objects.Event;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

public class EventMapper implements ResultSetMapper<Event>{

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(EventMapper.class);
  /*  private final LocationDao locationDao;
    private final SholopDateDao sholopDateDao;
    private final ContactEventDao contactEventDao;

    @Inject
    public EventMapper(LocationDao locationDao,
                       SholopDateDao sholopDateDao,
                       ContactEventDao contactEventDao){
        this.locationDao = locationDao;
        this.sholopDateDao = sholopDateDao;
        this.contactEventDao = contactEventDao;
    }*/

    @Override
    public Event map(int i, ResultSet rs, StatementContext sc) throws SQLException {

        Event event = new Event(
                rs.getString("event_type"),
                rs.getInt("id"),
                rs.getInt("venue_id"),
                rs.getString("title").trim(),
                rs.getString("description").trim(),
                null,
                rs.getBoolean("confirm_needed"),
                rs.getBoolean("join_via_link"),
                rs.getBoolean("limit_guests"),
                rs.getInt("max_guests"),
                rs.getBoolean("allow_comments"),
                rs.getString("image_url"),
                rs.getString("status")
        );

        return event;
    }
}
