package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * Created by Pooyan on 12/11/2017.
 */

@Entity(name = "sh_comment")
public class Comment {

    public Comment(){}

    public Comment(
             int id,
             int userId,
             int contactId,
             int eventId,
             String text,
             int inReplyTo,
             String status,
             Timestamp created,
             Timestamp modified) {

        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.contactId = contactId;
        this.text = text;
        this.inReplyTo = inReplyTo;
        this.status = status;
        this.created = created;
        this.modified = modified;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    String text, status;
    @Transient
    String userImageUrl, userName;
    @Column(name = "user_id") Integer userId;
    @Column(name = "event_id") Integer eventId;
    @Column(name = "in_reply_to") Integer inReplyTo;
    @Column(name = "contact_id") Integer contactId;

    Timestamp created, modified;

    public Comment(JSONObject jo) throws JSONException {
        this.id = jo.has("id") && jo.getInt("id") != 0 ? jo.getInt("id") : -1;
        this.userId = jo.has("userId") ? jo.getInt("userId") : -1;
        this.contactId = jo.has("contactId") ? jo.getInt("contactId") : -1;
        this.eventId = jo.has("eventId") ? jo.getInt("eventId") : -1;
        this.text = jo.has("text") ? jo.getString("text") : "";
        this.inReplyTo = jo.has("inReplyTo") ? jo.getInt("inReplyTo"): 0;

        this.status = jo.has("status") ? jo.getString("status") : "publish";

    }


    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public Integer getEventId() {
        return eventId;
    }

    public Integer getInReplyTo() {
        return inReplyTo;
    }

    public void setInReplyTo(int inReplyTo) {
        this.inReplyTo = inReplyTo;
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

    public String getUserImageUrl() {
        return userImageUrl;
    }

    @Transient
    public void setUserImageUrl(String userImageUrl) {
        this.userImageUrl = userImageUrl;
    }

    public Integer getContactId() {
        return contactId;
    }

    public void setContactId(Integer contactId) {
        this.contactId = contactId;
    }

    public String getUserName() {
        return userName;
    }

    @Transient
    public void setUserName(String userName) {
        this.userName = userName;
    }
}
