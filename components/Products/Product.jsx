import Link from "next/link";
import Image from "next/image";
import { useProduct } from "@contexts/ProductContext";
import { formatId } from "@utils/formatId";
import Controller from "./Controller";
import styles from "@styles/products/Product.module.css";

const Product = ({ product }) => {
  const { findCurrentProduct } = useProduct();

  // Current product
  const currentProduct = findCurrentProduct(product.id);

  // Quantity
  const quantity = currentProduct?.quantity;

  // Price
  const price = currentProduct?.price;

  return (
    <div className={styles.Product}>
      <div className={styles.Image}>
        <Link href={`/products/${formatId(product.id)}`}>
          <a>
            <Image
              src={product.images[0].src}
              width={16}
              height={9}
              layout="responsive"
            />
          </a>
        </Link>
      </div>

      {/* Content and Controller*/}
      <div className={styles.Content}>
        <div className={styles.AboutProduct}>
          <Link href={`/products/${formatId(product.id)}`}>
            <a>
              <p>{product.title}</p>
              <p>
                AUD $
                {quantity > 0 ? price : parseFloat(product.variants[0].price)}
              </p>
            </a>
          </Link>
        </div>

        <Controller product={product} />
      </div>
    </div>
  );
};

export default Product;
