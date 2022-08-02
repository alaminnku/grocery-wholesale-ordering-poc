import { ProductProvider } from "@contexts/ProductContext";
import { CartProvider } from "@contexts/CartContext";
import Header from "@components/layout/Header";
import "@styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ProductProvider>
      <CartProvider>
        <Header />
        <Component {...pageProps} />
      </CartProvider>
    </ProductProvider>
  );
};

export default MyApp;
