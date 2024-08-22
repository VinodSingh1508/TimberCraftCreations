package com.javafreak.TimberCraft.Creations.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javafreak.TimberCraft.Creations.entity.Coupon;

public interface CouponRepository extends JpaRepository<Coupon, String> {
}
