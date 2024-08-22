package com.javafreak.TimberCraft.Creations.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.javafreak.TimberCraft.Creations.entity.Subscription;
import com.javafreak.TimberCraft.Creations.service.SubscriptionService;

import java.util.Optional;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<String> createSubscription(@RequestBody Subscription subscription) {
        boolean result = subscriptionService.createSubscription(subscription);
        if (!result) {
            return ResponseEntity.ok("You have already subscribed to our news letters.");
        } else {
            return ResponseEntity.ok("Congratulations! You are now subscribed to our news letters.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscription(@PathVariable Long id) {
        Optional<Subscription> subscription = subscriptionService.getSubscription(id);
        return subscription.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(@PathVariable Long id, @RequestBody Subscription subscription) {
        subscription.setId(id);
        Subscription updatedSubscription = subscriptionService.updateSubscription(subscription);
        return ResponseEntity.ok(updatedSubscription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getCount")
    public long getCount() {
        return subscriptionService.getCount();
    }
    
}
