import { ProductsProvider } from "@contexts/ProductsContext";
import { CartProvider } from "@contexts/CartContext";
import Navigation from "@components/layout/Navigation";
import "@styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ProductsProvider>
      <CartProvider>
        <Navigation />
        <Component {...pageProps} />
      </CartProvider>
    </ProductsProvider>
  );
};

export default MyApp;
