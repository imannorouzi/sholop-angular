package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

import javax.persistence.*;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * Created by Pooyan on 3/20/2018.
 */

@Entity(name = "sh_event_date")
public class SholopDate {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @Column(name = "event_id")
    Integer eventId;

    Timestamp date;
    @Column(name = "date_string")
    String dateString;

    @Column(name = "start_time_string")
    String startTime;
    @Column(name = "end_time_string")
    String endTime;

    public SholopDate(){}

    public SholopDate(int id,
                      int eventId,
                      Timestamp date,
                      String dateString,
                      String startTime,
                      String endTime) throws ParseException {
        this.eventId = eventId;
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;

        this.dateString = dateString;

        this.date = date;
    }

    public SholopDate(JSONObject jo) throws JSONException, ParseException {

        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
//        String strDate = dateFormat.format();
        this.date = new Timestamp((dateFormat.parse(jo.getString("date"))).getTime());

        this.dateString = jo.has("dateString") ? jo.getString("dateString") : "";

        startTime = jo.getString("startTime");
        endTime = jo.getString("endTime");
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
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

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }
}
