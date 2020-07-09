package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.sholop.utils.Utils;
import org.apache.commons.io.IOUtils;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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

    Integer userId;
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
        this.setDescription(jo.has("welcomeMessage") ? jo.getString("welcomeMessage") : "");
        this.setUserId(jo.has("chairId") ? jo.getInt("chairId") : -1);
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

    public void downloadMap() {

        String url = "https://maps.googleapis.com/maps/api/staticmap?" +
                "center=" + this.latitude +"%2c%20"+ this.longitude +
                "&markers=" + this.latitude + "," + this.longitude +
                "&zoom=16&size=400x200&key=AIzaSyDXNa76E7XTVYsZR5Q0qeOpE9LyFanBnGc";

        /*"http://maps.google.com/maps/api/staticmap?" +
                "center=25.3176452,82.97391440000001," +
                "&zoom=15" +
                "&markers=25.3176452,82.97391440000001" +
                "&path=color:0x0000FF80|weight:5|25.3176452,82.97391440000001" +
                "&size=175x175" +
                "&key=AIzaSyDXNa76E7XTVYsZR5Q0qeOpE9LyFanBnGc"*/

        Client client = ClientBuilder.newClient();
        WebTarget target = client.target(url);
        javax.ws.rs.core.Response resp = target.request("image/png").get();


        try {
            if(resp.getStatus() == 200)
            {
                InputStream is = resp.readEntity(InputStream.class);

                this.setMapUrl(fetchFeed(is));
                IOUtils.closeQuietly(is);
            }
            //fetchFeedAnotherWay(is) //use for Java 7

        }catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Store contents of file from response to local disk
     */
    private String fetchFeed(InputStream is) throws IOException {
        byte[] byteArray = IOUtils.toByteArray(is);


        String filename = "/contents/images/venues/venue_" + (new Date()).toString().replaceAll(" ", "") + ".png";
        FileOutputStream fos = new FileOutputStream("." + filename);

        String relationalUrl = Utils.RELATIONAL_WEBSITE_URL + filename;

        fos.write(byteArray);
        fos.flush();
        fos.close();

        return relationalUrl;
    }
}
