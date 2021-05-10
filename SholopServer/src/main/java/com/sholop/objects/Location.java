package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.sholop.utils.FileStorageService;
import com.sholop.utils.Utils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.persistence.*;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

/**
 * Created by Pooyan on 12/11/2017.
 */
@Entity(name = "sh_venue")
public class Location {

    public Location(){

    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @Column(name = "user_id") Integer userId;
    @Column(name = "persian_address_1") String farsiAddress1;
    @Column(name = "persian_address_2") String farsiAddress2;
    @Column(name = "english_address") String englishAddress;
    @Column(name = "title") String title;
    @Column(name = "description") String description;
    @Column(name = "map_url") String mapUrl;
    @Column(name = "is_active") Boolean isActive;
    @Column(name = "is_virtual") Boolean isVirtual;
    @Column(name = "link") String link;

    @Column(name = "latitude") double latitude;
    @Column(name = "longitude") double longitude;

    public Location(String title, String description, String farsiAddress1, String farsiAddress2, String englishAddress, double latitude, double longitude) {
        this.title = title;
        this.farsiAddress1 = farsiAddress1;
        this.farsiAddress2 = farsiAddress2;
        this.englishAddress = englishAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
    }

    public Location(JSONObject jo) throws JSONException {
        this.setFarsiAddress1(jo.getString("farsiAddress1"));
        this.setFarsiAddress2(jo.getString("farsiAddress2"));
        this.setEnglishAddress(jo.getString("farsiAddress1"));
        this.setLatitude(jo.getDouble("latitude"));
        this.setLongitude(jo.getDouble("longitude"));

        this.setTitle(jo.has("title") ? jo.getString("title") : jo.getString("farsiAddress1"));
        this.setDescription(jo.has("welcomeMessage") ? jo.getString("welcomeMessage") : "");
        this.setUserId(jo.has("chairId") ? jo.getInt("chairId") : -1);
        this.setId(jo.has("id") ? jo.getInt("id") : -1);
        this.setVirtual(jo.has("virtual") && jo.getBoolean("virtual"));
        this.setLink(jo.has("link") ? jo.getString("link") : "");
        this.setId(jo.has("id") ? jo.getInt("id") : -1);
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

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEnglishAddress() {
        return englishAddress;
    }

    public void setEnglishAddress(String englishAddress) {
        this.englishAddress = englishAddress;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getMapUrl() {
        return mapUrl;
    }

    public void setMapUrl(String mapUrl) {
        this.mapUrl = mapUrl;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Boolean getVirtual() {
        return isVirtual;
    }

    public void setVirtual(Boolean virtual) {
        isVirtual = virtual;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
