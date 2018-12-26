package com.sholop;

import io.dropwizard.Configuration;
import io.dropwizard.bundles.assets.AssetsBundleConfiguration;
import io.dropwizard.bundles.assets.AssetsConfiguration;
import io.dropwizard.db.DataSourceFactory;
import org.codehaus.jackson.annotate.JsonProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

class ApplicationConfiguration extends Configuration implements AssetsBundleConfiguration {

    @Valid
    @NotNull
    @JsonProperty("app")
    private AssetsConfiguration app = AssetsConfiguration.builder().build();


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

    @NotNull
    public DataSourceFactory getDatabase() {
        return database;
    }

    @NotNull
    public AssetsConfiguration getAapp() {
        return app;
    }

    public void setApp(@NotNull AssetsConfiguration app) {
        this.app = app;
    }

    @Override
    public AssetsConfiguration getAssetsConfiguration() { return app; }
}