package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity(name = "sh_contact")
public class Contact {

    public Contact(){}

    public Contact(
             int id,
             String type,
             String name,
             String phone,
             String email,
             String address,
             String imageUrl,
             int userId,
             int valid,
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
        this.contactType = "null".equals(type) ? CONTACT_TYPE.UNKNOWN.name() : type;
        this.userId = userId;
        this.valid = valid;
        this.created = created;
        this.createdBy = createdBy;
        this.modified = modified;
        this.modifiedBy = modifiedBy;
    }

    /**
     * Created by Pooyan on 12/11/2017.
     */

    public enum CONTACT_TYPE {EMPLOYEE, CONTACT, UNKNOWN}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @Column(name = "user_id")
    Integer userId;

    @Column(name = "type")
    String contactType;

    @Transient
    boolean you;

    @Column(name="valid")
    private int valid;

    @Column(name="is_active")
    private int active;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "modified_by")
    private Integer modifiedBy;

    private String name, email, phone, address;

    @Column(name = "image_url")
    private String imageUrl;

    Timestamp created, modified;

    public Contact(JSONObject jo) throws JSONException {
        this.id = jo.has("id") && jo.getInt("id") != 0 ? jo.getInt("id") : -1;
        this.contactType = jo.has("type") && !"".equals(jo.getString("type")) ?
                jo.getString("type").toUpperCase() : CONTACT_TYPE.UNKNOWN.name();
        this.name = jo.getString("name");
        this.email = jo.getString("email");
        this.phone = jo.getString("phone");
        this.valid = 1;//jo.getBoolean("valid");
        this.address = jo.has("address") ? jo.getString("address") : "";
        this.userId = jo.has("chairId") ? jo.getInt("chairId") : 0;
        this.imageUrl = jo.has("imageUrl") ? jo.getString("imageUrl") : "";
    }

    // this is for handling email contacts
    public Contact(String email) {
        this.valid = 0;
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

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public Integer getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(Integer modifiedBy) {
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

    public int isValid() {
        return valid;
    }

    public void setValid(int valid) {
        this.valid = valid;
    }

    public boolean isYou() {
        return you;
    }

    public void setYou(boolean you) {
        this.you = you;
    }

    public String getContactType() {
        return contactType;
    }

    public void setContactType(String contactType) {
        this.contactType = contactType;
    }
}
