package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

/**
 * Created by Pooyan on 12/11/2017.
 */
public class Location {

    int id, userId;
    String farsiAddress1, farsiAddress2, englishAddress, title, description, mapUrl;

    double latitude, longitude;

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
        this.setDescription(jo.has("description") ? jo.getString("description") : "");
        this.setUserId(jo.has("userId") ? jo.getInt("userId") : -1);
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
}
