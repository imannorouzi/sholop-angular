package com.sholop.db.mapper;

import com.sholop.objects.User;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserMapper implements ResultSetMapper<User>{

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(UserMapper.class);

    @Override
    public User map(int i, ResultSet rs, StatementContext sc) throws SQLException {

        return new User(
                rs.getInt("id"),
                rs.getString("full_name").trim(),
                rs.getString("username").trim(),
                rs.getString("password").trim(),
                rs.getString("email").trim(),
                rs.getString("image_url").trim(),
                rs.getString("phone"),
                rs.getDouble("latitude"),
                rs.getDouble("longitude"),
                rs.getString("persian_address_1"),
                rs.getString("persian_address_2"),
                rs.getString("description"),
                rs.getString("roles"),
                rs.getTimestamp("created"),
                rs.getInt("created_by"),
                rs.getTimestamp("modified"),
                rs.getInt("modified_by")
        );
    }
}
