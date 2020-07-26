package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import org.joda.time.DateTime;
import org.joda.time.format.ISODateTimeFormat;

import javax.persistence.*;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

/**
 * Created by Pooyan on 3/20/2018.
 */

@Entity(name = "sh_event_date")
public class EventDate {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @Column(name = "event_id")
    Integer eventId;

    @Column(name = "date_string")
    String dateString;

    @Column(name = "date")
    Timestamp date;

    @Column(name = "start_time")
    Timestamp startTime;
    @Column(name = "end_time")
    Timestamp endTime;

    public EventDate(){}

    public EventDate(int id,
                     int eventId,
                     Timestamp date,
                     Timestamp startTime,
                     Timestamp endTime) {
        this.eventId = eventId;
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.date = date;
    }

    public EventDate(JSONObject jo) throws JSONException, ParseException {

        TimeZone tz = TimeZone.getTimeZone("UTC");
        Calendar cal = Calendar.getInstance(tz);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        sdf.setCalendar(cal);

        cal.setTime(sdf.parse(jo.getString("date")));
        Date date = cal.getTime();

        cal.setTime(sdf.parse(jo.getString("startTime")));
        Date startTime = cal.getTime();

        cal.setTime(sdf.parse(jo.getString("endTime")));
        Date endTime = cal.getTime();

        this.date = new Timestamp(date.getTime());
        this.startTime = new Timestamp(startTime.getTime());
        this.endTime = new Timestamp(endTime.getTime());

        this.dateString = jo.has("dateString") && !"null".equals(jo.getString("dateString")) ?
                jo.getString("dateString")
                : "";
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
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

    public String getDateString() {
        return dateString;
    }

    public void setDateString(String dateString) {
        this.dateString = dateString;
    }
}
