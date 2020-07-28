package com.sholop.utils;

import com.sholop.objects.ContactEvent;
import com.sholop.objects.Event;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.util.UUID;

public class Utils {

    public static final String RELATIONAL_WEBSITE_URL = "";
//    public static final String WEBSITE_URL = "http://185.173.104.77";
    public static final String WEBSITE_URL = "http://185.173.104.77";

    static TimeZone tz = TimeZone.getTimeZone("UTC");
    static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    public static String generateRandomString(){
        return UUID.randomUUID().toString();
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
                .append("/#/contact-meeting")
                .append("/").append(ce.getUuid())
                .append("/").append(event.getPointedDate().getId()).toString();
    }

    public static String fixUri(String fileDownloadUri) {
        return fileDownloadUri.replace("http://localhost:8083", "/sholop-api");
    }

    /*public static String saveFile(InputStream uploadedInputStream,
                           FormDataContentDisposition fileDetail,
                           FormDataBodyPart body,
                           String relPath) throws IOException {

        final String SRC_UPLOAD_PATH = "./ui/app" + relPath;

        String uploadedFileName =  fileDetail.getFileName();
        String uniqueUploadedFileName =  (uploadedFileName + "_"
                + (new Date()).toString()).replace(" ", "").replace(":","")
                + "." + body.getMediaType().getSubtype();

        Files.copy(uploadedInputStream, Paths.get(SRC_UPLOAD_PATH + uniqueUploadedFileName),
                StandardCopyOption.REPLACE_EXISTING);

        return relPath + uniqueUploadedFileName;
    }


    public static void setCommentsAuthor(List<Comment> comments, UserDao userDao, ContactDao contactDao) {
        comments.forEach(comment -> {
            if(comment.getUserId() > 0){
                User u = userDao.getUserById(comment.getUserId());
                comment.setUserName(u.getName());
                comment.setUserImageUrl(u.getImageUrl());
            }else if(comment.getContactId() > 0 ){
                Contact contact = contactDao.getContactById(comment.getContactId());
                comment.setUserName(contact.getName());
                comment.setUserImageUrl(contact.getImageUrl());
            }
        });
    }*/

    
    public static Date convertStringToDateUTC(String dateString){
        Calendar cal = Calendar.getInstance(tz);
        sdf.setCalendar(cal);
        try {
            cal.setTime(sdf.parse(dateString));
            return cal.getTime();
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
        
    }

}
