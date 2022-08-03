import Product from "@components/Products/Product";
import { formatId } from "@utils/formatId";
import styles from "@styles/products/Products.module.css";

const Products = ({ products }) => {
  return (
    <div className={styles.Products}>
      {products.map((product) => (
        <Product key={formatId(product.id)} product={product} />
      ))}
    </div>
  );
};

export default Products;
