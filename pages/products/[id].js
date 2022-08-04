import Image from "next/image";
import { shopifyClient } from "@utils/shopify";
import { formatId } from "@utils/formatId";
import { useProduct } from "@contexts/ProductContext";
import { useState } from "react";
import Controller from "@components/Products/Controller";
import styles from "@styles/products/ProductPage.module.css";

const ProductDetailsPage = ({ product }) => {
  // Hooks
  const [coverImage, setCoverImage] = useState(0);
  const { findCurrentProduct } = useProduct();

  // Current product
  const currentProduct = findCurrentProduct(product.id);

  // Quantity
  const quantity = currentProduct?.quantity;

  // Price
  const price = currentProduct?.price;

  // Image sources
  const imageSources = product.images.map((image) => image.src);

  return (
    <main className={styles.ProductPage}>
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

        {/* Image icons */}
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

      {/* Content and Controller*/}
      <div className={styles.Content}>
        <div className={styles.AboutProduct}>
          <h1>{product.title}</h1>
          <p>
            AUD ${quantity > 0 ? price : parseFloat(product.variants[0].price)}
          </p>
          <p>{product.description}</p>
        </div>

        <Controller product={product} />
      </div>
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
