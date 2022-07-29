import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@contexts/CartContext";
import { shopifyClient } from "@utils/shopify";
import { formatId } from "@utils/formatId";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useProduct } from "@contexts/ProductContext";

const ProductDetailsPage = ({ product }) => {
  // Hooks
  const {
    currentVariant,
    changeProductVariant,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useProduct();
  const { addVariantToCart } = useCart();

  // Image sources
  const imageSources = product.images.map((image) => image.src);

  return (
    <div>
      <h3>{product.title}</h3>

      {imageSources.map((src) => (
        <Image key={src} src={src} width={16} height={9} layout="responsive" />
      ))}

      <AiOutlinePlus onClick={() => increaseProductQuantity(product)} />

      <span>{currentVariant(product.id)?.quantity}</span>

      {/* Render the minus button if product quantity is more than 0 */}

      {currentVariant(product.id)?.quantity > 1 && (
        <AiOutlineMinus onClick={() => decreaseProductQuantity(product)} />
      )}

      {/* Render cart item price or initial price */}
      <p>
        AUD $
        {currentVariant(product.id)?.price ||
          parseFloat(product.variants[0].price)}
      </p>

      {/* Product variant options */}
      <select onChange={(e) => changeProductVariant(product, e.target.value)}>
        {product.variants.map((variant) => (
          <option key={formatId(variant.id)} value={formatId(variant.id)}>
            {variant.title}
          </option>
        ))}
      </select>

      <button onClick={() => addVariantToCart(product.id)}>Add to cart</button>
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
