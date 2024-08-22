package com.javafreak.TimberCraft.Creations.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javafreak.TimberCraft.Creations.entity.Coupon;
import com.javafreak.TimberCraft.Creations.entity.User;
import com.javafreak.TimberCraft.Creations.repository.CouponRepository;
import com.javafreak.TimberCraft.Creations.repository.UserRepository;

@Service
public class CouponService {

	@Autowired
	private CouponRepository couponRepository;

	@Autowired
	private UserRepository userRepository;

	public List<Coupon> getAllCoupons() {
		List<Coupon> coupons = couponRepository.findAll();
		for (Coupon c : coupons) {
			if (!c.getForUsers().contains("*")) {
				List<String> emailList=new ArrayList<>();
				for (String usrId : c.getForUsers().split(",")) {
					if (null != usrId && usrId.trim().length() != 0) {
						Optional<User> userData = userRepository.findById(Long.parseLong(usrId.trim()));

						if (userData.isPresent()) {
							User dbUser = userData.get();
							emailList.add(dbUser.getEmail().trim());
						}
					}
				}
				c.setForUsers(String.join(",", emailList));
			}
		}
		return coupons;
	}

	public Optional<Coupon> getCouponById(String couponId) {
		return couponRepository.findById(couponId);
	}

	public Coupon createCoupon(Coupon coupon) {
		return couponRepository.save(coupon);
	}

	public Coupon updateCoupon(String couponId, Coupon couponDetails) {
		Coupon coupon = couponRepository.findById(couponId).orElseThrow(() -> new RuntimeException("Coupon not found"));

		coupon.setValidFrom(couponDetails.getValidFrom());
		coupon.setValidTill(couponDetails.getValidTill());
		coupon.setFlatPercent(couponDetails.getFlatPercent());
		coupon.setAmount(couponDetails.getAmount());
		coupon.setMinCartValue(couponDetails.getMinCartValue());
		coupon.setForUsers(couponDetails.getForUsers());

		return couponRepository.save(coupon);
	}

	public void deleteCoupon(String couponId) {
		Coupon coupon = couponRepository.findById(couponId).orElseThrow(() -> new RuntimeException("Coupon not found"));

		couponRepository.delete(coupon);
	}

	public String validateCoupon(String couponId, String userId, BigDecimal cartValue) {
		// Step 1: Check if the coupon exists and is valid for the user
		Optional<Coupon> optionalCoupon = couponRepository.findById(couponId);
		if (optionalCoupon.isEmpty()) {
			return "Coupon (" + couponId + ") is not valid";
		}

		Coupon coupon = optionalCoupon.get();

		// Step 2: Check if the coupon is valid for the given user
		String forUsers = coupon.getForUsers();
		if (!(forUsers.equals("*") || Arrays.asList(forUsers.split(",")).contains(userId))) {
			return "Coupon (" + couponId + ") is not valid for you";
		}

		// Step 3: Check if the coupon is active (valid from and valid till)
		Timestamp now = Timestamp.valueOf(LocalDateTime.now());
		if (!(now.after(coupon.getValidFrom()) && now.before(coupon.getValidTill()))) {
			return "Coupon (" + couponId + ") is not active";
		}

		// Step 4: Check if the cart value is sufficient
		if (cartValue.compareTo(coupon.getMinCartValue()) < 0) {
			return "Insufficient cart value for this coupon (" + couponId + "). Add items worth "
					+ coupon.getMinCartValue().subtract(cartValue).doubleValue() + " more to use the coupon";
		}

		// Step 5: Return the flatPercent and amount if all checks pass
		return coupon.getFlatPercent() + "~" + coupon.getAmount().toString();
	}

}
