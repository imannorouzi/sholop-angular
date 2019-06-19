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
import org.skife.jdbi.v2.sqlobject.stringtemplate.UseStringTemplate3StatementLocator;
import org.skife.jdbi.v2.unstable.BindIn;

import java.util.List;


public abstract class ContactDao implements Transactional<ContactDao> {
    @CreateSqlObject
    abstract Dao ttDao();


    public Contact getContactById(int id){ return ttDao().getContactById(id); }

    public List<Contact> getContactByUserId(int userId, String type, String hint){
        return ttDao().getContactsByUserId(userId, type, hint); }


    public List<Contact> getContactByContactIds(List<String> contactIds){
        return ttDao().getContactsByContactIds(contactIds);
    }

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
                contact.getContactType().name(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getAddress(),
                contact.getImageUrl(),
                contact.isValid(),
                contact.getUserId()
        );
    }

    public void delete(int contactId, int userId) {
        ttDao().delete(contactId, userId);
    }

    @UseStringTemplate3StatementLocator
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

        @SqlUpdate("delete from sh_contact where user_id=:user_id and id=:id")
        void delete(
                @Bind("id") int id, @Bind("user_id") int userId);

        @SqlQuery("SELECT * FROM sh_contact WHERE id=:id")
        Contact getContactById(@Bind("id") int id);

        @SqlQuery("SELECT * FROM sh_contact WHERE user_id=:user_id and type=:type and name like CONCAT('%', :hint, '%')")
        List<Contact> getContactsByUserId(@Bind("user_id") int userId,
                                          @Bind("type") String type,
                                          @Bind("hint") String hint);

        @GetGeneratedKeys
        @SqlUpdate("insert into sh_contact (name, type, email, phone, address, image_url, valid, user_id)" +
                " values(:name, :type, :email, :phone, :address, :image_url, :valid, :user_id)")
        int insert(@Bind("name") String name,
                   @Bind("type") String contactType,
                   @Bind("email") String email,
                   @Bind("phone") String phone,
                   @Bind("address") String address,
                   @Bind("image_url") String imageUrl,
                   @Bind("valid") boolean valid,
                   @Bind("user_id") int userId);

        @SqlQuery("SELECT * FROM sh_contact WHERE id in(<contact_ids>)")
        List<Contact> getContactsByContactIds(@BindIn("contact_ids") List<String> contactIds);
    }
}
