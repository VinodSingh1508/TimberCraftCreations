package com.javafreak.TimberCraft.Creations.repository.dao;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class OrderDAO {
	
	@PersistenceContext
    private EntityManager entityManager;

	

}
