package com.sholop.db.dao;

/**
 * Created by Pooyan
 * on 12/11/2017.
 */

import com.sholop.db.mapper.CommentMapper;
import com.sholop.db.mapper.ContactMapper;
import com.sholop.objects.Comment;
import com.sholop.objects.Contact;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;
import org.skife.jdbi.v2.sqlobject.stringtemplate.UseStringTemplate3StatementLocator;
import org.skife.jdbi.v2.unstable.BindIn;

import java.util.List;


public abstract class CommentDao implements Transactional<CommentDao> {
    @CreateSqlObject
    abstract Dao ttDao();


    public List<Comment> getCommentsByEventId(int eventId, int page){ return ttDao().getCommentsByEventId(eventId, page*5); }


    public int insert(Comment comment){
        return ttDao().insert(
            comment.getUserId(),
                comment.getEventId(),
                comment.getText(),
                comment.getInReplyTo(),
                comment.getStatus()
        );
    }

    public void delete(int commentId, int userId) {
        ttDao().delete(commentId, userId);
    }

    @UseStringTemplate3StatementLocator
    @RegisterMapper(CommentMapper.class)
    private interface Dao {



        @SqlUpdate("delete from sh_comment where user_id=:user_id and id=:id")
        void delete(
                @Bind("id") int id, @Bind("user_id") int userId);

        @SqlQuery("SELECT * FROM sh_comment c, sh_user u WHERE event_id=:event_id and " +
                "u.id = c.user_id limit :offset, 5")
        List<Comment> getCommentsByEventId(@Bind("event_id") int eventId, @Bind("offset") int offset);

        @GetGeneratedKeys
        @SqlUpdate("insert into sh_comment (user_id, event_id, text, in_reply_to, status)" +
                " values(:user_id, :event_id, :text, :in_reply_to, :status)")
        int insert(@Bind("user_id") int userId,
                   @Bind("event_id") int eventId,
                   @Bind("text") String text,
                   @Bind("in_reply_to") int inReplyTo,
                   @Bind("status") String status);

    }
}
