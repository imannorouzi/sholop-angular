package com.sholop.db.dao;

/**
 * Created by Pooyan
 * on 12/11/2017.
 */

import com.sholop.db.mapper.ContactEventMapper;
import com.sholop.db.mapper.ContactMapper;
import com.sholop.objects.ContactEvent;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;
import org.skife.jdbi.v2.sqlobject.stringtemplate.UseStringTemplate3StatementLocator;

import java.util.List;

public abstract class ContactEventDao implements Transactional<ContactEventDao> {
    @CreateSqlObject
    abstract Dao ttDao();


    public int getEventContactsCount(int eventId){ return ttDao().getEventContactsCount(eventId); }

    public int insert(ContactEvent contact){
        return ttDao().insert(
            contact.getContactId(),
            contact.getEventId(),
            String.valueOf(contact.getStatus())
        );
    }

    public void updateStatus(int id, ContactEvent.STATUS status){
        ttDao().updateStatus(id, status.name());
    }

    public  void deleteEventContacts(int id){
        ttDao().deleteEventContacts(id);
    }

    public List<ContactEvent> getEventContactsByEventId(int eventId) {
        return ttDao().getEventContactsByEventId(eventId);
    }

    @RegisterMapper(ContactEventMapper.class)
    private interface Dao {

        @SqlUpdate("update sh_event_contact set status=:status WHERE id=:id")
        void updateStatus(
                @Bind("id") int id,
                @Bind("status") String status);

        @GetGeneratedKeys
        @SqlUpdate("insert into sh_contact_event (contact_id, event_id, status)" +
                " values(:contact_id, :event_id, :status)")
        int insert(@Bind("contact_id") int contactId,
                   @Bind("event_id") int eventId,
                   @Bind("status") String status);

        @SqlUpdate("select count(1) from sh_event_contact where event_id=:event_id")
        int getEventContactsCount(@Bind("event_id") int eventId);

        @SqlUpdate("delete from sh_contact_event where event_id=:event_id")
        void deleteEventContacts(@Bind("event_id") int id);

        @SqlQuery("select * from sh_contact_event where event_id=:event_id")
        List<ContactEvent> getEventContactsByEventId(@Bind("event_id") int eventId);
    }
}
