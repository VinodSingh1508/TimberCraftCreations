package com.javafreak.TimberCraft.Creations.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    SubscriptionService subscriptionService;

    public void sendEmail(String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(subscriptionService.findAllEmails().toArray(new String[0]));
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("vinodsingh1508@gmail.com");

        mailSender.send(message);
    }
    
    public void sendEmailToUser(String userEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("vinodsingh1508@gmail.com");

        mailSender.send(message);
    }
}
