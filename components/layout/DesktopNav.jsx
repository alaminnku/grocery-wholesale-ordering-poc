import Link from "next/link";
import styles from "@styles/layout/DesktopNav.module.css";
import CartIcon from "@components/layout/CartIcon";
import { useRouter } from "next/router";

const DesktopNav = ({ openCart, totalCartQuantity }) => {
  const router = useRouter();

  const path = router.pathname;

  return (
    <nav className={styles.DesktopNav}>
      <div className={styles.Home}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>

      <ul className={styles.Navigation}>
        <li>
          <Link href="/products">
            <a className={path === "/products" ? styles.Active : null}>
              Products
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>About us</a>
          </Link>
        </li>

        <li>
          <Link href="/">
            <a>Order status</a>
          </Link>
        </li>
      </ul>

      <CartIcon openCart={openCart} totalCartQuantity={totalCartQuantity} />
    </nav>
  );
};

export default DesktopNav;
