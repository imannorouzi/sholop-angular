package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.sholop.Utils;
import com.sholop.api.SholopRestController;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.sql.Timestamp;
import java.util.Date;

/**
 * Created by Pooyan on 12/11/2017.
 */

public class ContactEvent {

    public enum STATUS {ATTENDING, NOT_ATTENDING, NOT_REPLIED, REJECTED, REMOVED, TENTATIVE}

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
    String QRCodeUrl, uuid;

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

    public void generateQRCodeImage()
            throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        String uuid = Utils.generateRandomString();
        this.setUuid(uuid);
        BitMatrix bitMatrix = qrCodeWriter.encode(uuid, BarcodeFormat.QR_CODE, 200, 200);

        String filename = "/contents/images/events/QRCodes/contact" + (new Date()).toString().replaceAll(" ", "") + ".png";

        Path path = FileSystems.getDefault().getPath("." + filename);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);

        String relationalUrl = Utils.RELATIONAL_WEBSITE_URL + filename;
        this.setQRCodeUrl(relationalUrl);
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
