import { HiOutlineMenuAlt4, HiOutlineShoppingCart } from "react-icons/hi";
import CartIcon from "@components/layout/CartIcon";
import styles from "@styles/layout/MobileNav.module.css";

const MobileNav = ({ openMenu, openCart, totalCartQuantity }) => {
  return (
    <nav className={styles.MobileNav}>
      <div className={styles.Menu} onClick={openMenu}>
        <HiOutlineMenuAlt4 />
      </div>

      <CartIcon openCart={openCart} totalCartQuantity={totalCartQuantity} />
    </nav>
  );
};

export default MobileNav;
