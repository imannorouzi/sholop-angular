package com.sholop;

import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;
import org.codehaus.jackson.annotate.JsonProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

class ApplicationConfiguration extends Configuration {
    @Valid
    @NotNull
    @JsonProperty("database")
    private DataSourceFactory database = new DataSourceFactory();

    public void setDatabase(DataSourceFactory factory) {
        this.database = factory;
    }

    public DataSourceFactory getDataSourceFactory() {
        return database;
    }
}