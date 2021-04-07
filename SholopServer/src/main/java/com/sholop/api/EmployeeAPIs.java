package com.sholop.api;

import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.objects.ResponseObject;
import com.sholop.objects.User;
import com.sholop.repositories.RepositoryFactory;
import com.sholop.utils.FileStorageService;
import com.sholop.utils.Utils;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.annotation.security.PermitAll;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@RestController
public class EmployeeAPIs {

    final RepositoryFactory repositoryFactory;

    private final FileStorageService fileStorageService;

    Gson gson = new Gson();

    public EmployeeAPIs(RepositoryFactory repositoryFactory, FileStorageService fileStorageService) {
        this.repositoryFactory = repositoryFactory;
        this.fileStorageService = fileStorageService;
    }

//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @GetMapping("/employee/{id}")
    public User getContact(@PathVariable String id){
        int blogId = Integer.parseInt(id);
        return repositoryFactory.getUserRepository().findById(blogId).orElse(null);
    }


    @GetMapping("/get-employees")
    public Response getEmployees(@AuthenticationPrincipal UserDetails u,
                                 @RequestParam(value = "role", required = false) String role,
                                 @RequestParam("hint") String hint)  {

        try {

            List<User> employees = null;
            User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());

            if(role==null || role.isEmpty()){
                employees = repositoryFactory.getUserRepository().findAllByParentId(user.getId());
            }else{
                employees = repositoryFactory.getUserRepository().findAllByParentIdAndRole(user.getId(), role);
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", employees))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", e.getMessage()))).build();
        }
    }


    // return employees and coleagues
    @GetMapping("/get-users")
    public Response getUsers(@AuthenticationPrincipal UserDetails u,
                                 @RequestParam("hint") String hint)  {

        try {

            List<User> employees = null;
            User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());

            if(user.getParentId() != null){
                employees = repositoryFactory.getUserRepository().findAllByParentIdOrParentId(user.getId(), user.getParentId());
            }else{
                employees = repositoryFactory.getUserRepository().findAllByParentId(user.getId());
            }

            return Response.ok(gson.toJson(new ResponseObject("OK", employees))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", e.getMessage()))).build();
        }
    }


    @PostMapping("/update-employee")
    public Response updateEmployee(@AuthenticationPrincipal UserDetails u,
                                  @RequestParam(value = "file", required = false) MultipartFile file,
                                  @RequestParam("employee") String contactJsonString,
                                  @RequestParam(value = "filename", required = false) String filename) {


        User parent = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        User user;
        try {
            JSONObject jsonContact = new JSONObject(contactJsonString);
            user = new User(jsonContact);

            User tempUser = repositoryFactory.getUserRepository().findByUsername(user.getUsername());
            if(tempUser != null){
                return Response.status(500).entity(gson.toJson(new ResponseObject("USER_EXISTS", tempUser))).build();
            }

            if(filename != null && file != null) {
                filename = "user_" + user.getId() + "_" + filename.replaceAll("\\s+", "");

                String fileName = fileStorageService.storeFile(file, "images/users/" + filename, "/");

                String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/download/")
                        .path(fileName)
                        .toUriString();
                user.setImageUrl(Utils.fixUri(fileDownloadUri));
            }

            user.setParentId(parent.getId());

            repositoryFactory.getUserRepository().save(user);

        } catch (Exception e) {
            e.printStackTrace();

            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", ""))).build();
        }


        return Response.ok(gson.toJson(new ResponseObject("OK", user))).build();
    }

    @PermitAll
    @PostMapping("/delete-employee")
    public Response deleteEmployee( @AuthenticationPrincipal UserDetails u,
                                   @RequestBody Integer id){

        User parent = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
        Optional<User> user = null;
        try {
            user = repositoryFactory.getUserRepository().findById(id);
            if(user.isPresent() && user.get().getParentId() == parent.getId()){
                user.get().setParentId(-1);
                repositoryFactory.getUserRepository().save(user.get());
                return Response.ok(gson.toJson(new ResponseObject("OK", user.get()))).build();
            }else{
                return Response.ok(gson.toJson(new ResponseObject("FAIL", "NOT FOUND."))).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.ok(gson.toJson(new ResponseObject("FAIL", e.getMessage()))).build();
        }

    }
}
