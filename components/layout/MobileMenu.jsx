import Link from "next/link";
import { IoCloseOutline } from "react-icons/io5";
import styles from "@styles/layout/MobileMenu.module.css";

const MobileMenu = ({ isOpen, closeMenu }) => {
  return (
    <div>
      <div className={`${styles.MobileMenu} ${isOpen && styles.Open}`}>
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
    </div>
  );
};

export default MobileMenu;
