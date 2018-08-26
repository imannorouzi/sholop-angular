package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

import java.sql.Timestamp;

/**
 * Created by Pooyan on 12/11/2017.
 */

public class ContactEvent {

    public enum STATUS {ACCEPTED, IGNORED, NOT_REPLIED, REJECTED, REMOVED, TENTATIVE}

    public ContactEvent(
             int id,
             int contactId,
             int eventId,
             String status,
             Timestamp created,
             int createdBy,
             Timestamp modified,
             int modifiedBy) {

        this.id = id;
        this.contactId = contactId;
        this.eventId = eventId;
        this.status = STATUS.valueOf(status);
        this.created = created;
        this.createdBy = createdBy;
        this.modified = modified;
        this.modifiedBy = modifiedBy;
    }

    public ContactEvent(
             int contactId,
             int eventId,
             String status) {

        this.contactId = contactId;
        this.eventId = eventId;
        this.status = STATUS.valueOf(status);
    }

    int contactId, eventId, id, createdBy, modifiedBy;
    Timestamp created, modified;

    STATUS status;

    public int getContactId() {
        return contactId;
    }

    public void setContactId(int contactId) {
        this.contactId = contactId;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public STATUS getStatus() {
        return status;
    }

    public void setStatus(STATUS status) {
        this.status = status;
    }
}
