package com.javafreak.TimberCraft.Creations.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.javafreak.TimberCraft.Creations.entity.User;
import com.javafreak.TimberCraft.Creations.repository.UserRepository;
import com.javafreak.TimberCraft.Creations.repository.dao.UserDAO;

@Service
public class UserService {

	@Autowired
	UserDAO userDAO;

	@Autowired
	UserRepository userRepository;

	public User createUser(User user) {
		return userRepository.save(user);
	}

	public ResponseEntity<User> updateUser(long id, User user) {
		try {
			Optional<User> userData = userRepository.findById(id);

			if (userData.isPresent()) {
				User dbUser = userData.get();
				// dbUser.setAdmin(user.isAdmin());
				dbUser.setEmail(user.getEmail());
				dbUser.setPassword(user.getPassword());
				dbUser.setPhone(user.getPhone());
				dbUser.setUserName(user.getUserName());
				// dbUser.setUserRatings(user.getUserRatings());
				return new ResponseEntity<>(userRepository.save(dbUser), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	public void deleteUser(long id) {
		userRepository.deleteById(id);
	}

	public User findUserByEmailOrPhone(String searchString) {
		return userRepository.findUserByEmailOrPhone(searchString);
	}

	public User findUserByEmailOrPhoneAndPassword(String searchString, String password) {
		return userRepository.findUserByEmailOrPhoneAndPassword(searchString, password);
	}

	public ResponseEntity<User> updateUserCart(long id, String cart) {
		try {
			Optional<User> userData = userRepository.findById(id);

			if (userData.isPresent()) {
				User dbUser = userData.get();
				dbUser.setCart(cart);
				return new ResponseEntity<>(userRepository.save(dbUser), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
