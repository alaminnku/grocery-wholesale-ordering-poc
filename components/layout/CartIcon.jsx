import { HiOutlineShoppingCart } from "react-icons/hi";
import styles from "@styles/layout/CartIcon.module.css";

const CartIcon = ({ openCart, totalCartQuantity }) => {
  return (
    <div className={styles.CartIcon} onClick={openCart}>
      <HiOutlineShoppingCart />
      {totalCartQuantity > 0 && (
        <span className={styles.Quantity}>{totalCartQuantity}</span>
      )}
    </div>
  );
};

export default CartIcon;
