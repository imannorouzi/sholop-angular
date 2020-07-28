package com.sholop.mail;

import com.sholop.objects.*;
import com.sholop.utils.Utils;
import org.apache.commons.io.FileUtils;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.IOException;
import java.util.Properties;

public class MailUtils {

    public static void sendMail(MailMessage msg){
        String to = msg.getTo();
        String from = "root@sholop.com"; //msg.getTo();
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
            Transport.send(message);

        }catch (MessagingException mex) {mex.printStackTrace();}
    }

    public static void sendMeetingCreatedMessages(Event event) {

        if(event.getContactEvents() != null){
            for(ContactEvent ce: event.getContactEvents()){
                if(ce.getType().equals(ContactEvent.TYPE.USER.name())){
                    // send a user message
                }else {
                    MailUtils.sendContactMeetingCreated(ce, event);
                }
            }
        }

        MailUtils.sendChairMeetingCreated(event);

        /*if(event.getAttendees() != null && event.getAttendees().size() > 0 ) {
            for (Attendee contact : event.getAttendees()) {
                if(contact instanceof Contact){
                    Optional<ContactEvent> ce = event.getContactEvents()
                            .stream()
                            .filter(contactEvent -> contactEvent.getContactId() == ((Contact)contact).getId())
                            .findFirst();

                    ce.ifPresent(contactEvent -> MailUtils.sendContactMeetingCreated((Contact) contact, contactEvent, event));
                }else{
                    // it's a user
                }
            }
        }*/
    }

    private static void sendChairMeetingCreated(Event event) {

        try {

            if(event.getChair() == null) return;

            MailMessage msg = new MailMessage();
            msg.setSubject("".equals(event.getTitle()) ? "قرار ملاقات" : event.getTitle());
            msg.setTo(event.getChair().getEmail());
//            msg.setFrom("iman.norouzy@gmail.com");
            msg.setFrom("root@sholop.com");

            String htmlString = FileUtils.readFileToString(new File("./content/templates/meeting/newMeetingChair.html"));
            htmlString = htmlString.replace("$logo-url", Utils.getIconUrl("logo").toString());
            String dates = "";
            for(EventDate date: event.getDates()){
                dates += date.getDateString() + "<br>";
            }
            htmlString = htmlString.replace("$date-string", dates);

            htmlString = htmlString.replace("$title", event.getTitle());
            htmlString = htmlString.replace("$name", event.getChair().getName());
            htmlString = htmlString.replace("$chair-name", event.getChair().getName());
            htmlString = htmlString.replace("$map-url", Utils.WEBSITE_URL + event.getVenue().getMapUrl());
            htmlString = htmlString.replace("$venue-address-1", event.getVenue().getFarsiAddress1() );
            htmlString = htmlString.replace("$venue-address-2", event.getVenue().getFarsiAddress2());

            msg.setBody(htmlString);
            MailUtils.sendMail(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private static void sendContactMeetingCreated(ContactEvent ce, Event event) {

        try {

            MailMessage msg = new MailMessage();
            msg.setSubject("".equals(event.getTitle()) ? "قرار ملاقات" : event.getTitle());
            msg.setTo(ce.getEmail());
//            msg.setFrom("iman.norouzy@gmail.com");
            msg.setFrom("root@sholop.com");

            String htmlString = FileUtils.readFileToString(new File("./content/templates/meeting/newMeetingContact.html"));
            htmlString = htmlString.replace("$logo-url", Utils.getIconUrl("logo").toString());
//            htmlString = htmlString.replace("$acceptIconUrl", Utils.getIconUrl("accept"));
//            htmlString = htmlString.replace("$acceptUrl", Utils.getMyMeetingUrl(ce, event) + "/ATTENDING");
//            htmlString = htmlString.replace("$refuseIconUrl", Utils.getIconUrl("refuse"));
//            htmlString = htmlString.replace("$refuseUrl", Utils.getMyMeetingUrl(ce, event) + "/NOT_ATTENDING");
//            htmlString = htmlString.replace("$maybeIconUrl", Utils.getIconUrl("maybe"));
//            htmlString = htmlString.replace("$maybeUrl", Utils.getMyMeetingUrl(ce, event) + "/TENTATIVE");

            String dates = "";
            for(EventDate date: event.getDates()){
                dates += date.getDateString() + "<br>";
            }
            htmlString = htmlString.replace("$date-string", dates);

            htmlString = htmlString.replace("$title", event.getTitle());
            htmlString = htmlString.replace("$name", ce.getName());
            htmlString = htmlString.replace("$welcome-message", "".equals(event.getWelcomeMessage()) ? "شما به یک ملاقات دعوت شده‌اید!" : event.getWelcomeMessage());
            htmlString = htmlString.replace("$chair-name", event.getChair().getName());
            htmlString = htmlString.replace("$map-url", Utils.WEBSITE_URL + event.getVenue().getMapUrl());
            htmlString = htmlString.replace("$venue-address-1", event.getVenue().getFarsiAddress1() );
            htmlString = htmlString.replace("$venue-address-2", event.getVenue().getFarsiAddress2());
            htmlString = htmlString.replace("$qr-code-url", Utils.WEBSITE_URL + ce.getQRCodeUrl());
            htmlString = htmlString.replace("$meeting-url", Utils.WEBSITE_URL + "/my-meeting/" + ce.getUuid());

            msg.setBody(htmlString);
            MailUtils.sendMail(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static void sendRegisterMail(User user) {

        try {

            MailMessage msg = new MailMessage();
            msg.setSubject("با شالاپ خوش آمدید");
            msg.setTo(user.getEmail());
            msg.setFrom("root@sholop.com");

            String htmlString = FileUtils.readFileToString(new File("./content/templates/register.html"));
            htmlString = htmlString.replace("$logo-url", Utils.getIconUrl("logo"));
            htmlString = htmlString.replace("$name", user.getName());
            htmlString = htmlString.replace("$confirm-email-url", Utils.WEBSITE_URL + "/confirm-email/" + user.getConfirmEmailUUID());

            msg.setBody(htmlString);
            MailUtils.sendMail(msg);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void sendTemplate(String templateName, String to) {

        try {

            MailMessage msg = new MailMessage();
            msg.setSubject("خیلی خوش اومدید");
            msg.setTo(to);
            msg.setFrom("root@sholop.com");

            String htmlString = FileUtils.readFileToString(new File("./content/templates/" + templateName + ".html"));

            msg.setBody(htmlString);
            MailUtils.sendMail(msg);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void sendCommentEmails(Event event, Comment comment) {
        // send to users

        // send to contacts
    }
}
