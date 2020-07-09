package com.sholop.utils;

import com.sholop.objects.ContactEvent;
import com.sholop.objects.Event;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.UUID;

public class Utils {
//    public static final String RELATIONAL_WEBSITE_URL = "http://localhost:8094";
//    public static final String WEBSITE_URL = "http://localhost:8094";

    public static final String RELATIONAL_WEBSITE_URL = "";
    public static final String WEBSITE_URL = "http://185.173.104.77:8094";

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
}
