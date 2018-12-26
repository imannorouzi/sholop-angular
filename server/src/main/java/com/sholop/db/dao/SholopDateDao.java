package com.sholop.db.dao;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.sholop.db.mapper.EventMapper;
import com.sholop.db.mapper.SholopDateMapper;
import com.sholop.objects.Event;
import com.sholop.objects.SholopDate;
import org.joda.time.DateTime;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;


public abstract class SholopDateDao implements Transactional<SholopDateDao> {
    @CreateSqlObject
    abstract Dao ttDao();

    public List<SholopDate> getAllDatesByUser(int userId){
        return ttDao().listAllDatesByUser(userId);
    }

    public List<SholopDate> getDatesByEventId(int id) throws ParseException {
        List<SholopDate> sholopDates = ttDao().getDatesByEventId(id);
//        Wed Dec 26 13:00:00 AEDT 2018
        for(SholopDate sd : sholopDates){
//            sd.setDate( DateTime.parse(sd.getDate().toString()).atZone( ZoneId.of("GMT")) );
            System.out.println(sholopDates);

//            Date date = new Date();
//            date.setDate(sd.getDate().getDate());
//            date.setMonth(sd.getDate().getMonth());
//            date.setYear(sd.getDate().getYear());
//
//            date.setHours(sd.getDate().getHours());
//            date.setMinutes(sd.getDate().getMinutes());



            DateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss");
            dateFormat.setTimeZone(TimeZone.getTimeZone("GMT"));
            Date formattedDate = dateFormat.parse(sd.getDate().toLocaleString());

            sd.setDate(formattedDate);

        }
        return sholopDates;

    }

    public SholopDate update(SholopDate date){
        ttDao().updateDate(date);

        return date;
    }

    public int insert(SholopDate date, int id){
        return ttDao().insert(
                date.getDate(),
                date.getDateString(),
                id,
                date.getStartTime().replace(":",""),
                date.getEndTime().replace(":", "")
        );
    }

    public void deleteEventDates(int id) {
        ttDao().deleteEventDates(id);
    }

    @RegisterMapper(SholopDateMapper.class)
    private interface Dao {
        @SqlQuery("SELECT * FROM as_lines WHERE 1=1 ORDER BY 1 ")
        List<SholopDate> listAllDatesByUser(int userId);

        @SqlQuery("SELECT * FROM sh_event_date WHERE event_id=:id")
        List<SholopDate> getDatesByEventId(@Bind("id") int id);

        @GetGeneratedKeys
        @SqlUpdate("insert into sh_event_date (date, date_string, event_id, start_time_string, end_time_string)" +
                " values(:date, :date_string, :event_id, :start_time_string, :end_time_string)")
        int insert(@Bind("date") Date date,
                   @Bind("date_string") String dateString,
                   @Bind("event_id") int id,
                   @Bind("start_time_string") String startTime,
                   @Bind("end_time_string") String endTime);

        @SqlUpdate("update sh_event_date (date, start_time_string, end_time_string)" +
                " values(:date, :start_time_string, :end_time_string)")
        void updateDate(SholopDate date);

        @SqlUpdate("delete from sh_event_date where event_id=:event_id")
        void deleteEventDates(@Bind("event_id") int id);
    }
}
