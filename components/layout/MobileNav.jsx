import { HiOutlineMenuAlt4, HiOutlineShoppingCart } from "react-icons/hi";
import styles from "@styles/layout/MobileNav.module.css";

const MobileNav = ({ openMenu, openCart, totalCartQuantity }) => {
  return (
    <nav className={styles.MobileNav}>
      <div className={styles.Menu} onClick={openMenu}>
        <HiOutlineMenuAlt4 />
      </div>

      <div className={styles.Cart}>
        <HiOutlineShoppingCart />
        <div className={styles.Quantity}>
          {totalCartQuantity > 0 && <span>{totalCartQuantity}</span>}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
