package com.javafreak.TimberCraft.Creations.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.javafreak.TimberCraft.Creations.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findByStatus(String status);

    @Query("FROM Order o WHERE o.user.userId = :userId ORDER BY o.orderDate")
    List<Order> findByUserUserId(@Param("userId") Long userId);

    @Query("FROM Order o ORDER BY o.orderDate")
    List<Order> findAllOrderedByDate();

}
