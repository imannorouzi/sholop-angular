package com.sholop.db.mapper;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.google.inject.Inject;
import com.sholop.objects.Contact;
import com.sholop.objects.Event;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ContactMapper implements ResultSetMapper<Contact>{

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(ContactMapper.class);

//    private final LocationDao locationDao;

    @Inject
    public ContactMapper(){
//        this.locationDao = locationDao;
    }

    @Override
    public Contact map(int i, ResultSet rs, StatementContext sc) throws SQLException {

        Contact contact = new Contact(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("phone"),
                rs.getString("email"),
                rs.getString("address"),
                rs.getString("image_url"),
                rs.getInt("user_id"),
                rs.getBoolean("valid"),
                rs.getTimestamp("created"),
                rs.getInt("created_by"),
                rs.getTimestamp("modified"),
                rs.getInt("modified_by")
        );

        return contact;
    }
}
