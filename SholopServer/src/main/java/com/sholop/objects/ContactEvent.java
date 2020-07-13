package com.sholop.objects;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.sholop.utils.Utils;

import javax.persistence.*;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.sql.Timestamp;
import java.util.Date;

/**
 * Created by Pooyan on 12/11/2017.
 */

@Entity(name = "sh_contact_event")
public class ContactEvent {

    public ContactEvent(){}

    public enum STATUS {ATTENDING, NOT_ATTENDING, NOT_REPLIED, REJECTED, REMOVED, TENTATIVE}
    public enum TYPE {USER, CONTACT, UNKNOWN}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

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
            TYPE type,
            String status,
            String name,
            String email,
            String phone) {

        this.contactId = contactId;
        this.eventId = eventId;
        this.status = STATUS.valueOf(status);
        this.type = type.name();
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    @Column(name = "contact_id") Integer contactId;
    @Column(name = "event_id") Integer eventId;
    @Column(name = "created_by") Integer createdBy;
    @Column(name = "modified_by") Integer modifiedBy;
    Timestamp created, modified;
    @Column(name = "qr_code_url") String QRCodeUrl;

    /* used for the contacts which should not be remembered*/
    @Column(name = "type") String type;
    @Column(name = "name") String name;
    @Column(name = "phone") String phone;
    @Column(name = "email") String email;

    private String uuid;

    @Transient
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

    public String getQRCodeUrl() {
        return QRCodeUrl;
    }

    public void setQRCodeUrl(String QRCordeUrl) {
        this.QRCodeUrl = QRCordeUrl;
    }



    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
