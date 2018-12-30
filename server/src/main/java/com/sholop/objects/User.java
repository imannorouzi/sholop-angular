package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.security.Principal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
public class User implements Principal {

    private int id;
    private String name, username;
    private List<String> roles;
    private String password, email, phone, farsiAddress1, farsiAddress2, description, imageUrl;
    private String token;

    private int createdBy, modifiedBy;
    Timestamp created, modified;
    double latitude, longitude;


    public User(){}

    public User(String name, String email, String password, String imageUrl, String phone) {
        this.name = name;
        this.username = email;
        this.email = email;
        this.imageUrl = imageUrl;
        this.phone = phone;
        this.password = password;
        this.id = -1;
        this.roles = null;
    }

    public User(String name, String password, List<String> roles) {
        this.name = name;
        this.roles = roles;
        this.password = password;
    }

    public User(int id,
                String name,
                String username,
                String password,
                String email,
                String imageUrl,
                String phone,
                double latitude,
                double longitude,
                String address1,
                String address2,
                String description,
                String roles,
                Timestamp created,
                int createdBy,
                Timestamp modified,
                int modifiedBy) {

        this.id = id;
        this.name  = name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.imageUrl = imageUrl;
        this.phone = phone;
        this.roles = new ArrayList<>();
        if(roles != null) {
            String[] rolesSplit = roles.split(",");
            for (String role : rolesSplit) {
                this.roles.add(role);
            }
        }

        this.latitude = latitude;
        this.longitude = longitude;
        this.farsiAddress1 = address1;
        this.farsiAddress2 = address2;
        this.description = description;

        this.created = created;
        this.createdBy = createdBy;
        this.modified = modified;
        this.modifiedBy = modifiedBy;
    }

    public User (JSONObject jo) throws JSONException {
        this.setId(jo.getInt("id"));
        this.setUsername(jo.getString("username"));
        this.setName(jo.getString("name"));
        this.setEmail(jo.getString("email"));
        this.setPassword(jo.getString("password"));

        this.setPhone(jo.has("phone") ? jo.getString("phone") : "");
        this.setLatitude(jo.has("latitude") ? jo.getDouble("latitude") : 0);
        this.setLongitude(jo.has("longitude") ? jo.getDouble("longitude") : 0);
        this.setFarsiAddress1(jo.has("farsiAddress1") ? jo.getString("farsiAddress1") : "");
        this.setFarsiAddress2(jo.has("farsiAddress2") ? jo.getString("farsiAddress2") : "");
        this.setDescription(jo.has("welcomeMessage") ? jo.getString("welcomeMessage") : "");
        this.roles = new ArrayList<>();
        String[] rolesSplit = jo.getString("roles").split(",");
        for(String role : rolesSplit ){
            this.roles.add(role);
        }
    }

    @Override
    public String getName() {
        return name;
    }

    public List<String> getRoles() {
        return roles;
    }

    @XmlElement
    public void setName(String name) {
        this.name = name;
    }

    @XmlElement
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getPassword() {
        return password;
    }

    @XmlElement
    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public int getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(int createdBy) {
        this.createdBy = createdBy;
    }

    public int getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(int modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public Timestamp getModified() {
        return modified;
    }

    public void setModified(Timestamp modified) {
        this.modified = modified;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getFarsiAddress1() {
        return farsiAddress1;
    }

    public void setFarsiAddress1(String farsiAddress1) {
        this.farsiAddress1 = farsiAddress1;
    }

    public String getFarsiAddress2() {
        return farsiAddress2;
    }

    public void setFarsiAddress2(String farsiAddress2) {
        this.farsiAddress2 = farsiAddress2;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}