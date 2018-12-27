package com.sholop.objects;

import com.amazonaws.util.json.JSONArray;
import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Created by Pooyan on 12/11/2017.
 */

public class Contact {

    public Contact(
             int id,
             String name,
             String phone,
             String email,
             String address,
             String imageUrl,
             int userId,
             boolean valid,
             Timestamp created,
             int createdBy,
             Timestamp modified,
             int modifiedBy) {

        this.id = id;
        this.name = "null".equals(name) ? "" : name;
        this.phone = "null".equals(phone) ? "" : phone;
        this.email = "null".equals(email) ? "" : email;
        this.address = "null".equals(address) ? "" : address;
        this.imageUrl = "null".equals(imageUrl) ? "" : imageUrl;
        this.userId = userId;
        this.valid = valid;
        this.created = created;
        this.createdBy = createdBy;
        this.modified = modified;
        this.modifiedBy = modifiedBy;
    }

    String name, phone, email, address, imageUrl;
    int id, userId, createdBy, modifiedBy;

    boolean valid;

    Timestamp created, modified;

    public Contact(JSONObject jo) throws JSONException {
        this.id = jo.has("id") && jo.getInt("id") != 0 ? jo.getInt("id") : -1;
        this.name = jo.getString("name");
        this.email = jo.getString("email");
        this.phone = jo.getString("phone");
        this.valid = true;//jo.getBoolean("valid");
        this.address = jo.has("address") ? jo.getString("address") : "";
        this.userId = jo.has("userId") ? jo.getInt("userId") : 0;
        this.imageUrl = jo.has("imageUrl") ? jo.getString("imageUrl") : "";
    }

    // this is for handling email contacts
    public Contact(String email) {
        this.valid = false;
        this.email = email;
        this.id = -1;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
