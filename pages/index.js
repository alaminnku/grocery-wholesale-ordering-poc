import { shopifyClient } from "@utils/shopify";

const HomePage = ({ collections }) => {
  console.log(collections);
  return <div>Hello world</div>;
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
