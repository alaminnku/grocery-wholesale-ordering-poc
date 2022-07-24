import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@contexts/CartContext";
import { formatId } from "@utils/formatId";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { shopifyClient } from "@utils/shopify";

const ProductDetailsPage = ({ product }) => {
  // Hooks
  const router = useRouter();
  const [itemVariant, setItemVariant] = useState("");
  const { cartItems, increaseQuantity, decreaseQuantity } = useCart();

  // Find the item with the id and get the quantity
  const quantity = (id) => cartItems.find((item) => item.id === id)?.quantity;

  // Image sources
  const imageSources = product.images.map((image) => image.src);

  // Handle checkout
  const handleCheckout = async () => {
    const checkout = await shopifyClient.checkout.create();
    const checkoutId = checkout.id;

    // Line items
    const lineItemsToAdd = [
      {
        variantId: `gid://shopify/ProductVariant/${itemVariant}`,
        quantity: quantity(formatId(product.id)),
      },
    ];

    // Final order
    const cart = await shopifyClient.checkout.addLineItems(
      checkoutId,
      lineItemsToAdd
    );

    // Push to shopify checkout page
    router.push(cart.webUrl);
  };

  return (
    <div>
      <h3>{product.title}</h3>

      {imageSources.map((src) => (
        <Image key={src} src={src} width={16} height={9} layout="responsive" />
      ))}

      <AiOutlinePlus onClick={() => increaseQuantity(formatId(product.id))} />

      <span>{quantity(formatId(product.id))}</span>

      {/* Render the minus button if product quantity is more than 0 */}
      {quantity(formatId(product.id)) > 0 && (
        <AiOutlineMinus
          onClick={() => decreaseQuantity(formatId(product.id))}
        />
      )}

      {/* Product variant options */}
      <select onChange={(e) => setItemVariant(e.target.value)}>
        <option hidden value="Please select a variant">
          Please select a variant
        </option>
        {product.variants.map((variant) => (
          <option key={formatId(variant.id)} value={formatId(variant.id)}>
            {variant.title}
          </option>
        ))}
      </select>

      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

// Static pages for all the products
export async function getStaticPaths() {
  const products = await shopifyClient.product.fetchAll();

  const ids = products.map((product) => {
    return {
      params: {
        id: formatId(product.id),
      },
    };
  });

  return {
    paths: ids,
    fallback: false,
  };
}

// Find the product with id from the params
export async function getStaticProps({ params: { id } }) {
  const product = await shopifyClient.product.fetch(
    `gid://shopify/Product/${id}`
  );

  return {
    props: { product: JSON.parse(JSON.stringify(product)) },
  };
}

export default ProductDetailsPage;
