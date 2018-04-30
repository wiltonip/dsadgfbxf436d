package com.threering.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.grant.client.ClientCredentialsResourceDetails;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;

@EnableOAuth2Client
@Configuration
public class OAuth2LoginSecurityConfig extends WebSecurityConfigurerAdapter {

    @Value("${shapeways.token-uri}")
    private String accessTokenUri;

    @Value("${shapeways.client-id}")
    private String clientId;

    @Value("${shapeways.client-secret}")
    private String clientSecret;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .anyRequest().permitAll();
//                .and()
//                .oauth2Login()
//                .redirectionEndpoint()
//                .baseUri("/callback");
    }

    @Bean
    public OAuth2ProtectedResourceDetails shapeways() {
        ClientCredentialsResourceDetails details = new ClientCredentialsResourceDetails();
        details.setId("shapeways");
        details.setClientId(clientId);
        details.setClientSecret(clientSecret);
        details.setAccessTokenUri(accessTokenUri);
        return details;
    }

    @Bean
    public OAuth2RestTemplate shapewaysRestTemplate() {
        return new OAuth2RestTemplate(shapeways(), new DefaultOAuth2ClientContext());
    }
}
