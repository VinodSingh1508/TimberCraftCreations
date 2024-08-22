package com.javafreak.TimberCraft.Creations.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javafreak.TimberCraft.Creations.entity.Message;


public interface MessageRepository extends JpaRepository<Message, Integer> {
	List<Message> findByIsReadFalseOrderByCreatedAtAsc();
}