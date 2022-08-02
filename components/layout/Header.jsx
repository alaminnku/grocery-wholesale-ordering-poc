import { useCart } from "@contexts/CartContext";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import styles from "@styles/layout/Header.module.css";
import MobileMenu from "./MobileMenu";
import { useState } from "react";

const Header = () => {
  // Hooks
  const { openCart, totalCartQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Menu open and close functions
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  return (
    <header className={styles.Header}>
      {/* Mobile nav */}
      <MobileNav
        openMenu={openMobileMenu}
        openCart={openCart}
        totalCartQuantity={totalCartQuantity}
      />

      {/* Mobile menu */}
      <MobileMenu isOpen={isOpen} closeMenu={closeMobileMenu} />

      {/* Desktop nav */}
      <DesktopNav openCart={openCart} totalCartQuantity={totalCartQuantity} />
    </header>
  );
};

export default Header;
