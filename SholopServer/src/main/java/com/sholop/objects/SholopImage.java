package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

/**
 * Created by Pooyan on 3/20/2018.
 */
public class SholopImage {

    int id, eventId;
    String name, url;

    public SholopImage(int id,
                       int eventId,
                       String name,
                       String url){
        this.eventId = eventId;
        this.id = id;
        this.name = name;
        this.url = url;
    }

    public SholopImage(JSONObject jo) throws JSONException {

        this.eventId = jo.getInt("event_id");
        this.id = jo.has("id") ? jo.getInt("id") : -1;
        this.name = jo.getString("name");
        this.url = jo.getString("url");
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
