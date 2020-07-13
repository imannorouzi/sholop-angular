package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlElement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "sh_user")
public class User extends Attendee{

    public User(){super(ContactEvent.TYPE.USER.name());}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @Column(name = "parent_id") private Integer parentId;


    @Column(name = "full_name") private String name;
    private String username;
    @Column(name = "role") private String role;
    private String password, email, phone, description = "";
    @Column(name = "persian_address_1") String farsiAddress1 = "";
    @Column(name = "persian_address_2") String farsiAddress2 = "";
    @Column(name = "image_url") String imageUrl = "";
    @Transient private String token;

    public enum USER_TYPE {PERSONAL, BUSINESS, UNKNOWN}

    @Column(name = "created_by") private Integer createdBy;
    @Column(name = "modified_by") private Integer modifiedBy;
    Timestamp created, modified;
    Double latitude, longitude;

    @Transient
    USER_TYPE userType;
    @Column(name = "google_password") String googlePassword;

    public User(String name, String type, String email, String password, String imageUrl, String phone) {
        super(ContactEvent.TYPE.USER.name());

        this.name = name;
        this.userType = USER_TYPE.valueOf(type);
        this.username = email;
        this.email = email;
        this.imageUrl = imageUrl;
        this.phone = phone;
        this.password = password;
        this.id = -1;
        this.role = null;
        this.latitude = 35.6892;
        this.longitude = 51.3890;
    }

    public User(String name, String password, String role) {
        super(ContactEvent.TYPE.USER.name());
        this.name = name;
        this.role = role;
        this.password = password;
    }

    public User(int id,
                String type,
                String name,
                String username,
                String password,
                String googlePassword,
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

        super(ContactEvent.TYPE.USER.name());

        this.id = id;
        this.userType = USER_TYPE.valueOf(type);
        this.name  = name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.imageUrl = imageUrl;
        this.phone = phone;
        this.googlePassword = googlePassword;
        this.role = role;

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
        super(ContactEvent.TYPE.USER.name());

        this.setId(jo.getInt("id"));
        this.setUsername(jo.getString("username"));
        this.setName(jo.getString("name"));
        this.setEmail(jo.getString("email"));
        this.setPassword(jo.has("password") ? jo.getString("password") : "");

//        this.setUserType(jo.has("type") ? USER_TYPE.valueOf(jo.getString("type")) : USER_TYPE.PERSONAL);
        this.setPhone(jo.has("phone") ? jo.getString("phone") : "");
        this.setLatitude(jo.has("latitude") ? jo.getDouble("latitude") : 0);
        this.setLongitude(jo.has("longitude") ? jo.getDouble("longitude") : 0);
        this.setFarsiAddress1(jo.has("farsiAddress1") ? jo.getString("farsiAddress1") : "");
        this.setFarsiAddress2(jo.has("farsiAddress2") ? jo.getString("farsiAddress2") : "");
        this.setDescription(jo.has("welcomeMessage") ? jo.getString("welcomeMessage") : "");
        this.role = jo.has("role") ? jo.getString("role") : "user";
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    @XmlElement
    public void setName(String name) {
        this.name = name;
    }

    @XmlElement
    public void setRole(String roles) {
        this.role = roles;
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

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(int createdBy) {
        this.createdBy = createdBy;
    }

    public Integer getModifiedBy() {
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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getGooglePassword() {
        return googlePassword;
    }

    public void setGooglePassword(String googlePassword) {
        this.googlePassword = googlePassword;
    }

    public USER_TYPE getUserType() {
        return userType;
    }

    public void setUserType(USER_TYPE userType) {
        this.userType = userType;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }
}