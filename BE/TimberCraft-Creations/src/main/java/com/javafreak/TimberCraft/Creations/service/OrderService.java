package com.javafreak.TimberCraft.Creations.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.javafreak.TimberCraft.Creations.entity.Order;
import com.javafreak.TimberCraft.Creations.entity.OrderAddress;
import com.javafreak.TimberCraft.Creations.entity.OrderItem;
import com.javafreak.TimberCraft.Creations.entity.Product;
import com.javafreak.TimberCraft.Creations.entity.User;
import com.javafreak.TimberCraft.Creations.repository.OrderAddressRepository;
import com.javafreak.TimberCraft.Creations.repository.OrderRepository;
import com.javafreak.TimberCraft.Creations.repository.ProductRepository;
import com.javafreak.TimberCraft.Creations.repository.UserRepository;
import com.javafreak.TimberCraft.Creations.repository.dao.OrderDAO;

@Service
public class OrderService {
	@Autowired
	OrderDAO orderDAO;

	@Autowired
	OrderRepository orderRepository;

	@Autowired
	ProductRepository productRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	OrderAddressRepository orderAddressRepository;

	public Order createOrder(Order order, long userId) {
		Optional<User> user = userRepository.findById(userId);
		if (user.isPresent()) {
			order.setUser(user.get());
		} else {
			throw new RuntimeException("User not found with id " + userId);
		}
		order.setOrderDate(LocalDateTime.now());
		order.setStatus("Pending Confirmation");
		order.setShippingDate(null);
		List<OrderItem> reqOi = order.getOrderItems();
		for (OrderItem oi : reqOi) {
			Optional<Product> productData = productRepository.findById(oi.getProduct().getProductId());
			if (productData.isPresent()) {
				Product dbProduct = productData.get();
				oi.setPrice(dbProduct.getPrice());
				oi.setCustomization(oi.getCustomization());
				oi.setQuantity(oi.getQuantity());
				oi.setOrder(order);
			}
		}
		OrderAddress orderAddress = orderAddressRepository.save(order.getOrderAddress());
		order.setOrderAddress(orderAddress);
		order.setOrderItems(reqOi);
		return orderRepository.save(order);
	}

	public ResponseEntity<Order> updateOrder(long id, String status) {
		try {
			Optional<Order> orderData = orderRepository.findById(id);

			if (orderData.isPresent()) {
				Order dbOrder = orderData.get();
				if(status.equalsIgnoreCase("Shipped"))
					dbOrder.setShippingDate(LocalDateTime.now());
				dbOrder.setStatus(status);
				return new ResponseEntity<>(orderRepository.save(dbOrder), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	public void deleteOrder(long id) {
		orderRepository.deleteById(id);
	}

	public List<Order> searchOrderByStatus(String status) {
	    List<Order> orders;
	    if (status != null && !status.isEmpty()) {
	        orders = orderRepository.findByStatus(status).stream()
	                .sorted(Comparator.comparing(Order::getOrderDate))
	                .collect(Collectors.toList());
	    } else {
	        orders = orderRepository.findAllOrderedByDate();
	    }
	    orders.forEach(ord -> {
	        ord.getOrderItems().forEach(oi -> oi.setOrder(null));
	    });
	    return orders;
	}

	public List<Order> getOrderByUserId(long userId) {
		List<Order> orders = orderRepository.findByUserUserId(userId);
		orders.forEach(ord -> {
			ord.getOrderItems().forEach(oi -> oi.setOrder(null));
			ord.setUser(null);
		});
		return orders;
	}

	public List<String> getAllStatuses() {
		return Arrays.asList("Pending Confirmation", "Confirmed", "In Construction", "Shipped", "Completed", "Cancelled", "On Hold");		
	}
}
