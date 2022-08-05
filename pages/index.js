import { shopifyClient } from "@utils/shopify";
import Collection from "@components/home/Collection";
import { formatId } from "@utils/formatId";
import Hero from "@components/layout/Hero";

const HomePage = ({ collections }) => {
  return (
    <main>
      <Hero
        title="Best groceries in town"
        text="Order finest groceries online and get it delivered right to your door!"
        url="/products"
        urlText="Browse products"
      />
      {collections.map((collection) => (
        <Collection key={formatId(collection.id)} collection={collection} />
      ))}
    </main>
  );
};

export async function getStaticProps() {
  // Fetch the collections
  const data = await shopifyClient.collection.fetchAllWithProducts();

  // Parse the data
  const collections = JSON.parse(JSON.stringify(data));

  return {
    props: { collections },
  };
}

export default HomePage;
