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
    findCurrentProduct,
    changeProductVariant,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useProduct();

  return (
    <main>
      <section className={styles.Products}>
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
            <span>{findCurrentProduct(product.id)?.quantity}</span>

            {/* Render the minus button if product quantity is more than 1 */}
            {findCurrentProduct(product.id)?.quantity > 1 && (
              <AiOutlineMinus
                onClick={() => decreaseProductQuantity(product)}
              />
            )}

            {/* Render cart item price or initial price */}
            <p>
              AUD $
              {findCurrentProduct(product.id)?.price ||
                parseFloat(product.variants[0].price)}
            </p>

            <button onClick={() => addVariantToCart(product.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </section>
    </main>
  );
};

export const getStaticProps = async () => {
  // Fetch the products
  const data = await shopifyClient.product.fetchAll();

  // Parse the data
  const products = JSON.parse(JSON.stringify(data));

  return {
    props: {
      products,
    },
  };
};

export default ProductsPage;
