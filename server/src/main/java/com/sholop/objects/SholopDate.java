package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import javax.swing.text.DateFormatter;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * Created by Pooyan on 3/20/2018.
 */
public class SholopDate {

    int id, eventId;

    Date date;
    String dateString;

    String startTime, endTime;

    public SholopDate(int id,
                      int eventId,
                      String date,
                      String dateString,
                      String startTime,
                      String endTime) throws ParseException {
        this.eventId = eventId;
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;

        this.dateString = dateString;

//        DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss.s");
//        this.date = dtf.parseDateTime(dateTime);

        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        this.date = dateFormat.parse(date);
    }

    public SholopDate(JSONObject jo) throws JSONException, ParseException {

//        DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
//        date = dtf.parseDateTime(jo.getString("date")).toDateTime();

        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
//        String strDate = dateFormat.format();
        this.date = dateFormat.parse(jo.getString("date"));

        this.dateString = jo.has("dateString") ? jo.getString("dateString") : "";

        startTime = jo.getString("startTime");
        endTime = jo.getString("endTime");
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDateString() {
        return dateString;
    }

    public void setDateString(String dateString) {
        this.dateString = dateString;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }
}
