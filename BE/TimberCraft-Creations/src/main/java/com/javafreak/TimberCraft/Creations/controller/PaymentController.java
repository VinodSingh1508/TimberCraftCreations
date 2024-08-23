package com.javafreak.TimberCraft.Creations.controller;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@RestController
@RequestMapping("/payment")
public class PaymentController {

	@Value("${rzp_key_id}")
	private String razorpayKeyId;

	@Value("${rzp_key_secret}")
	private String razorpayKeySecret;

	@Value("${rzp_currency}")
	private String currency;

	@PostMapping("/createOrder")
	public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Integer> requestBody) {
		try {
			RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
			JSONObject orderRequest = new JSONObject();
			orderRequest.put("amount", requestBody.get("amount")); // amount in the smallest currency unit
			orderRequest.put("currency", currency);
			orderRequest.put("receipt", "order_rcptid_11");

			Order order = razorpay.orders.create(orderRequest);
			Map<String, Object> response = new HashMap<>();
	        response.put("id", order.get("id"));
	        response.put("amount", order.get("amount"));
	        response.put("currency", order.get("currency"));
	        response.put("status", order.get("status"));

	        return ResponseEntity.ok(response);
		} catch (RazorpayException e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/verify")
	public ResponseEntity<Map<String, String>> verifyPayment(@RequestBody Map<String, String> data) {
		String razorpayOrderId = data.get("razorpay_order_id");
		String razorpayPaymentId = data.get("razorpay_payment_id");
		String razorpaySignature = data.get("razorpay_signature");
		Map<String, String> response = new HashMap<>();

		try {
			JSONObject options = new JSONObject(data);
			boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
			if (isValid) {				
		        response.put("isValid", "valid");
		        response.put("razorpayOrderId", razorpayOrderId);
		        response.put("razorpayPaymentId", razorpayPaymentId);
		        response.put("razorpaySignature", razorpaySignature);
			} else {
		        response.put("isValid", "invalid");
		        response.put("razorpayOrderId", razorpayOrderId);
		        response.put("razorpayPaymentId", razorpayPaymentId);
		        response.put("razorpaySignature", razorpaySignature);
			}
		} catch (RazorpayException e) {
			response.put("isValid", "error");
			response.put("message", e.getMessage());			
		}
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/getKey")
    public ResponseEntity<String> getKey() {       
        return ResponseEntity.ok(razorpayKeyId);
    }
}