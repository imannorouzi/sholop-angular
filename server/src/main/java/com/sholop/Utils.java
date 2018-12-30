package com.sholop;

import com.sholop.objects.ContactEvent;
import com.sholop.objects.Event;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.UUID;

public class Utils {
    public static final String WEBSITE_URL = "http://185.173.104.77:8094";
    public static final String RELATIONAL_WEBSITE_URL = "http://localhost:8094";
//    public static final String RELATIONAL_WEBSITE_URL = "";

    public static Date readFromGMT(Date date) throws ParseException {
        String datePattern = "dd-MMM-yyyy, HH:mm:ss";
        SimpleDateFormat format = new SimpleDateFormat(datePattern);
        String dateString = format.format(date);

        DateFormat dateFormat = new SimpleDateFormat(datePattern);
        dateFormat.setTimeZone(TimeZone.getTimeZone("GMT"));
        Date formattedDate = dateFormat.parse(dateString);

        return formattedDate;
    }

    public static String generateRandomString(){
        String uuid = UUID.randomUUID().toString();
        return uuid;
    }

    public static CharSequence getIconUrl(String icon) {
        switch (icon){
            case "logo":
                return WEBSITE_URL + "/assets/images/Sholop-Logo.png";

            case "accept":
                return WEBSITE_URL + "/assets/images/correct-symbol.png";

            case "refuse":
                return WEBSITE_URL + "/assets/images/remove-symbol.png";

            case "maybe":
                return WEBSITE_URL + "/assets/images/exclamation.png";
        }
        return WEBSITE_URL + "/assets/images/Sholop-Logo.png";
    }

    public static String formatTimeString(String timeString){
        return timeString.substring(0, 2) + ":" + timeString.substring(2);
    }

    public static String getMyMeetingUrl(ContactEvent ce, Event event) {

        return new StringBuilder()
                .append(WEBSITE_URL)
                .append("/contact-meeting")
                .append("/").append(ce.getUuid())
                .append("/").append(event.getPointedDate().getId()).toString();
    }
}
