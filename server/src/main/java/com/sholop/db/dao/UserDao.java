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

    public User updateUser(User user){
        if( user.getId() == -1){
            int id = ttDao().insert(user.getUsername(),
                    user.getEmail(),
                    user.getName(),
                    user.getPhone(),
                    user.getImageUrl(),
                    user.getPassword());

            user.setId(id);
        }else {
            ttDao().updateUser(user.getUsername(),
                    user.getName(),
                    user.getEmail());
        }
        return user;
    }

    public void updatePassword(String username, String newPassword){
        ttDao().updatePassword(username, newPassword);
    }

    public void updateFullName(String username, String fullName){
        ttDao().updateFullName(username, fullName);
    }

    @RegisterMapper(UserMapper.class)
    private interface Dao {
        @SqlQuery("SELECT * FROM as_lines WHERE 1=1 ORDER BY 1 ")
        List<User> listAllUsers();

        @SqlUpdate("update sh_user set full_name=:full_name, email=:email WHERE username=:username")
        void updateUser(@Bind("username") String username,
                        @Bind("full_name") String name,
                        @Bind("email") String email);


        @GetGeneratedKeys
        @SqlUpdate("insert into sh_user (full_name, email, username, password, phone, image_url) values (:full_name, :email, :username, :password, :phone, :image_url)")
        int insert(@Bind("username") String username,
                        @Bind("email") String email,
                        @Bind("full_name") String name,
                        @Bind("phone") String phone,
                        @Bind("image_url") String imageUrl,
                        @Bind("password") String password);


        @SqlQuery("SELECT * FROM sh_user WHERE upper(username)=upper(:username)")
        User getUserByUsername(@Bind("username") String username);

        @SqlUpdate("update sh_user set full_name=:name WHERE username=:username")
        void updateFullName(@Bind("username") String username,
                            @Bind("name") String name);

        @SqlUpdate("update sh_user set password=:password WHERE username=:username")
        void updatePassword(@Bind("username") String username,
                            @Bind("password") String password);
    }
}
