package com.sholop;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import com.google.inject.AbstractModule;
import com.sholop.db.dao.*;
import org.skife.jdbi.v2.DBI;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ContextConfiguration extends AbstractModule {

    private static final int AppThreadPoolSize = 20;
    private final ExecutorService executorService = Executors.newFixedThreadPool(AppThreadPoolSize,
            new ThreadFactoryBuilder().setDaemon(true).setNameFormat("AppThreadPool" + "-%d").build());

    private final ApplicationConfiguration configuration;
    private final DBI jdbi;

    public ContextConfiguration(
            ApplicationConfiguration configuration,
            DBI jdbi) {
        this.configuration = configuration;
        this.jdbi = jdbi;
    }


    @Override
    protected void configure() {

        bind(ExecutorService.class).toInstance(executorService);
        bind(ApplicationConfiguration.class).toInstance(configuration);

        bind(DBI.class).toInstance(jdbi);

        bind(EventDao.class).toInstance(jdbi.onDemand(EventDao.class));
        bind(LocationDao.class).toInstance(jdbi.onDemand(LocationDao.class));
        bind(SholopDateDao.class).toInstance(jdbi.onDemand(SholopDateDao.class));
        bind(ContactDao.class).toInstance(jdbi.onDemand(ContactDao.class));
        bind(ContactEventDao.class).toInstance(jdbi.onDemand(ContactEventDao.class));
        bind(UserDao.class).toInstance(jdbi.onDemand(UserDao.class));
        bind(CommentDao.class).toInstance(jdbi.onDemand(CommentDao.class));



//        bind(String.class).annotatedWith(named("environment")).toInstance(configuration.getEnvironment());
//        bind(File.class).annotatedWith(named("workingFolder")).toInstance(new File(configuration.getWorkingFolder()));
//        bind(Double.class).annotatedWith(named("javaHeapspaceNotifyThreshold")).toInstance(configuration.getJavaHeapspaceNotifyThreshold());


    }
}
