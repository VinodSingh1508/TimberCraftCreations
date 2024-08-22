package com.javafreak.TimberCraft.Creations.controller;

import java.util.Map;

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

import com.javafreak.TimberCraft.Creations.entity.User;
import com.javafreak.TimberCraft.Creations.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	UserService userService;	
	
	@PostMapping("/createUser")
	public ResponseEntity<User> createUser(@RequestBody User user) {		
		try {
			user=userService.createUser(user);
			return new ResponseEntity<>(user, HttpStatus.CREATED);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/updateUser/{id}")
	public ResponseEntity<User> updateUser(@PathVariable("id") long id, @RequestBody User user) {
		return userService.updateUser(id, user);
	}
	
	@DeleteMapping("/deleteUser/{id}")
	public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") long id) {
		try {
			userService.deleteUser(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@GetMapping("/searchUser")
    public ResponseEntity<User> searchUser(@RequestParam String searchString) {
        User user = userService.findUserByEmailOrPhone(searchString);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
	

	
	@PostMapping("/validateUser")
    public ResponseEntity<User> validateUser(@RequestBody Map<String, String> payload) {
		System.out.println(payload.get("searchString"));
		System.out.println(payload.get("password"));
        User user = userService.findUserByEmailOrPhoneAndPassword(payload.get("searchString"), payload.get("password"));
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
	
	
	@PutMapping("/updateUserCart/{id}")
	public ResponseEntity<User> updateUserCart(@PathVariable("id") long id, @RequestBody Map<String, String> payload) {
		System.out.println(payload.get("test"));
		return userService.updateUserCart(id, payload.get("cart"));			
	}
}
