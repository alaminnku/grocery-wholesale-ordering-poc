import Product from "@components/Products/Product";
import styles from "@styles/products/Products.module.css";

const Products = ({ products }) => {
  return (
    <div className={styles.Products}>
      {products.map((product) => (
        <Product product={product} />
      ))}
    </div>
  );
};

export default Products;
