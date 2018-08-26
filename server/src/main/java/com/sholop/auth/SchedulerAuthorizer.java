package com.sholop.auth;

import com.sholop.objects.User;
import io.dropwizard.auth.Authorizer;

public class SchedulerAuthorizer implements Authorizer<User>
{
    @Override
    public boolean authorize(User user, String role) {
        return user.getRoles() != null && user.getRoles().contains(role);
    }
}
