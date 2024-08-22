package com.javafreak.TimberCraft.Creations.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javafreak.TimberCraft.Creations.entity.OrderAddress;

public interface OrderAddressRepository extends JpaRepository<OrderAddress, Long> {
}
