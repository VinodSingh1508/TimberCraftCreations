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

import com.javafreak.TimberCraft.Creations.dto.ProductDTO;
import com.javafreak.TimberCraft.Creations.entity.Product;
import com.javafreak.TimberCraft.Creations.service.ProductService;

@RestController
@RequestMapping("/product")
public class ProductController {

	@Autowired
	ProductService productService;
	
	
	@PostMapping("/createProduct")
	public ResponseEntity<Product> createProduct(@RequestBody Product product) {		
		try {
			product=productService.createProduct(product);
			return new ResponseEntity<>(product, HttpStatus.CREATED);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/updateProduct/{id}")
	public ResponseEntity<Product> updateProduct(@PathVariable("id") long id, @RequestBody Product product) {
		return productService.updateProduct(id, product);			
	}
	
	@DeleteMapping("/deleteProduct/{id}")
	public ResponseEntity<HttpStatus> deleteProduct(@PathVariable("id") long id) {
		try {
			productService.deleteProduct(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@GetMapping("/searchProduct")
    public ResponseEntity<List<Product>> searchProduct(@RequestParam String searchString) {
        List<Product> product = productService.findProductByNameOrDescription(searchString);
        if (product == null || product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
	
	@GetMapping("/getAll")
    public ResponseEntity<List<Product>> getAllProduct() {
        List<Product> product = productService.getAllProducts();
        if (product == null || product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
	
	@GetMapping("/getTop3Products")
    public ResponseEntity<List<Product>> getTop3Products() {
        List<Product> product = productService.getTop3Products();
        if (product == null || product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
	
	@GetMapping("/names")
    public List<String> getDistinctProductNames() {
        return productService.getDistinctProductNames();
    }
	
	@PostMapping("/upload")
	public ResponseEntity<Product> uploadFile(@RequestBody ProductDTO productDTO) {
        return productService.uploadProduct(productDTO);
    }
}
