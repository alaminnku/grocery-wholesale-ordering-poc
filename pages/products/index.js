import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { shopifyClient } from "@utils/shopify";
import { formatId } from "@utils/formatId";
import { useCart } from "@contexts/CartContext";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import styles from "@styles/products/products.module.css";

const ProductsPage = ({ products }) => {
  // Hooks
  const [variantId, setVariantId] = useState("");
  const { cartItems, increaseQuantity, decreaseQuantity, addToCart } =
    useCart();

  console.log(cartItems);

  // Handle quantity change
  const handleQuantity = (productId) => {
    let quantity;

    if (cartItems.length > 0) {
      return (quantity = cartItems.find(
        (item) => item.id === productId
      )?.quantity);
    }

    return quantity;
  };

  // Handle different price
  const handlePrice = (product) => {
    let price;

    // Initial price
    const initialPrice = parseFloat(product.variants[0].price);

    // Item quantity
    const itemQuantity = handleQuantity(formatId(product.id));

    // Variant price
    const variantPrice = parseFloat(
      product.variants.find((variant) => formatId(variant.id) === variantId)
        ?.price
    );

    // Change price based on logic
    if (!itemQuantity && !variantPrice) {
      return (price = initialPrice);
    } else if (itemQuantity && !variantPrice) {
      return (price = itemQuantity * initialPrice);
    } else if (!itemQuantity && variantPrice) {
      return (price = variantPrice);
    } else if (itemQuantity && variantPrice) {
      return (price = itemQuantity * variantPrice);
    }

    return price;
  };

  return (
    <div className={styles.Products}>
      {products.map((product) => (
        <div key={formatId(product.id)} className={styles.Product}>
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
          <select onChange={(e) => setVariantId(e.target.value)}>
            {product.variants.map((variant) => (
              <option key={formatId(variant.id)} value={formatId(variant.id)}>
                {variant.title}
              </option>
            ))}
          </select>

          <AiOutlinePlus onClick={() => increaseQuantity(product, variantId)} />

          <span>{handleQuantity(formatId(product.id))}</span>

          {/* Render the minus button if product quantity is more than 1 */}
          {handleQuantity(formatId(product.id)) > 1 && (
            <AiOutlineMinus onClick={() => decreaseQuantity(product)} />
          )}

          <p>AUD $ {handlePrice(product)}</p>

          <button onClick={() => addToCart(product)}>Add to Cart</button>
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
