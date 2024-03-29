package com.sholop.api;

import com.amazonaws.util.json.JSONObject;
import com.google.gson.Gson;
import com.sholop.mail.MailUtils;
import com.sholop.objects.*;
import com.sholop.repositories.RepositoryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.PermitAll;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import java.util.Optional;

@RestController
public class commentAPIs {

    final RepositoryFactory repositoryFactory;

    Gson gson = new Gson();

    public commentAPIs(RepositoryFactory repositoryFactory) {
        this.repositoryFactory = repositoryFactory;
    }

    @GetMapping("/comment/{id}")
    public Comment getComment(@PathVariable String id){
        int blogId = Integer.parseInt(id);
        return repositoryFactory.getCommentRepository().findById(blogId).orElse(null);
    }

    @GetMapping("/get-comments/{eventId}/{page}")
    public Response getComments(@AuthenticationPrincipal UserDetails u,
                                @PathVariable("eventId") Integer meetingId,
                                @PathVariable("page") Integer page){

        try{

            User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
            Pageable pageable = PageRequest.of(page, 5);

            Page<Comment> commentPage = repositoryFactory.getCommentRepository().findAllByEventId(meetingId, pageable);
            for(Comment comment: commentPage.toList()) {
                if (comment.getUserId() != -1) {
                    Optional<User> author = repositoryFactory.getUserRepository().findById(comment.getUserId());
                    if (author.isPresent()) {
                        comment.setUserName(author.get().getName());
                        comment.setUserImageUrl(author.get().getImageUrl());
                    }
                }else if (comment.getContactId() != -1) {
                    Optional<Contact> author = repositoryFactory.getContactRepository().findById(comment.getContactId());
                    if (author.isPresent()) {
                        comment.setUserName(author.get().getName());
                        comment.setUserImageUrl(author.get().getImageUrl());
                    }
                }
            }
            return Response.ok(gson.toJson(new ResponseObject("OK", commentPage.toList()))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(gson.toJson(new ResponseObject("FAIL", e.getMessage())))
                    .build();
        }
    }



    @GetMapping("/get-comments-guest")
    public Response getComments(@QueryParam("uuid") String uuid,
                                @QueryParam("page") int page) {

        Gson gson = new Gson();
        try {

//            ContactEvent contactEvent = contactEventDao.getEventContactByUUID(uuid);
//            List<Comment> comments = commentDao.getCommentsByEventId(contactEvent.getEventId(), page);
//
//            Utils.setCommentsAuthor(comments, userDao, contactDao);


            return Response.ok(gson.toJson(new ResponseObject("OK", null))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @PostMapping("/create-comment")
    public Response createComment( @AuthenticationPrincipal UserDetails u, @RequestBody String jsonCommentString) {

        Gson gson = new Gson();
        int id = -1;
        try {

            User user = repositoryFactory.getUserRepository().findByUsername(u.getUsername());
            JSONObject jsonComment = new JSONObject(jsonCommentString);

            Comment comment = new Comment(jsonComment);
            comment.setUserId(user.getId());
            comment = repositoryFactory.getCommentRepository().save(comment);
            comment.setUserImageUrl(user.getImageUrl());
            comment.setUserName(user.getName());


            Optional<Event> event = repositoryFactory.getEventRepository().findById(comment.getEventId());
            if(event.isPresent()){
                MailUtils.sendCommentEmails(event.get(), comment);
            }
            return Response.ok(gson.toJson(new ResponseObject("OK", comment))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @PostMapping("/create-comment-guest")
    public Response createComment(String jsonCommentString){

        Gson gson = new Gson();
        int id = -1;
        try {
            JSONObject jsonComment = new JSONObject(jsonCommentString);

            String uuid = jsonComment.getString("uuid");
            ContactEvent contactEvent = repositoryFactory.getContactEventRepository().findByUuid(uuid);
            Contact contact = repositoryFactory.getContactRepository().findById(contactEvent.getContactId()).orElse(null);

            Comment comment = new Comment(jsonComment);

            comment.setUserId(-1);
            comment.setContactId(contactEvent.getContactId());
            comment.setEventId(contactEvent.getEventId());
            comment.setUserName(contact.getName());
            comment.setUserImageUrl(contact.getImageUrl());
            comment = repositoryFactory.getCommentRepository().save(comment);

            return Response.ok(gson.toJson(new ResponseObject("OK", comment))).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .build();
        }
    }

    @PermitAll
    @PostMapping("/delete-comment")
    public Response deleteComment(  @AuthenticationPrincipal UserDetails u,
                                    @RequestBody String id){

        Gson gson = new Gson();
        try {
            repositoryFactory.getCommentRepository().deleteById(Integer.valueOf(id));
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(new ResponseObject("FAIL", e.getMessage()))
                    .build();
        }

        return Response.ok(gson.toJson(new ResponseObject("OK", id))).build();
    }
}
