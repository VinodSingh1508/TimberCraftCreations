package com.javafreak.TimberCraft.Creations.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javafreak.TimberCraft.Creations.entity.Order;
import com.javafreak.TimberCraft.Creations.service.OrderService;

@RestController
@RequestMapping("/order")
public class OrderController {

	@Autowired
	OrderService orderService;

	@PostMapping("/createOrder/{userId}")
	public ResponseEntity<Order> createOrder(@PathVariable long userId, @RequestBody Order order) {
		try {
			order = orderService.createOrder(order, userId);
			return new ResponseEntity<>(order, HttpStatus.CREATED);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/updateOrder/{id}")
	public ResponseEntity<Order> updateOrder(@PathVariable("id") long id, @RequestParam("status") String status) {
		return orderService.updateOrder(id, status);
	}

	@DeleteMapping("/deleteOrder/{id}")
	public ResponseEntity<HttpStatus> deleteOrder(@PathVariable("id") long id) {
		try {
			orderService.deleteOrder(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@GetMapping("/searchOrderByStatus")
	public ResponseEntity<List<Order>> searchOrderByStatus(@RequestParam String status) {
		List<Order> order = orderService.searchOrderByStatus(status);
		if (order == null || order.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(order);
	}
	
	@GetMapping("/getAllStatuses")
	public List<String> getAllStatuses() {
		return orderService.getAllStatuses();		
	}
	
	@GetMapping("/getOrderByUserId/{userId}")
	public ResponseEntity<List<Order>> getOrderByUserId(@PathVariable("userId") long userId) {
		List<Order> order = orderService.getOrderByUserId(userId);
		if (order == null || order.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(order);
	}
}
