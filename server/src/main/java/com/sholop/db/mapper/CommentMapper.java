package com.sholop.db.mapper;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.google.inject.Inject;
import com.sholop.objects.Comment;
import com.sholop.objects.Contact;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CommentMapper implements ResultSetMapper<Comment>{

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(CommentMapper.class);

//    private final LocationDao locationDao;

    @Inject
    public CommentMapper(){
//        this.locationDao = locationDao;
    }

    @Override
    public Comment map(int i, ResultSet rs, StatementContext sc) throws SQLException {

        /*int id,
             int userId,
             int eventId,
             String text,
             int inReplyTo,
             String status,
             Timestamp created,
             Timestamp modified*/
        Comment comment = new Comment(
                rs.getInt("id"),
                rs.getInt("user_id"),
                rs.getInt("event_id"),
                rs.getString("text"),
                rs.getInt("in_reply_to"),
                rs.getString("status"),
                rs.getTimestamp("created"),
                rs.getTimestamp("modified")
        );

        comment.setUserName(rs.getString("full_name"));
        comment.setUserImageUrl(rs.getString("image_url"));

        return comment;
    }
}
