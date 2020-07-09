package com.sholop.objects;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;

public class ContactUsMessage {

    String name, email, title, message;

    public ContactUsMessage(JSONObject jo){
        try {
            this.name = jo.has("name") ? jo.getString("name"): "";
            this.email = jo.has("email") ? jo.getString("email"): "";
            this.title = jo.has("title") ? jo.getString("title"): "";
            this.message = jo.has("message") ? jo.getString("message"): "";
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
