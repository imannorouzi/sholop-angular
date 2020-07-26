import com.sholop.objects.Event;
import com.sholop.repositories.RepositoryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

public class Test {

    @Autowired
    RepositoryFactory repositoryFactory;

    public static void main(String []args){

        try {
            (new Test()).readByDate();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    public void hash(){
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        String bc = bCryptPasswordEncoder.encode("password");

        System.out.println(bc);
    }


    public void readByDate() throws ParseException {

        String dateString = "2020-07-20T14:00:00.000Z";
        TimeZone tz = TimeZone.getTimeZone("UTC");
        Calendar cal = Calendar.getInstance(tz);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        sdf.setCalendar(cal);
        cal.setTime(sdf.parse(dateString));
        Date date = cal.getTime();

        List<Event> events = repositoryFactory.getEventRepository().findMyMeetings(
                22,
                "iman.norouzy@gmail.com",
                new Timestamp(date.getTime()),
                true
        );
        System.out.println(events.size());
    }
}
