package com.sholop.db.dao;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.sholop.db.mapper.EventMapper;
import com.sholop.db.mapper.SholopDateMapper;
import com.sholop.objects.Event;
import com.sholop.objects.SholopDate;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;

import java.util.Date;
import java.util.List;


public abstract class SholopDateDao implements Transactional<SholopDateDao> {
    @CreateSqlObject
    abstract Dao ttDao();

    public List<SholopDate> getAllDatesByUser(int userId){
        return ttDao().listAllDatesByUser(userId);
    }

    public List<SholopDate> getDatesByEventId(int id){ return ttDao().getDatesByEventId(id); }

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
