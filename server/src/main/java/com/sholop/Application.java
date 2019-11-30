package com.sholop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(ApplicationConfiguration.class)
public class Application {

    /*@Override
    public void initialize(Bootstrap<ApplicationConfiguration> bootstrap) {

        bootstrap.addBundle(new DBIExceptionsBundle());

        bootstrap.addBundle(new ConfiguredAssetsBundle("/assets/", "/", "index.html", "content"));
        bootstrap.addBundle(new FileAssetsBundle("/contents/", "/contents/", "index.html"));
        bootstrap.addBundle(new FileAssetsBundle("/app", "/", "index.html", "app"));
//        bootstrap.addBundle(new MultiPartBundle());
//        bootstrap.addBundle(new AssetsBundle("/assets/", "/assets/"));
//        bootstrap.addBundle(new AssetsBundle("/assets/", "/", "index.html", "static"));

    }

    @Override
    public void run(ApplicationConfiguration configuration, Environment environment) throws Exception {

        environment.jersey().setUrlPattern("/api/*");

        final DBIFactory factory = new DBIFactory();
        final DBI jdbi = factory.build(environment, configuration.getDataSourceFactory(), "mySql");

        Injector injector = Guice.createInjector(new ContextConfiguration(configuration, jdbi));

        environment.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

        environment.jersey().register( injector.getInstance(MultiPartFeature.class));
        environment.jersey().register( injector.getInstance(SholopRestController.class));
        environment.jersey().register( injector.getInstance(ContactController.class));
        environment.jersey().register( injector.getInstance(UserController.class));

        environment.jersey().register(injector.getInstance(EventDao.class));
        environment.jersey().register(injector.getInstance(SholopDateDao.class));
        environment.jersey().register(injector.getInstance(LocationDao.class));
        environment.jersey().register(injector.getInstance(ContactEventDao.class));
        environment.jersey().register(injector.getInstance(ContactDao.class));
        environment.jersey().register(injector.getInstance(UserDao.class));
        environment.jersey().register(injector.getInstance(CommentDao.class));

        *//***************  security ******************//*
        *//*environment.jersey().register(new AuthDynamicFeature(new BasicCredentialAuthFilter.Builder<User>()
                .setAuthenticator(new SchedulerAuthenticator(userDao))
                .setAuthorizer(new SchedulerAuthorizer())
                .setRealm("METRO-ANNOUNCE-SCHEDULER-REALM")
                .buildAuthFilter()));*//*

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

        *//*environment.jersey().register(RolesAllowedDynamicFeature.class);
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(User.class));*//*


        *//*Cross Origin Access*//*
        final FilterRegistration.Dynamic cors =
                environment.servlets().addFilter("CORS", CrossOriginFilter.class);

        // Configure CORS parameters
        cors.setInitParameter("allowedOrigins", "*");
        cors.setInitParameter("allowedHeaders", "X-Requested-With,Content-Type,Accept,Origin");
        cors.setInitParameter("allowedMethods", "OPTIONS,GET,PUT,POST,DELETE,HEAD");

        // Add URL mapping
        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");

    }*/

    public static void main(String[] args) throws Exception {
//        new Application().run(args);

        SpringApplication.run(Application.class, args);
    }

}
