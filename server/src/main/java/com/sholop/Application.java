package com.sholop;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.sholop.api.SholopRestController;
import com.sholop.auth.SchedulerAuthenticator;
import com.sholop.auth.SchedulerAuthorizer;
import com.sholop.auth.TokenAuthFilter;
import com.sholop.objects.User;
import com.sholop.db.dao.*;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.jdbi.DBIFactory;
import io.dropwizard.jdbi.bundles.DBIExceptionsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.skife.jdbi.v2.DBI;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import java.util.EnumSet;

public class Application extends io.dropwizard.Application<ApplicationConfiguration> {

    @Override
    public void initialize(Bootstrap<ApplicationConfiguration> bootstrap) {

        bootstrap.addBundle(new DBIExceptionsBundle());
//        bootstrap.addBundle(new MultiPartBundle());
//        bootstrap.addBundle(new AssetsBundle("/assets/", "/assets/"));

//        bootstrap.addBundle(new AssetsBundle("/assets", "/assets", "/*"));
        bootstrap.addBundle(new AssetsBundle("/assets/", "/", "index.html"));

//        AssetsBundle assetsBundle = new AssetsBundle("/assets/", "/", "index.html", "static");
//        bootstrap.addBundle(assetsBundle);

    }

    @Override
    public void run(ApplicationConfiguration configuration, Environment environment) throws Exception {

        final DBIFactory factory = new DBIFactory();
        final DBI jdbi = factory.build(environment, configuration.getDataSourceFactory(), "mySql");

        Injector injector = Guice.createInjector(new ContextConfiguration(configuration, jdbi));

        environment.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

        environment.jersey().register( injector.getInstance(MultiPartFeature.class));
        environment.jersey().register( injector.getInstance(SholopRestController.class));

        environment.jersey().register(injector.getInstance(EventDao.class));
        environment.jersey().register(injector.getInstance(SholopDateDao.class));
        environment.jersey().register(injector.getInstance(LocationDao.class));
        environment.jersey().register(injector.getInstance(ContactEventDao.class));
        environment.jersey().register(injector.getInstance(ContactDao.class));
        environment.jersey().register(injector.getInstance(UserDao.class));

        /***************  security ******************/
        /*environment.jersey().register(new AuthDynamicFeature(new BasicCredentialAuthFilter.Builder<User>()
                .setAuthenticator(new SchedulerAuthenticator(userDao))
                .setAuthorizer(new SchedulerAuthorizer())
                .setRealm("METRO-ANNOUNCE-SCHEDULER-REALM")
                .buildAuthFilter()));*/

        environment.jersey().register(new AuthDynamicFeature(
                new TokenAuthFilter.Builder<User>()
                        .setAuthenticator(injector.getInstance(SchedulerAuthenticator.class))
                        .setAuthorizer(injector.getInstance(SchedulerAuthorizer.class))
                        .setRealm("SHOLOP-ANNOUNCE-SCHEDULER-REALM")
                        .buildAuthFilter()
                )
        );
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(User.class));
        environment.jersey().register(RolesAllowedDynamicFeature.class);

        /*environment.jersey().register(RolesAllowedDynamicFeature.class);
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(User.class));*/


        /*Cross Origin Access*/
        final FilterRegistration.Dynamic cors =
                environment.servlets().addFilter("CORS", CrossOriginFilter.class);

        // Configure CORS parameters
        cors.setInitParameter("allowedOrigins", "*");
        cors.setInitParameter("allowedHeaders", "X-Requested-With,Content-Type,Accept,Origin");
        cors.setInitParameter("allowedMethods", "OPTIONS,GET,PUT,POST,DELETE,HEAD");

        // Add URL mapping
        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");

    }

    public static void main(String[] args) throws Exception {
        new Application().run(args);
    }

}
