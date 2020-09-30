package ecommerce.bootstrap;


import ecommerce.dao.ProductCategoryRepository;
import ecommerce.dao.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class first_data implements CommandLineRunner {

    public first_data(ProductCategoryRepository productCategoryRepository, ProductRepository productRepository) {
    }

    @Override
    public void run(String... args) throws Exception {
//        ProductCategory productCategory = new ProductCategory();
//        productCategory.setCategoryName("Super");
//        productCategoryRepository.save(productCategory);
    }
}
