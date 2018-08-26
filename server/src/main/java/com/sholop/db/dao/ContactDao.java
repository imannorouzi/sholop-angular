package com.sholop.db.dao;

/**
 * Created by Pooyan
 * on 12/11/2017.
 */

import com.sholop.db.mapper.ContactMapper;
import com.sholop.objects.Contact;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;

import java.util.List;


public abstract class ContactDao implements Transactional<ContactDao> {
    @CreateSqlObject
    abstract Dao ttDao();


    public Contact getContactById(int id){ return ttDao().getContactById(id); }

    public List<Contact> getContactByUserId(int userId){ return ttDao().getContactsByUserId(userId); }

    public Contact update(Contact contact){
        ttDao().updateContact(contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getAddress(),
                contact.getImageUrl(),
                contact.getId(),
                contact.getUserId());

        return contact;
    }

    public int insert(Contact contact){
        return ttDao().insert(
            contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getAddress(),
                contact.isValid(),
                contact.getUserId()
        );
    }

    public void delete(int contactId, int userId) {
        ttDao().delete(contactId, userId);
    }

    @RegisterMapper(ContactMapper.class)
    private interface Dao {

        @SqlUpdate("update sh_contact set name=:name, email=:email, address=:address, phone=:phone, image_url=:image_url" +
                " where id=:id and user_id=:user_id")
        void updateContact(@Bind("name") String name,
                           @Bind("email") String email,
                           @Bind("phone") String phone,
                           @Bind("address") String address,
                           @Bind("image_url") String imageUrl,
                           @Bind("id") int id,
                           @Bind("user_id") int userId);

        @SqlUpdate("update sh_contact set is_active = false where user_id=:user_id and id=:id")
        void delete(
                @Bind("id") int id, @Bind("user_id") int userId);

        @SqlQuery("SELECT * FROM as_users WHERE upper(username)=upper(:username)")
        Contact getContactById(@Bind("id") int id);

        @SqlQuery("SELECT * FROM sh_contact WHERE user_id=:user_id")
        List<Contact> getContactsByUserId(@Bind("user_id") int user_id);

        @GetGeneratedKeys
        @SqlUpdate("insert into sh_contact (name, email, phone, address, valid, user_id)" +
                " values(:name, :email, :phone, :address, :valid, :user_id)")
        int insert(@Bind("name") String name,
                   @Bind("email") String email,
                   @Bind("phone") String phone,
                   @Bind("address") String address,
                   @Bind("valid") boolean valid,
                   @Bind("user_id") int userId);
    }
}
