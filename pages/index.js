import { shopifyClient } from "@utils/shopify";
import Collection from "@components/home/Collection";

const HomePage = ({ collections }) => {
  return (
    <main>
      {collections.map((collection) => (
        <Collection collection={collection} />
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
