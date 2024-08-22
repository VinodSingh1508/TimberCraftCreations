package com.javafreak.TimberCraft.Creations.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.javafreak.TimberCraft.Creations.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	@Query("SELECT p FROM Product p WHERE p.name ILIKE %:searchString% OR p.description ILIKE %:searchString%")
	List<Product> findProductByNameOrDescription(@Param("searchString") String searchString);
	
	@Query(value = "SELECT * FROM products ORDER BY RANDOM() LIMIT 3", nativeQuery = true)
    List<Product> findTop3Products();
	
	@Query("SELECT DISTINCT p.name FROM Product p")
	 List<String> findDistinctProductNames();
	
	Product findByName(String name);
}
