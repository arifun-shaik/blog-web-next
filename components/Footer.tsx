import Profile from "./Profile";
import styles from "../styles/Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Profile />
      <p className={styles.copyright}>© 2025 pon / hiromu nakamura</p>
    </footer>
  );
}
