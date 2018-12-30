package com.sholop.mail;

import com.sholop.Utils;
import com.sholop.objects.Contact;
import com.sholop.objects.ContactEvent;
import com.sholop.objects.Event;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;

public class MailUtils {

    public static void sendMail(MailMessage msg){

        String to = msg.getTo();
        String from = msg.getTo();



        from = "iman.norouzy@gmail.com";
        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.host", "smtp.gmail.com");
        properties.setProperty("mail.smtp.port", "587");
        properties.setProperty("mail.smtp.starttls.enable", "true");
        properties.setProperty("mail.smtp.tls.enable", "true");
        properties.setProperty("mail.smtp.auth", "true");

        Session session = Session.getDefaultInstance(properties, new Authenticator() {

            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("iman.norouzy@gmail.com", "solotar5042");
            }

        });


        /*String host = "localhost";//or IP address

        //Get the session object
        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.host", host);
        Session session = Session.getDefaultInstance(properties);*/

        try{
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.addRecipient(Message.RecipientType.TO,new InternetAddress(to));
            message.setSubject(msg.getSubject());
            message.setContent(msg.getBody(),  "text/html;charset=utf-8");

            // Send message
            Transport.send(message);

        }catch (MessagingException mex) {mex.printStackTrace();}
    }

    public static void sendMeetingCreatedMessages(Event event) {

        for(Contact contact: event.getAttendees()){
            Optional<ContactEvent> ce = event.getContactEvents()
                    .stream()
                    .filter(contactEvent -> contactEvent.getContactId() == contact.getId())
                    .findFirst();

            ce.ifPresent(contactEvent -> MailUtils.sendContactMeetingCreated(contact, contactEvent, event));
        }
    }

    private static void sendContactMeetingCreated(Contact contact, ContactEvent ce, Event event) {

        try {

            MailMessage msg = new MailMessage();
            msg.setSubject(event.getTitle());
            msg.setTo(contact.getEmail());
//            msg.setFrom("iman.norouzy@gmail.com");
            msg.setFrom("root@sholop.com");

            String htmlString = FileUtils.readFileToString(new File("./contents/templates/meeting/newMeetingContact.html"));

            htmlString = htmlString.replace("$logoUrl", Utils.getIconUrl("logo"));

            htmlString = htmlString.replace("$acceptIconUrl", Utils.getIconUrl("accept"));
//            htmlString = htmlString.replace("$acceptIconUrl", "http://185.173.104.77:8094/contents/correct-symbol.png");
            htmlString = htmlString.replace("$acceptUrl", Utils.getMyMeetingUrl(ce, event) + "/ATTENDING");

            htmlString = htmlString.replace("$refuseIconUrl", Utils.getIconUrl("refuse"));
//            htmlString = htmlString.replace("$refuseIconUrl", "http://185.173.104.77:8094/contents/remove-symbol.png");
            htmlString = htmlString.replace("$refuseUrl", Utils.getMyMeetingUrl(ce, event) + "/NOT_ATTENDING");

            htmlString = htmlString.replace("$maybeIconUrl", Utils.getIconUrl("maybe"));
//            htmlString = htmlString.replace("$maybeIconUrl", "http://185.173.104.77:8094/contents/exclamation.png");
            htmlString = htmlString.replace("$maybeUrl", Utils.getMyMeetingUrl(ce, event) + "/TENTATIVE");


            htmlString = htmlString.replace("$dateString", event.getPointedDate() == null ?
                    "" : event.getPointedDate().getDateString() + "، از ساعت "
                    + Utils.formatTimeString(event.getPointedDate().getStartTime())+ " تا "
                    + Utils.formatTimeString(event.getPointedDate().getEndTime()) );

            htmlString = htmlString.replace("$name", contact.getName());
            htmlString = htmlString.replace("$title", event.getTitle());
            htmlString = htmlString.replace("$welcomeMessage", event.getWelcomeMessage());
            htmlString = htmlString.replace("$chairName", event.getChair().getName());

            htmlString = htmlString.replace("$chairImageUrl", Utils.WEBSITE_URL + event.getChair().getImageUrl());
//            htmlString = htmlString.replace("$chairImageUrl", "http://185.173.104.77:8094/assets/images/user-placeholder.png");

            htmlString = htmlString.replace("$mapUrl", Utils.WEBSITE_URL + event.getVenue().getMapUrl());
//            htmlString = htmlString.replace("$mapUrl", "http://185.173.104.77:8094/contents/venue.png");

            htmlString = htmlString.replace("$address", event.getVenue().getFarsiAddress1() + ", " + event.getVenue().getFarsiAddress2());

            htmlString = htmlString.replace("$qrUrl", Utils.WEBSITE_URL + ce.getQRCodeUrl());
//            htmlString = htmlString.replace("$qrUrl", "http://185.173.104.77:8094/contents/qr.png");

            msg.setBody(htmlString);
            MailUtils.sendMail(msg);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
