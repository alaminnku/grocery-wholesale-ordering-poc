import Products from "@components/Products/Products";
import styles from "@styles/home/Collection.module.css";

const Collection = ({ collection }) => {
  return (
    <section className={styles.Collection}>
      <div className={styles.Title}>
        <h2>{collection.title} collection</h2>
        <p>{collection.description}</p>
      </div>
      <Products products={collection.products} />
    </section>
  );
};

export default Collection;
