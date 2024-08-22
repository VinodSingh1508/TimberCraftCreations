package com.javafreak.TimberCraft.Creations.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.javafreak.TimberCraft.Creations.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	@Query("SELECT u FROM User u WHERE u.email = :searchString OR u.phone = :searchString")
    User findUserByEmailOrPhone(@Param("searchString") String searchString);
	
	@Query("SELECT u FROM User u WHERE (u.email = :searchString OR u.phone = :searchString) AND u.password = :password")
    User findUserByEmailOrPhoneAndPassword(@Param("searchString") String searchString, @Param("password") String password);
}
