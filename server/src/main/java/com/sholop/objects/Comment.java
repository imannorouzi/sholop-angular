package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

import java.sql.Timestamp;

/**
 * Created by Pooyan on 12/11/2017.
 */

public class Comment {

    public Comment(
             int id,
             int userId,
             int eventId,
             String text,
             int inReplyTo,
             String status,
             Timestamp created,
             Timestamp modified) {

        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.text = text;
        this.inReplyTo = inReplyTo;
        this.status = status;
        this.created = created;
        this.modified = modified;
    }

    String text, status, userName, userImageUrl;
    int id, userId, eventId, inReplyTo;

    Timestamp created, modified;

    public Comment(JSONObject jo) throws JSONException {
        this.id = jo.has("id") && jo.getInt("id") != 0 ? jo.getInt("id") : -1;
        this.userId = jo.has("chairId") ? jo.getInt("chairId") : -1;
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

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public int getInReplyTo() {
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserImageUrl() {
        return userImageUrl;
    }

    public void setUserImageUrl(String userImageUrl) {
        this.userImageUrl = userImageUrl;
    }
}
