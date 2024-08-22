package com.javafreak.TimberCraft.Creations.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.javafreak.TimberCraft.Creations.entity.Coupon;
import com.javafreak.TimberCraft.Creations.service.CouponService;
import com.javafreak.TimberCraft.Creations.service.UserService;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/coupons")
public class CouponController {

	@Autowired
	private CouponService couponService;

	@Autowired
	private UserService userService;

	@GetMapping
	public List<Coupon> getAllCoupons() {
		return couponService.getAllCoupons();
	}

	@GetMapping("/{couponId}")
	public ResponseEntity<Coupon> getCouponById(@PathVariable String couponId) {
		Optional<Coupon> coupon = couponService.getCouponById(couponId);
		return coupon.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public Coupon createCoupon(@RequestBody Coupon coupon) {
		return couponService.createCoupon(coupon);
	}

	@PutMapping("/{couponId}")
	public ResponseEntity<Coupon> updateCoupon(@PathVariable String couponId, @RequestBody Coupon couponDetails) {
		return ResponseEntity.ok(couponService.updateCoupon(couponId, couponDetails));
	}

	@DeleteMapping("/{couponId}")
	public ResponseEntity<Void> deleteCoupon(@PathVariable String couponId) {
		couponService.deleteCoupon(couponId);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/validate")
	public ResponseEntity<Map<String, String>> validateCoupon(@RequestBody Map<String, Object> request) {
		String couponId = (String) request.get("couponId");
		String userId = request.get("userId") + "";
		BigDecimal cartValue = new BigDecimal(request.get("cartValue").toString());
		String validationResponse = couponService.validateCoupon(couponId, userId, cartValue);

		Map<String, String> response = new HashMap<>();
		if (validationResponse.contains("~")) {
			response.put("status", "valid");
			response.put("details", validationResponse);
		} else {
			response.put("status", "invalid");
			response.put("error", validationResponse);
		}

		return ResponseEntity.ok(response);
	}

	@PutMapping("/updateCoupon")
	public ResponseEntity<Coupon> insertOrUpdate(@RequestBody Map<String, String> input) {
		
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

		Coupon coupon = new Coupon();
		coupon.setCouponId(input.get("couponId"));
		coupon.setFlatPercent(input.get("flatPercent"));
		coupon.setAmount(new BigDecimal(input.get("amount")));
		coupon.setMinCartValue(new BigDecimal(input.get("minCartValue")));

		try {
			Date validFrom = dateFormat.parse(input.get("validFrom"));
			coupon.setValidFrom(new Timestamp(validFrom.getTime()));

			Date validTill = dateFormat.parse(input.get("validTill"));
			coupon.setValidTill(new Timestamp(validTill.getTime()));
		} catch (ParseException e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

		if (input.get("forUsers").contains("*")) {
			coupon.setForUsers("*");
		} else {
			String[] userArr = input.get("forUsers").split(",");

			Set<String> userIds = Arrays.stream(userArr).map(String::trim).map(userService::findUserByEmailOrPhone)
					.filter(Objects::nonNull).map(user -> String.valueOf(user.getUserId()))
					.collect(Collectors.toSet());

			coupon.setForUsers(String.join(",", userIds));
		}

		coupon=couponService.createCoupon(coupon);

		return ResponseEntity.ok(coupon);
	}

}
