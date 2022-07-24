import { useCart } from "@contexts/CartContext";
import { IoCloseOutline } from "react-icons/io5";
import styles from "@styles/layout/Cart.module.css";

const Cart = ({ isOpen, setIsOpen }) => {
  const { cartQuantity } = useCart();

  return (
    <div
      className={`${styles.Overlay} ${isOpen && styles.Open}`}
      onClick={() => setIsOpen(false)}
    >
      <div className={styles.Cart}>
        <div className={styles.CartHeader}>
          <h3>
            Your cart <span>({cartQuantity})</span>
          </h3>
          <IoCloseOutline onClick={() => setIsOpen(false)} />
        </div>

        <div>{cartQuantity === 0 && <p>Your cart is empty</p>}</div>
      </div>
    </div>
  );
};

export default Cart;
