package com.sholop.api;

import com.amazonaws.util.json.JSONException;
import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.objects.Location;
import com.sholop.objects.ResponseObject;
import com.sholop.objects.User;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.PermitAll;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;

@RestController
public class EventAPIs {

    @Autowired
    RepositoryFactory repositoryFactory;

    @Autowired
    private FileStorageService fileStorageService;

    Gson gson = new Gson();

    @PermitAll
    @GetMapping("/get-venues")
    public Response getVenues(@AuthenticationPrincipal UserDetails u, @QueryParam("hint") String hint) {

        User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        try {

            List<Location> locations = repositoryFactory.getLocationRepository().findAllByUserId(user.getId());
            return Response.ok(gson.toJson(new ResponseObject("OK", locations))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @PermitAll
    @PostMapping("/update-venue")
    public Response updateVenue( @AuthenticationPrincipal UserDetails u,
                                 @RequestBody String venueJsonString) {

        Gson gson = new Gson();

        User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        Location location = null;
        try {

            JSONObject jsonLocation = new JSONObject(venueJsonString);
            location = new Location(jsonLocation);

            location.setUserId(user.getId());
            location.setMapUrl(this.fileStorageService.downloadMap(
                    location.getLatitude(),
                    location.getLongitude()
            ));

            location = repositoryFactory.getLocationRepository().save(location);

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", location))).build();
    }

}
