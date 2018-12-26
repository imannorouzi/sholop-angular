package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.security.Principal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@XmlRootElement
public class User implements Principal {

    private int id;
    private String name, username;
    private List<String> roles;
    private String password, email, phone, address, imageUrl;
    private String token;

    private int createdBy, modifiedBy;
    Timestamp created, modified;

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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
}