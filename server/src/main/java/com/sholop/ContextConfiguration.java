package com.sholop;

import com.sholop.db.repositories.RepositoryFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ContextConfiguration{

    @Bean
    public RepositoryFactory repositoryFactory(){
        return new RepositoryFactory();
    }


}
