package com.javafreak.TimberCraft.Creations.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javafreak.TimberCraft.Creations.entity.Subscription;
import com.javafreak.TimberCraft.Creations.repository.SubscriptionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public boolean createSubscription(Subscription subscription) {
        Optional<Subscription> existingSubscription = subscriptionRepository.findByEmail(subscription.getEmail());
        if (existingSubscription.isPresent()) {
            return false;
        } else {
            subscriptionRepository.save(subscription);
            return true;
        }
    }

    public Optional<Subscription> getSubscription(Long id) {
        return subscriptionRepository.findById(id);
    }

    public Subscription updateSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    public void deleteSubscription(Long id) {
        subscriptionRepository.deleteById(id);
    }

	public long getCount() {
        return subscriptionRepository.count();
    }
	
	public List<String> findAllEmails() {
        return subscriptionRepository.findAllEmails();
    }
}
