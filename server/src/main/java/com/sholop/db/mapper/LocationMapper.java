package com.sholop.db.mapper;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.sholop.objects.Event;
import com.sholop.objects.Location;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

public class LocationMapper implements ResultSetMapper<Location>{

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(LocationMapper.class);
    @Override
    public Location map(int i, ResultSet rs, StatementContext sc) throws SQLException {

        Location location = new Location(
                rs.getString("title"),
                rs.getString("description"),
                rs.getString("persian_address_1"),
                rs.getString("persian_address_2"),
                rs.getString("english_address").trim(),
                rs.getDouble("latitude"),
                rs.getDouble("longitude")
        );

        location.setId(rs.getInt("id"));

        return location;
    }
}
