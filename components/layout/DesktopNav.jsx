import Link from "next/link";
import { MdOutlineShoppingCart } from "react-icons/md";
import styles from "@styles/layout/DesktopNav.module.css";

const DesktopNav = ({ openCart, totalCartQuantity }) => {
  return (
    <nav className={styles.DesktopNav}>
      <div>
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>
      <ul>
        <Link href="/products">
          <a>Products</a>
        </Link>
        <li onClick={openCart}>
          {totalCartQuantity > 0 && <span>{totalCartQuantity}</span>}
          <MdOutlineShoppingCart />
        </li>
      </ul>
    </nav>
  );
};

export default DesktopNav;
