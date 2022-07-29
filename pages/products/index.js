import Link from "next/link";
import Image from "next/image";
import { useCart } from "@contexts/CartContext";
import { useProduct } from "@contexts/ProductContext";
import { shopifyClient } from "@utils/shopify";
import { formatId } from "@utils/formatId";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import styles from "@styles/products/products.module.css";

const ProductsPage = ({ products }) => {
  // Hooks
  const { addVariantToCart } = useCart();
  const {
    currentVariant,
    changeVariant,
    increaseVariantQuantity,
    decreaseVariantQuantity,
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
          <select onChange={(e) => changeVariant(product, e.target.value)}>
            {product.variants.map((variant) => (
              <option key={formatId(variant.id)} value={formatId(variant.id)}>
                {variant.title}
              </option>
            ))}
          </select>

          {/* Increase quantity button */}
          <AiOutlinePlus onClick={() => increaseVariantQuantity(product)} />

          {/* Quantity */}
          <span>{currentVariant(product.id)?.quantity}</span>

          {/* Render the minus button if product quantity is more than 1 */}
          {currentVariant(product.id)?.quantity > 1 && (
            <AiOutlineMinus onClick={() => decreaseVariantQuantity(product)} />
          )}

          {/* Render cart item price or initial price */}
          <p>
            AUD $
            {currentVariant(product.id)?.price ||
              parseFloat(product.variants[0].price)}
          </p>

          <button onClick={() => addVariantToCart(product.id)}>
            Add to Cart
          </button>
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
