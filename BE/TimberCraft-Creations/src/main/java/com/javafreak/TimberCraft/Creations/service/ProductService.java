package com.javafreak.TimberCraft.Creations.service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.javafreak.TimberCraft.Creations.dto.ProductDTO;
import com.javafreak.TimberCraft.Creations.entity.Product;
import com.javafreak.TimberCraft.Creations.repository.ProductRepository;
import com.javafreak.TimberCraft.Creations.repository.dao.ProductDAO;

import jakarta.transaction.Transactional;

@Service
public class ProductService {
	@Autowired
	ProductDAO productDAO;

	@Autowired
	ProductRepository productRepository;

	@Value("${product.directory}")
	private String productDirectory;

	public Product createProduct(Product product) {
		product.setCreateAt(LocalDateTime.now());
		product.setUpdatedAt(LocalDateTime.now());
		return productRepository.save(product);
	}

	public ResponseEntity<Product> updateProduct(long id, Product product) {
		try {
			Optional<Product> productData = productRepository.findById(id);

			if (productData.isPresent()) {
				Product dbProduct = productData.get();
				dbProduct.setName(product.getName());
				dbProduct.setDescription(product.getDescription());
				dbProduct.setImageUrls(product.getImageUrls());
				dbProduct.setDisplayImage(product.getDisplayImage());
				dbProduct.setCategory(product.getCategory());
				dbProduct.setSubCategory(product.getSubCategory());
				dbProduct.setPrice(product.getPrice());
				dbProduct.setUpdatedAt(LocalDateTime.now());
				return new ResponseEntity<>(productRepository.save(dbProduct), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	public void deleteProduct(long id) {
		productRepository.deleteById(id);
	}

	public List<Product> findProductByNameOrDescription(String searchString) {
		return productRepository.findProductByNameOrDescription(searchString);
	}

	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	public List<Product> getTop3Products() {
		return productRepository.findTop3Products();
	}

	public List<String> getDistinctProductNames() {
		return productRepository.findDistinctProductNames();
	}

	@Transactional
	public ResponseEntity<Product> uploadProduct(ProductDTO productDTO) {
		try {
			if (productDTO.getAction().equalsIgnoreCase("INSERT")) {
				Product product = new Product();
				product.setCreateAt(LocalDateTime.now());
				product.setUpdatedAt(LocalDateTime.now());
				product.setName(productDTO.getProduct());
				product.setCategory(productDTO.getCategory());
				product.setSubCategory(productDTO.getSubCategory());
				product.setDescription(productDTO.getDescription());
				product.setPrice(productDTO.getPrice());

				Product dbProduct = productRepository.save(product);

				createProductImages(productDTO, dbProduct);

				dbProduct = productRepository.save(dbProduct);
				return new ResponseEntity<>(productRepository.save(dbProduct), HttpStatus.OK);
			} else {
				Product dbProduct=productRepository.findByName(productDTO.getProduct());
				deleteProductImages(dbProduct);
				createProductImages(productDTO, dbProduct);
				
				dbProduct.setUpdatedAt(LocalDateTime.now());
				dbProduct.setCategory(productDTO.getCategory());
				dbProduct.setSubCategory(productDTO.getSubCategory());
				dbProduct.setDescription(productDTO.getDescription());
				dbProduct.setPrice(productDTO.getPrice());
				dbProduct = productRepository.save(dbProduct);
				return new ResponseEntity<>(productRepository.save(dbProduct), HttpStatus.OK);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private void deleteProductImages(Product dbProduct) {
		Path uploadPath = Paths.get(productDirectory + dbProduct.getProductId());

		try (DirectoryStream<Path> stream = Files.newDirectoryStream(uploadPath)) {
		    for (Path file : stream) {
		        if (Files.isRegularFile(file)) {
		            Files.delete(file);
		            System.out.println(file.getFileName() + " deleted successfully.");
		        }
		    }
		} catch (Exception e) {
		    e.printStackTrace();
		}
	}

	private void createProductImages(ProductDTO productDTO, Product dbProduct)
			throws IOException, FileNotFoundException {
		Path uploadPath = Paths.get(productDirectory + dbProduct.getProductId());
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);
		}

		String[] imageUrls = new String[productDTO.getImages().size()];
		int i = 1;
		for (String base64Image : productDTO.getImages()) {
			byte[] imageBytes = Base64.getDecoder().decode(base64Image);
			Path imagePath = uploadPath.resolve(dbProduct.getProductId() + "-" + i + ".jpg");
			try (FileOutputStream fos = new FileOutputStream(imagePath.toFile())) {
				fos.write(imageBytes);
			}
			imageUrls[i - 1] = dbProduct.getProductId() + "/" + dbProduct.getProductId() + "-" + i + ".jpg";
			i++;
		}
		dbProduct.setImageUrls(imageUrls);

		if (productDTO.getThumbnail() != null && !productDTO.getThumbnail().isEmpty()) {
			byte[] thumbnailBytes = Base64.getDecoder().decode(productDTO.getThumbnail());
			Path thumbnailPath = uploadPath.resolve(dbProduct.getProductId() + "-" + i + ".jpg");
			try (FileOutputStream fos = new FileOutputStream(thumbnailPath.toFile())) {
				fos.write(thumbnailBytes);
			}
			dbProduct.setDisplayImage(
					dbProduct.getProductId() + "/" + dbProduct.getProductId() + "-" + i + ".jpg");
		}
	}

}
