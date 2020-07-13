package com.sholop.mail;

import com.sholop.objects.*;
import com.sholop.utils.Utils;
import org.apache.commons.io.FileUtils;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.Properties;

public class MailUtils {

    public static void sendMail(MailMessage msg){
        String to = msg.getTo();
        String from = "no-reply@sholop.com"; //msg.getTo();
        String host = "localhost";//or IP address
        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.host", host);
        Session session = Session.getDefaultInstance(properties);

        try{
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.addRecipient(Message.RecipientType.TO,new InternetAddress(to));
            message.setSubject(msg.getSubject());
            message.setContent(msg.getBody(),  "text/html;charset=utf-8");

            // Send message
//            Transport.send(message);

        }catch (MessagingException mex) {mex.printStackTrace();}
    }

    public static void sendMeetingCreatedMessages(Event event) {

        if(event.getAttendees() != null && event.getAttendees().size() > 0 ) {
            for (Attendee contact : event.getAttendees()) {
                if(contact instanceof Contact){
                    Optional<ContactEvent> ce = event.getContactEvents()
                            .stream()
                            .filter(contactEvent -> contactEvent.getContactId() == ((Contact)contact).getId())
                            .findFirst();

                    ce.ifPresent(contactEvent -> MailUtils.sendContactMeetingCreated((Contact) contact, contactEvent, event));
                }
            }
        }
    }

    private static void sendContactMeetingCreated(Contact contact, ContactEvent ce, Event event) {

        try {

            MailMessage msg = new MailMessage();
            msg.setSubject(event.getTitle());
            msg.setTo(contact.getEmail());
//            msg.setFrom("iman.norouzy@gmail.com");
            msg.setFrom("root@sholop.com");

            String htmlString = FileUtils.readFileToString(new File("./content/templates/meeting/newMeetingContact.html"));
            htmlString = htmlString.replace("$logoUrl", Utils.getIconUrl("logo").toString());
            htmlString = htmlString.replace("$acceptIconUrl", Utils.getIconUrl("accept"));
            htmlString = htmlString.replace("$acceptUrl", Utils.getMyMeetingUrl(ce, event) + "/ATTENDING");
            htmlString = htmlString.replace("$refuseIconUrl", Utils.getIconUrl("refuse"));
            htmlString = htmlString.replace("$refuseUrl", Utils.getMyMeetingUrl(ce, event) + "/NOT_ATTENDING");
            htmlString = htmlString.replace("$maybeIconUrl", Utils.getIconUrl("maybe"));
            htmlString = htmlString.replace("$maybeUrl", Utils.getMyMeetingUrl(ce, event) + "/TENTATIVE");

            htmlString = htmlString.replace("$dateString", event.getPointedDate() == null ?
                    "" : event.getPointedDate().getDate() + "، از ساعت "
                    + Utils.formatTimeString(event.getPointedDate().getStartTime().toString())+ " تا "
                    + Utils.formatTimeString(event.getPointedDate().getEndTime().toString()) );

            htmlString = htmlString.replace("$name", contact.getName());
            htmlString = htmlString.replace("$email", contact.getEmail());
            htmlString = htmlString.replace("$title", event.getTitle());
            htmlString = htmlString.replace("$welcomeMessage", event.getWelcomeMessage());
            htmlString = htmlString.replace("$chairName", event.getChair().getName());
            htmlString = htmlString.replace("$chairImageUrl", Utils.WEBSITE_URL + event.getChair().getImageUrl());
            htmlString = htmlString.replace("$mapUrl", Utils.WEBSITE_URL + event.getVenue().getMapUrl());
            htmlString = htmlString.replace("$address", event.getVenue().getFarsiAddress1() + ", " + event.getVenue().getFarsiAddress2());
            htmlString = htmlString.replace("$qrUrl", Utils.WEBSITE_URL + ce.getQRCodeUrl());

            msg.setBody(htmlString);
            MailUtils.sendMail(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static void sendRegisterMail(User user) {

        try {

            MailMessage msg = new MailMessage();
            msg.setSubject("خیلی خوش اومدید");
            msg.setTo(user.getEmail());
            msg.setFrom("root@sholop.com");

            String htmlString = FileUtils.readFileToString(new File("./content/templates/register.html"));
            htmlString = htmlString.replace("$logoUrl", Utils.getIconUrl("logo"));
            htmlString = htmlString.replace("$name", user.getName());

            msg.setBody(htmlString);
            MailUtils.sendMail(msg);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
