import Link from "next/link";
import styles from "../styles/Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <div className={styles.header_logo}></div>
      </Link>
      <Link href="/">
        <div className={styles.header_item}>🏠home</div>
      </Link>
      <Link href="/about">
        <div className={styles.header_item}>😊about</div>
      </Link>
    </header>
  );
}
