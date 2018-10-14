package com.sholop.objects;

import com.amazonaws.util.json.JSONArray;
import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import org.apache.commons.lang3.RandomStringUtils;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Created by Pooyan
 * on 12/11/2017.
 */

public class Event {

    public Event(
             String eventType,
             int id,
             int venueId,
             String title,
             String description,
             Location location,
             boolean confirmNeeded,
             boolean allowJoinViaLink,
             boolean limitGuests,
             int maxGuests,
             boolean allowComments,
             String imageUrl) {
        this.id = id;
        this.venueId = venueId;
        this.title = title;
        this.description = description;
        this.confirmNeeded = confirmNeeded;
        this.allowJoinViaLink = allowJoinViaLink;
        this.limitGuests = limitGuests;
        this.maxGuests = maxGuests;
        this.allowComments = allowComments;
        this.eventType = eventType == null || eventType.equals("") ? EVENT_TYPE.UNKOWN :  EVENT_TYPE.valueOf(eventType);
        this.location = location;
        this.imageUrl = imageUrl;
    }

    enum EVENT_TYPE {UNKOWN, MEETING }

    String title, description, link, tags, imageUrl;

    Location location;

    List<SholopDate> dates;
    List<SholopImage> images;
    List<SholopAttachment> attachments;
    SholopDate closeDate;

    // setting attributes
    boolean confirmNeeded,
        allowJoinViaLink,
        limitGuests,
        allowComments;

    int id, maxGuests, venueId, userId, registeredGuests;

    EVENT_TYPE eventType;

    public Event(JSONObject jo) throws JSONException {

        this.setTitle(jo.getString("title"));
        this.setDescription(jo.has("description") ? jo.getString("description") : "");
        this.setEventType(jo.has("event_type")? EVENT_TYPE.valueOf(jo.getString("event_type")) : EVENT_TYPE.MEETING);
        this.setLocation(new Location(jo.getJSONObject("venue")));
        this.setUserId(jo.getInt("userId"));

        JSONArray datesArray = jo.getJSONArray("times");
        this.dates = new ArrayList<>();
        for(int i=0; i<datesArray.length(); i++) {
            this.dates.add(new SholopDate(datesArray.getJSONObject(i)));
        }

        this.setAllowComments(jo.has("allowComments") && jo.getBoolean("allowComments"));
        this.setAllowJoinViaLink(jo.has("joinViaLink") && jo.getBoolean("joinViaLink"));
        this.setLimitGuests(jo.has("limitGuests") && jo.getBoolean("limitGuests"));
        this.setConfirmNeeded(jo.has("confirmNeeded") && jo.getBoolean("confirmNeeded"));
        this.setMaxGuests(jo.has("maxGuests") ? jo.getInt("maxGuests") : 0);

        String tagString = "";
        if(jo.has("tags")) {

            JSONArray tagsJsonArray = jo.getJSONArray("tags");
            String[] tags = new String[tagsJsonArray.length()];
            for (int i = 0; i < tagsJsonArray.length(); i++) {
                tags[i] = tagsJsonArray.getString(i);
            }

            tagString = String.join(",", tags);
        }
        this.setTags(tagString);
        this.setId(jo.has("id") ? jo.getInt("id") : -1);
    }

    public void createLink(){
        // create random 30 characters string as the link
        this.setLink(RandomStringUtils.randomAlphabetic(30));
    }

    private void setDates(JSONArray jsonTimeCouples) {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public List<SholopDate> getDates() {
        return dates;
    }

    public void setTimes(List<SholopDate> times) {
        this.dates = times;
    }

    public boolean isConfirmNeeded() {
        return confirmNeeded;
    }

    public void setConfirmNeeded(boolean confirmNeeded) {
        this.confirmNeeded = confirmNeeded;
    }

    public boolean isAllowJoinViaLink() {
        return allowJoinViaLink;
    }

    public void setAllowJoinViaLink(boolean allowJoinViaLink) {
        this.allowJoinViaLink = allowJoinViaLink;
    }

    public boolean isLimitGuests() {
        return limitGuests;
    }

    public void setLimitGuests(boolean limitGuests) {
        this.limitGuests = limitGuests;
    }

    public boolean isAllowComments() {
        return allowComments;
    }

    public void setAllowComments(boolean allowComments) {
        this.allowComments = allowComments;
    }

    public int getMaxGuests() {
        return maxGuests;
    }

    public void setMaxGuests(int maxGuests) {
        this.maxGuests = maxGuests;
    }

    public EVENT_TYPE getEventType() {
        return eventType;
    }

    public void setEventType(EVENT_TYPE eventType) {
        this.eventType = eventType;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public void setDates(List<SholopDate> dates) {
        this.dates = dates;
    }

    public int getVenueId() {
        return venueId;
    }

    public void setVenueId(int venueId) {
        this.venueId = venueId;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<SholopImage> getImages() {
        return images;
    }

    public void setImages(List<SholopImage> images) {
        this.images = images;
    }

    public List<SholopAttachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<SholopAttachment> attachments) {
        this.attachments = attachments;
    }
}
