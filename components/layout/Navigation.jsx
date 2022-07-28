import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@contexts/CartContext";
import { MdOutlineShoppingCart } from "react-icons/md";
import styles from "@styles/layout/Navigation.module.css";

const Navigation = () => {
  // Hooks
  const { openCart, totalCartQuantity } = useCart();

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
          {totalCartQuantity > 0 && <span>{totalCartQuantity}</span>}
          <MdOutlineShoppingCart />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
