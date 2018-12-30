package com.sholop.db.dao;

/**
 * Created by Pooyan
 * on 12/11/2017.
 */

import com.sholop.db.mapper.ContactEventMapper;
import com.sholop.objects.ContactEvent;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;

import java.util.List;

public abstract class ContactEventDao implements Transactional<ContactEventDao> {
    @CreateSqlObject
    abstract Dao ttDao();


    public int getEventContactsCount(int eventId){ return ttDao().getEventContactsCount(eventId); }

    public ContactEvent getEventContactByUUID(String uuid){ return ttDao().getEventContactByUUID(uuid); }

    public int insert(ContactEvent contact){
        return ttDao().insert(
            contact.getContactId(),
            contact.getEventId(),
            String.valueOf(contact.getStatus()),
                contact.getUuid(),
                contact.getQRCodeUrl()
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

        @SqlUpdate("update sh_contact_event set status=:status WHERE id=:id")
        void updateStatus(
                @Bind("id") int id,
                @Bind("status") String status);

        @GetGeneratedKeys
        @SqlUpdate("insert into sh_contact_event (contact_id, event_id, status, qr_code_url, uuid)" +
                " values(:contact_id, :event_id, :status, :qr_code_url, :uuid)")
        int insert(@Bind("contact_id") int contactId,
                   @Bind("event_id") int eventId,
                   @Bind("status") String status,
                   @Bind("uuid") String uuid,
                   @Bind("qr_code_url") String qr_code_url);

        @SqlUpdate("select count(1) from sh_event_contact where event_id=:event_id")
        int getEventContactsCount(@Bind("event_id") int eventId);

        @SqlUpdate("delete from sh_contact_event where event_id=:event_id")
        void deleteEventContacts(@Bind("event_id") int id);

        @SqlQuery("select * from sh_contact_event where event_id=:event_id")
        List<ContactEvent> getEventContactsByEventId(@Bind("event_id") int eventId);

        @SqlQuery("select * from sh_contact_event where uuid=:uuid")
        ContactEvent getEventContactByUUID(@Bind("uuid") String uuid);
    }
}
