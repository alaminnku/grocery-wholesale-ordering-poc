import Image from "next/image";
import { useCart } from "@contexts/CartContext";
import { shopifyClient } from "@utils/shopify";
import { formatId } from "@utils/formatId";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useProduct } from "@contexts/ProductContext";
import styles from "@styles/products/ProductPage.module.css";
import { useState } from "react";

const ProductDetailsPage = ({ product }) => {
  // Hooks
  const [coverImage, setCoverImage] = useState(0);
  const {
    findCurrentProduct,
    changeProductVariant,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useProduct();
  const { addVariantToCart } = useCart();

  // Current product
  const currentProduct = findCurrentProduct(product.id);

  // Quantity
  const quantity = currentProduct?.quantity;

  // Price
  const price = currentProduct?.price;

  // Image sources
  const imageSources = product.images.map((image) => image.src);

  return (
    <main>
      <section className={styles.Product}>
        <div className={styles.Images}>
          {/* Cover image */}
          <div className={styles.CoverImage}>
            <Image
              src={imageSources[coverImage]}
              width={16}
              height={9}
              layout="responsive"
              objectFit="cover"
            />
          </div>

          {/* All images */}
          <div className={styles.ImageIcons}>
            {imageSources.map((src, idx) => (
              <div
                key={src}
                className={`${styles.ImageIcon} ${
                  coverImage === idx && styles.Active
                }`}
                onClick={() => setCoverImage(idx)}
              >
                <Image
                  src={src}
                  width={16}
                  height={9}
                  layout="responsive"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.Content}>
          <div className={styles.AboutProduct}>
            <h1>{product.title}</h1>
            <p>
              AUD $
              {quantity > 0 ? price : parseFloat(product.variants[0].price)}
            </p>
            <p>{product.description}</p>
          </div>

          <div className={styles.Controller}>
            <select
              onChange={(e) => changeProductVariant(product, e.target.value)}
            >
              {product.variants.map((variant) => (
                <option key={formatId(variant.id)} value={formatId(variant.id)}>
                  {variant.title}
                </option>
              ))}
            </select>

            <AiOutlinePlus
              className={quantity > 0 && styles.Active}
              onClick={() => increaseProductQuantity(product)}
            />

            <p className={quantity > 0 ? styles.Quantity : null}>
              {quantity > 0 && quantity}
            </p>

            {quantity > 0 && (
              <AiOutlineMinus
                className={styles.Active}
                onClick={() => decreaseProductQuantity(product)}
              />
            )}
          </div>

          <button
            className={`${styles.AddToCart} ${quantity > 0 && styles.Active}`}
            onClick={() => addVariantToCart(product.id)}
          >
            Add to cart
          </button>
        </div>
      </section>
    </main>
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
