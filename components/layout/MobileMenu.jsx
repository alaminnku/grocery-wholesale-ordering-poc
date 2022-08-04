import { useEffect } from "react";
import Link from "next/link";
import { IoCloseOutline } from "react-icons/io5";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";
import styles from "@styles/layout/MobileMenu.module.css";

const MobileMenu = ({ isOpen, closeMenu }) => {
  // Disable and enable body scroll
  useEffect(() => {
    const mobileMenu = document.querySelector("#MobileMenu");

    isOpen ? disableBodyScroll(mobileMenu) : enableBodyScroll(mobileMenu);
  });

  return (
    <>
      <div
        id="MobileMenu"
        className={`${styles.MobileMenu} ${isOpen && styles.Open}`}
      >
        <IoCloseOutline onClick={closeMenu} />

        <div className={styles.Navigation} onClick={closeMenu}>
          <Link href="/">
            <a>Home</a>
          </Link>

          <Link href="products">
            <a>Products</a>
          </Link>
        </div>
      </div>

      <div
        className={`${styles.Overlay} ${isOpen && styles.Open}`}
        onClick={closeMenu}
      ></div>
    </>
  );
};

export default MobileMenu;
