import { ProductProvider } from "@contexts/ProductContext";
import { CartProvider } from "@contexts/CartContext";
import Navigation from "@components/layout/Navigation";
import "@styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ProductProvider>
      <CartProvider>
        <Navigation />
        <Component {...pageProps} />
      </CartProvider>
    </ProductProvider>
  );
};

export default MyApp;
