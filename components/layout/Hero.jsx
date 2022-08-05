import Link from "next/link";
import Image from "next/image";
import styles from "@styles/layout/Hero.module.css";

const Hero = ({ title, text, url, urlText, imageURL }) => {
  return (
    <section className={styles.Hero}>
      <div className={styles.Content}>
        <h1>{title}</h1>
        <p>{text}</p>
        <Link href={url}>
          <a>{urlText}</a>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
