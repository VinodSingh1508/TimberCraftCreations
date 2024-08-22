package com.javafreak.TimberCraft.Creations.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.javafreak.TimberCraft.Creations.entity.Subscription;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByEmail(String email);
    
    @Query("SELECT s.email FROM Subscription s")
    List<String> findAllEmails();
}
