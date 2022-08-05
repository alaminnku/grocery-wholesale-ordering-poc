import Hero from "@components/layout/Hero";
import { shopifyClient } from "@utils/shopify";
import Products from "@components/Products/Products";
import styles from "@styles/products/ProductsPage.module.css";

const ProductsPage = ({ products }) => {
  return (
    <main>
      <Hero
        title="Fresh and organic"
        text="Eat healthy and stay fit. Shop 100% organic groceries with GWOPOC!"
        url="/"
        urlText="Browse collections"
      />
      <section className={styles.Products}>
        <Products products={products} />
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
