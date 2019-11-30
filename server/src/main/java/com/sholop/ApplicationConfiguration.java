package com.sholop;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
@ConfigurationProperties(prefix = "app")
public class ApplicationConfiguration{
    private String name;
    private String description;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public class Security {

        private JwtProperties jwt;

        public JwtProperties getJwt() {
            return jwt;
        }

        public void setJwt(JwtProperties jwt) {
            this.jwt = jwt;
        }

        public class JwtProperties {

            private Resource keyStore;
            private String keyStorePassword;
            private String keyPairAlias;
            private String keyPairPassword;

            public Resource getKeyStore() {
                return keyStore;
            }

            public void setKeyStore(Resource keyStore) {
                this.keyStore = keyStore;
            }

            public String getKeyStorePassword() {
                return keyStorePassword;
            }

            public void setKeyStorePassword(String keyStorePassword) {
                this.keyStorePassword = keyStorePassword;
            }

            public String getKeyPairAlias() {
                return keyPairAlias;
            }

            public void setKeyPairAlias(String keyPairAlias) {
                this.keyPairAlias = keyPairAlias;
            }

            public String getKeyPairPassword() {
                return keyPairPassword;
            }

            public void setKeyPairPassword(String keyPairPassword) {
                this.keyPairPassword = keyPairPassword;
            }
        }
    }
}