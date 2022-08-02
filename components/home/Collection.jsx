import Products from "./Products";

const Collection = ({ collection }) => {
  return (
    <section>
      <h2>{collection.title} collection</h2>
      <p>{collection.description}</p>
      <Products products={collection.products} />
    </section>
  );
};

export default Collection;
