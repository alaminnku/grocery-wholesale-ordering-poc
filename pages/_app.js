import { ProductProvider } from "@contexts/ProductContext";
import { CartProvider } from "@contexts/CartContext";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import "@styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ProductProvider>
      <CartProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </CartProvider>
    </ProductProvider>
  );
};

export default MyApp;
