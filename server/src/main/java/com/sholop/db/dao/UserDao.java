package com.sholop.db.dao;

import com.sholop.db.mapper.UserMapper;
import com.sholop.objects.User;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.CreateSqlObject;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;
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
        ttDao().updateUser(user.getUsername(),
                user.getName(),
                user.getEmail());

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
