import { useEffect, useState } from "react";
import { useCart } from "@contexts/CartContext";
import { MdOutlineShoppingCart } from "react-icons/md";
import Cart from "@components/layout/Cart";
import styles from "@styles/layout/Navigation.module.css";

const Navigation = () => {
  // Hooks
  const [isOpen, setIsOpen] = useState(false);
  const { getCartItems, calculateQuantity } = useCart();
  const cartQuantity = calculateQuantity();

  // Get cart items from local storage
  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <nav className={styles.Navigation}>
      <div>
        <p>Logo</p>
      </div>
      <ul>
        <li>Products</li>
        <li onClick={() => setIsOpen(true)}>
          {cartQuantity > 0 && <span>{cartQuantity}</span>}
          <MdOutlineShoppingCart />
        </li>
      </ul>
      <Cart isOpen={isOpen} setIsOpen={setIsOpen} />
    </nav>
  );
};

export default Navigation;
