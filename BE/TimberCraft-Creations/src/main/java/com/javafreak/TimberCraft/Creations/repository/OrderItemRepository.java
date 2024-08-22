package com.javafreak.TimberCraft.Creations.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javafreak.TimberCraft.Creations.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}