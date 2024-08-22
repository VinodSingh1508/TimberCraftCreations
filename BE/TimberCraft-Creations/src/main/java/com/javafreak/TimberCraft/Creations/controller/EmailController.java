package com.javafreak.TimberCraft.Creations.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.javafreak.TimberCraft.Creations.service.EmailService;

@RestController
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-email")
    public String sendEmail(@RequestBody Map<String, String> input) {
    	if(input.containsKey("userEmail")) {
    		emailService.sendEmailToUser(input.get("userEmail"), input.get("subject"), input.get("body"));
    	}else {
    		emailService.sendEmail(input.get("subject"), input.get("body"));
    	}
        return "Email sent successfully!";
    }
}
