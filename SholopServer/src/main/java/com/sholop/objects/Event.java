package com.sholop.objects;

import com.amazonaws.util.json.JSONArray;
import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import org.apache.commons.lang3.RandomStringUtils;

import javax.persistence.*;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Pooyan
 * on 12/11/2017.
 */
@Entity(name = "sh_event")
public class Event {

    public Event(){}

    public Event(
             String eventType,
             int id,
             int venueId,
             String title,
             String welcomeMessage,
             Location location,
             boolean confirmNeeded,
             boolean allowJoinViaLink,
             boolean limitGuests,
             int maxGuests,
             boolean allowComments,
             String imageUrl,
             String status,
             int chairId) {
        this.id = id;
        this.venueId = venueId;
        this.title = title;
        this.welcomeMessage = welcomeMessage;
        this.confirmNeeded = confirmNeeded;
        this.allowJoinViaLink = allowJoinViaLink;
        this.limitGuests = limitGuests;
        this.maxGuests = maxGuests;
        this.allowComments = allowComments;
        this.eventType = eventType == null || eventType.equals("") ? EVENT_TYPE.UNKOWN.name() :  (eventType);
        this.venue = location;
        this.imageUrl = imageUrl;
        this.status = status;
        this.chairId = chairId;
    }

    public enum EVENT_TYPE {UNKOWN, MEETING }

    String title, link, tags, status;

    @Column(name = "description")
    String welcomeMessage;
    @Column(name = "image_url")
    String imageUrl;

    @Transient
    Location venue;
    @Transient
    User chair;
    @Transient
    List<SholopDate> dates;
    @Transient
    SholopDate pointedDate;
    @Transient
    List<SholopImage> images;
    @Transient
    List<SholopAttachment> attachments;
    @Transient
    List<ContactEvent> contactEvents;
    @Transient
    List<Contact> attendees;
    @Transient
    ContactEvent contactEvent;
    @Transient
    SholopDate closeDate;

    // setting attributes
    @Column(name = "confirm_needed")
    Boolean confirmNeeded;
    @Column(name = "join_via_link")
    Boolean allowJoinViaLink;
    @Column(name = "limit_guests")
    Boolean limitGuests;
    @Column(name = "allow_comments")
    Boolean allowComments;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @Column(name = "max_guests")
    Integer maxGuests;
    @Column(name = "venue_id")
    Integer venueId;
    @Column(name = "chair_id")
    Integer chairId;
    @Column(name = "created_by")
    Integer createdBy;
    @Transient
    Integer registeredGuests;

    @Column(name = "event_type")
    String eventType;

    public Event(JSONObject jo) throws JSONException, ParseException {

        this.setTitle(jo.getString("title"));
        this.setWelcomeMessage(jo.has("welcomeMessage") ? jo.getString("welcomeMessage") : "");
        this.setEventType(jo.has("eventType")? jo.getString("eventType") : EVENT_TYPE.MEETING.name());
        this.setVenue(new Location(jo.getJSONObject("venue")));
        this.setChairId(jo.getInt("chairId"));

        JSONArray datesArray = jo.getJSONArray("dates");
        this.dates = new ArrayList<>();
        for(int i=0; i<datesArray.length(); i++) {
            this.dates.add(new SholopDate(datesArray.getJSONObject(i)));
        }

        JSONArray contactsArray = jo.getJSONArray("attendees");
        this.attendees = new ArrayList<>();
        for(int i=0; i<contactsArray.length(); i++) {
            this.attendees.add(new Contact(contactsArray.getJSONObject(i)));
        }

        this.setAllowComments(jo.has("allowComments") && jo.getBoolean("allowComments"));
        this.setAllowJoinViaLink(jo.has("joinViaLink") && jo.getBoolean("joinViaLink"));
        this.setLimitGuests(jo.has("limitGuests") && jo.getBoolean("limitGuests"));
        this.setConfirmNeeded(jo.has("confirmNeeded") && jo.getBoolean("confirmNeeded"));
        this.setMaxGuests(jo.has("maxGuests") ? jo.getInt("maxGuests") : 0);
        this.setChairId(jo.has("chairId") ? jo.getInt("chairId") : 0);

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

    public String getWelcomeMessage() {
        return welcomeMessage;
    }

    public void setWelcomeMessage(String welcomeMessage) {
        this.welcomeMessage = welcomeMessage;
    }

    public Location getVenue() {
        return venue;
    }

    public void setVenue(Location venue) {
        this.venue = venue;
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

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
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

    public int getChairId() {
        return chairId;
    }

    public void setChairId(int chairId) {
        this.chairId = chairId;
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

    public List<Contact> getAttendees() {
        return attendees;
    }

    public void setAttendees(List<Contact> attendees) {
        this.attendees = attendees;
    }

    public int getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(int createdBy) {
        this.createdBy = createdBy;
    }

    public SholopDate getPointedDate() {
        return pointedDate;
    }

    public void setPointedDate(SholopDate pointedDate) {
        this.pointedDate = pointedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<ContactEvent> getContactEvents() {
        return contactEvents;
    }

    public void setContactEvents(List<ContactEvent> contactEvents) {
        this.contactEvents = contactEvents;
    }

    public User getChair() {
        return chair;
    }

    public void setChair(User chair) {
        this.chair = chair;
    }

    public ContactEvent getContactEvent() {
        return contactEvent;
    }

    public void setContactEvent(ContactEvent contactEvent) {
        this.contactEvent = contactEvent;
    }
}
