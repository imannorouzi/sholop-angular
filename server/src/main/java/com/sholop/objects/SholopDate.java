package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.util.Date;

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
                      Date date,
                      String dateString,
                      String startTime,
                      String endTime){
        this.eventId = eventId;
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;

        this.dateString = dateString;
        this.date = date;
    }

    public SholopDate(JSONObject jo) throws JSONException {

        DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        date = dtf.parseDateTime(jo.getJSONObject("date").getString("gDate")).toDate();

        dateString = jo.getJSONObject("date").getString("dateString");

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
