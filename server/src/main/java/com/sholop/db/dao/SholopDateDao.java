package com.sholop.db.dao;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.sholop.Utils;
import com.sholop.db.mapper.SholopDateMapper;
import com.sholop.objects.Event;
import com.sholop.objects.SholopDate;
import com.sholop.objects.User;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;


public abstract class SholopDateDao implements Transactional<SholopDateDao> {
    @CreateSqlObject
    abstract Dao ttDao();

    public List<SholopDate> getAllDatesByUser(int userId){
        return ttDao().listAllDatesByUser(userId);
    }

    public List<SholopDate> getDatesByEventId(int id) throws ParseException {
        List<SholopDate> sholopDates = ttDao().getDatesByEventId(id);
        for(SholopDate sd : sholopDates){
            sd.setDate(Utils.readFromGMT(sd.getDate()));
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

    public List<SholopDate> getEDatesByPeriod(String type, User user, Date dbStartDate, Date dbEndDate) {
        return ttDao().getDatesByPeriod(type, user.getId(), user.getEmail(), dbStartDate, dbEndDate);
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

        @SqlQuery("SELECT distinct d.* FROM sh_event s " +
                "inner join sh_event_date d on s.id=d.event_id " +
                "inner join sh_contact_event ec on s.id=ec.event_id " +
                "inner join sh_contact c on c.id=ec.contact_id " +
                "WHERE d.date between :start_date and :end_date " +
                "and event_type=:type " +
                "and (s.chair_id=:user_id or c.email=:email) ")
        List<SholopDate> getDatesByPeriod(@Bind("type") String type,
                                           @Bind("user_id") int userId,
                                           @Bind("email") String email,
                                           @Bind("start_date") Date startDate,
                                           @Bind("end_date") Date endDate);
    }


}
