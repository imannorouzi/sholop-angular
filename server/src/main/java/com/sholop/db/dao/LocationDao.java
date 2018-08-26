package com.sholop.db.dao;

/**
 * Created by Pooyan on 12/11/2017.
 */

import com.sholop.db.mapper.LocationMapper;
import com.sholop.objects.Location;
import org.skife.jdbi.v2.sqlobject.*;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;

import javax.annotation.Generated;
import javax.ws.rs.Encoded;
import java.util.List;


public abstract class LocationDao implements Transactional<LocationDao> {
    @CreateSqlObject
    abstract Dao ttDao();

    public List<Location> getAllLocations(){
        return ttDao().listAllLocations();
    }

    public Location getLocationById(int id){ return ttDao().getLocationById(id); }

    public List<Location> getLocationsByUserId(int userId){ return ttDao().getLocationsByUserId(0); }

    public Location update(Location location){
        ttDao().updateLocation(location.getId(),
                location.getTitle(),
                location.getFarsiAddress1(),
                location.getFarsiAddress2(),
                location.getEnglishAddress(),
                location.getLatitude(),
                location.getLongitude(),
                location.getDescription(),
                location.getUserId());

        return location;
    }

    public int insert(Location location){
        return ttDao().insert(
                location.getTitle(),
                location.getFarsiAddress1(),
                location.getFarsiAddress2(),
                location.getEnglishAddress(),
                location.getLatitude(),
                location.getLongitude()
        );
    }

    public void delete(int id, int userId) {
        ttDao().deleteLocation(id, userId);
    }

    @RegisterMapper(LocationMapper.class)
    private interface Dao {
        @SqlQuery("SELECT * FROM sh_venue WHERE 1=1 ORDER BY 1 ")
        List<Location> listAllLocations();

        @SqlUpdate("update sh_venue set persian_address_1=:persian_address_1, persian_address_2=:persian_address_2, " +
                " english_address=:english_address, title=:title, description=:description, latitude=:latitude, longitude=:longitude, user_id=:user_id  WHERE id=:id")
        void updateLocation(
                @Bind("id") int id,
                @Bind("title") String title,
                            @Bind("persian_address_1") String persianAddress1,
                            @Bind("persian_address_2") String persianAddress2,
                            @Bind("english_address") String englishAddress,
                            @Bind("latitude") double latitude,
                            @Bind("longitude") double longitude,
                            @Bind("description") String description,
                            @Bind("user_id") int userId);

        @SqlUpdate("update sh_venue set is_active = false where user_id=:user_id and id=:id")
        void deleteLocation(
                @Bind("id") int id, @Bind("user_id") int userId);

        @SqlQuery("SELECT * FROM sh_venue WHERE id=:id")
        Location getLocationById(@Bind("id") int id);

        @SqlQuery("SELECT * FROM sh_venue WHERE user_id=:id and is_active=true")
        List<Location> getLocationsByUserId(@Bind("id") int id);

        @GetGeneratedKeys
        @SqlUpdate("insert into sh_venue (title, english_address, persian_address_1, persian_address_2, latitude, longitude)" +
                " values(:title, :english_address, :persian_address_1, :persian_address_2, :latitude, :longitude)")
        int insert(
                @Bind("title") String title,
                @Bind("persian_address_1") String persianAddress1,
                @Bind("persian_address_2") String persianAddress2,
                @Bind("english_address") String englishAddress,
                @Bind("latitude") double latitude,
                @Bind("longitude") double longitude);
    }
}
