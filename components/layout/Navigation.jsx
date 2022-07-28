import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@contexts/CartContext";
import { MdOutlineShoppingCart } from "react-icons/md";
import Cart from "@components/layout/Cart";
import styles from "@styles/layout/Navigation.module.css";

const Navigation = () => {
  // Hooks
  const { openCart, totalQuantity } = useCart();

  return (
    <nav className={styles.Navigation}>
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
          {totalQuantity > 0 && <span>{totalQuantity}</span>}
          <MdOutlineShoppingCart />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
