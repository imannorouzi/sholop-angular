package com.sholop.db.mapper;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.google.inject.Inject;
import com.sholop.objects.Contact;
import com.sholop.objects.ContactEvent;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ContactEventMapper implements ResultSetMapper<ContactEvent>{

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(ContactEventMapper.class);

    @Inject
    public ContactEventMapper(){
//        this.locationDao = locationDao;
    }

    @Override
    public ContactEvent map(int i, ResultSet rs, StatementContext sc) throws SQLException {

        ContactEvent contact = new ContactEvent(
                rs.getInt("id"),
                rs.getInt("contact_id"),
                rs.getInt("event_id"),
                rs.getString("status"),
                rs.getTimestamp("created"),
                rs.getInt("created_by"),
                rs.getTimestamp("modified"),
                rs.getInt("modified_by")
        );

        return contact;
    }
}
