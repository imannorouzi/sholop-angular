package com.sholop.db.dao;

import com.sholop.db.mapper.UserMapper;
import com.sholop.objects.User;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;

import java.util.List;

public abstract class UserDao implements Transactional<UserDao> {
    @CreateSqlObject
    abstract Dao ttDao();

    public List<User> getAllUsers(){
        return ttDao().listAllUsers();
    }

    public User getUserByUsername(String username ){ return ttDao().getUserByUsername(username); }

    public User getUserById(int id ){ return ttDao().getUserById(id); }

    public User updateUser(User user){
        if( user.getId() == -1){
            int id = ttDao().insert(user.getUsername(),
                    user.getUserType().name(),
                    user.getEmail(),
                    user.getName(),
                    user.getPhone(),
                    user.getImageUrl(),
                    user.getPassword(),
                    user.getGooglePassword(),
                    user.getFarsiAddress1(),
                    user.getFarsiAddress2(),
                    user.getLatitude(),
                    user.getLongitude(),
                    user.getDescription());

            user.setId(id);
        }else {
            ttDao().updateUser(user.getUsername(),
                    user.getUserType().name(),
                    user.getName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getFarsiAddress1(),
                    user.getFarsiAddress2(),
                    user.getLatitude(),
                    user.getLongitude(),
                    user.getDescription(),
                    user.getImageUrl());
        }
        return user;
    }

    public void updatePassword(String username, String newPassword){
        ttDao().updatePassword(username, newPassword);
    }

    public void updateFullName(String username, String fullName){
        ttDao().updateFullName(username, fullName);
    }

    public void updateGooglePassword(int id, String googlePassword){
        ttDao().updateGooglePassword(id, googlePassword);
    }

    @RegisterMapper(UserMapper.class)
    private interface Dao {
        @SqlQuery("SELECT * FROM sh_users WHERE 1=1 ORDER BY 1 ")
        List<User> listAllUsers();

        @SqlUpdate("update sh_user set full_name=:full_name, type=:type, email=:email, phone=:phone, " +
                "persian_address_1=:persian_address_1, " +
                "persian_address_2=:persian_address_2, " +
                "latitude=:latitude, " +
                "longitude=:longitude, " +
                "description=:description, " +
                "image_url=:image_url " +
                "WHERE username=:username")
        void updateUser(@Bind("username") String username,
                        @Bind("type") String type,
                        @Bind("full_name") String name,
                        @Bind("email") String email,
                        @Bind("phone") String phone,
                        @Bind("persian_address_1") String farsiAddress1,
                        @Bind("persian_address_2") String farsiAddress2,
                        @Bind("latitude") double latitude,
                        @Bind("longitude") double longitude,
                        @Bind("description") String description,
                        @Bind("image_url") String imageUrl);


        @GetGeneratedKeys
        @SqlUpdate("insert into sh_user " +
                "(full_name, " +
                "type, " +
                "email, " +
                "username, " +
                "password, " +
                "google_password, " +
                "phone, " +
                "image_url," +
                "persian_address_1," +
                "persian_address_2," +
                "latitude," +
                "longitude," +
                "description) " +
                "values " +
                "(:full_name, " +
                ":type," +
                ":email," +
                ":username, " +
                ":password, " +
                ":google_password, " +
                ":phone, " +
                ":image_url," +
                ":persian_address_1," +
                ":persian_address_2," +
                ":latitude," +
                ":longitude," +
                ":description)")
        int insert(@Bind("username") String username,
                   @Bind("type") String type,
                   @Bind("email") String email,
                   @Bind("full_name") String name,
                   @Bind("phone") String phone,
                   @Bind("image_url") String imageUrl,
                   @Bind("password") String password,
                   @Bind("google_password") String googlePassword,
                   @Bind("persian_address_1") String farsiAddress1,
                   @Bind("persian_address_2") String farsiAddress2,
                   @Bind("latitude") double latitude,
                   @Bind("longitude") double longitude,
                   @Bind("description") String description);


        @SqlQuery("SELECT * FROM sh_user WHERE upper(username)=upper(:username)")
        User getUserByUsername(@Bind("username") String username);

        @SqlQuery("SELECT * FROM sh_user WHERE id=:id")
        User getUserById(@Bind("id") int id);

        @SqlUpdate("update sh_user set full_name=:name WHERE username=:username")
        void updateFullName(@Bind("username") String username,
                            @Bind("name") String name);

        @SqlUpdate("update sh_user set password=:password WHERE username=:username")
        void updatePassword(@Bind("username") String username,
                            @Bind("password") String password);

        @SqlUpdate("update sh_user set google_password=:password WHERE id=:id")
        void updateGooglePassword(@Bind("id") int id, @Bind("password") String googlePassword);
    }
}
