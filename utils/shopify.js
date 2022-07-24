import Client from "shopify-buy";

export const shopifyClient = Client.buildClient({
  domain: "starter-test-dev.myshopify.com",
  storefrontAccessToken: "2d2275f1352ee64b43dd1dc77219d8b6",
});
