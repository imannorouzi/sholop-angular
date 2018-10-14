package com.sholop.auth;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.inject.Inject;
import com.sholop.db.dao.UserDao;
import com.sholop.objects.User;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.Authenticator;

import java.util.Optional;

public class SchedulerAuthenticator implements Authenticator<String, User>{

    private final UserDao userDao;

    @Inject
    public SchedulerAuthenticator(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public Optional<User> authenticate(String token) throws AuthenticationException {

        /*DecodedJWT jwt = JWTHelper.verifyToken(token.replaceFirst("Bearer ", ""));
        User u = userDao.getUserByUsername(jwt.getClaim("user").asString());

        try {
            if (u != null && PasswordHash.check(jwt.getClaim("password").asString(), u.getPassword())) {
                return Optional.of(u);
            }
        } catch (Exception e) {
            return Optional.empty();
        }
        return Optional.empty();*/

        return Optional.of(new User());
    }

}
