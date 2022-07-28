import Link from "next/link";
import Image from "next/image";
import { shopifyClient } from "@utils/shopify";
import { formatId } from "@utils/formatId";
import { useCart } from "@contexts/CartContext";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import styles from "@styles/products/products.module.css";
import { useProduct } from "@contexts/ProductContext";

const ProductsPage = ({ products }) => {
  // Hooks
  const { addItemToCart } = useCart();
  const {
    currentProduct,
    changeProductVariant,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useProduct();

  return (
    <div className={styles.Products}>
      {products.map((product) => (
        <div key={formatId(product.id)} className={styles.Product}>
          {/* Product title and image */}
          <Link href={`/products/${formatId(product.id)}`}>
            <a>
              <h3>{product.title}</h3>
              <Image
                src={product.images[0].src}
                height={9}
                width={16}
                layout="responsive"
              />
            </a>
          </Link>

          {/* Product variant options */}
          <select
            onChange={(e) => changeProductVariant(product, e.target.value)}
          >
            {product.variants.map((variant) => (
              <option key={formatId(variant.id)} value={formatId(variant.id)}>
                {variant.title}
              </option>
            ))}
          </select>

          {/* Increase quantity button */}
          <AiOutlinePlus onClick={() => increaseProductQuantity(product)} />

          {/* Quantity */}
          <span>{currentProduct(product.id)?.quantity}</span>

          {/* Render the minus button if product quantity is more than 1 */}
          {currentProduct(product.id)?.quantity > 1 && (
            <AiOutlineMinus onClick={() => decreaseProductQuantity(product)} />
          )}

          {/* Render cart item price or initial price */}
          <p>
            AUD $
            {currentProduct(product.id)?.price ||
              parseFloat(product.variants[0].price)}
          </p>

          <button onClick={() => addItemToCart(product.id)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const products = await shopifyClient.product.fetchAll();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

export default ProductsPage;
