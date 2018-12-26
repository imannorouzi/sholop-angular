package com.sholop.db.mapper;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.google.inject.Inject;
import com.sholop.objects.Event;
import com.sholop.objects.SholopDate;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;

public class SholopDateMapper implements ResultSetMapper<SholopDate>{

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(SholopDateMapper.class);


    @Override
    public SholopDate map(int i, ResultSet rs, StatementContext sc) throws SQLException {
        SholopDate date = null;
        try {
            date = new SholopDate(
                        rs.getInt("id"),
                        rs.getInt("event_id"),
                        rs.getString("date"),
                        rs.getString("date_string"),
                        rs.getString("start_time_string"),
                        rs.getString("end_time_string")
                );
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return date;
    }
}
