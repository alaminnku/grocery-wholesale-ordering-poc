import { CartProvider } from "@contexts/CartContext";
import Navigation from "@components/layout/Navigation";
import "@styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <CartProvider>
      <Navigation />
      <Component {...pageProps} />
    </CartProvider>
  );
};

export default MyApp;
