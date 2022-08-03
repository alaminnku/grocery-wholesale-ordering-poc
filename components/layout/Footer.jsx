import Image from "next/image";
import Link from "next/link";
import styles from "@styles/layout/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.Footer}>
      <p className={styles.Logo}>GWOPOC</p>

      <div className={styles.Content}>
        <div className={styles.Details}>
          <p className={styles.About}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
            accusamus ad aliquam inventore fugiat tenetur aperiam est
            perspiciatis non dolorem corporis debitis tempore, cumque soluta.
          </p>

          <div className={styles.StoresImage}>
            <Image
              src="/stores-sticker.png"
              width={16}
              height={11}
              layout="responsive"
            />
          </div>
        </div>

        <ul className={styles.Navigation}>
          <li>
            <Link href="/products">
              <a>Products</a>
            </Link>
          </li>
          <li>
            <Link href="/">
              <a>About us</a>
            </Link>
          </li>
          <li>
            <Link href="/">
              <a>Help center</a>
            </Link>
          </li>
          <li>
            <Link href="/a">
              <a>Privacy policy</a>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
