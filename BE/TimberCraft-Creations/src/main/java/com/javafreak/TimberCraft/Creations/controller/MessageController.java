package com.javafreak.TimberCraft.Creations.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javafreak.TimberCraft.Creations.entity.Message;
import com.javafreak.TimberCraft.Creations.service.MessageService;

@RestController
@RequestMapping("/message")
public class MessageController {

	@Autowired
	MessageService messageService;
	
	@GetMapping("/gatAllUnread")
	public ResponseEntity<List<Message>> gatAllUnread() {
		
		List<Message> message = messageService.gatAllUnread();
        if (message == null || message.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(message);
	}
	
	@PostMapping("/createMessage")
    public ResponseEntity<Message> createMessage(@RequestBody Message message) {
		try {
			message=messageService.createMessage(message);
			return new ResponseEntity<>(message, HttpStatus.CREATED);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
	
	@PutMapping("replyAndMarkRead/{id}")
	public String replyAndMarkRead(@PathVariable Integer id, @RequestBody(required = false) String reply) {
	    return messageService.replyAndMarkRead(id, reply);
	}



}
