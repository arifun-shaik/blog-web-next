import Image from "next/image";
import Twitter from "./sns/Twitter";
import GitHub from "./sns/GitHub";
import styles from "../styles/Profile.module.scss";

export default function Profile() {
  return (
    <div>
      <div className={styles.profile}>
        <div>
          <Image
            className={styles.profile_media}
            src="/images/gopher.png"
            alt="ponのプロフィール画像"
            width={96}
            height={96}
            priority
          />
        </div>
        <div>
          <p className={styles.profile_name}>pon</p>
          <div className={styles.line}></div>
          <p className={styles.profile_body}>
            エンジニア8年目です。ソフトウェアエンジニア/データエンジニア/検索エンジニア的な働き方。GoとPythonをよく書きます。情報検索が好き。
          </p>
          <p className={styles.profile_skills}>
            Go / Python / Rust / AWS / Google Cloud / Elasticsearch / Kubernetes
            / Vim
          </p>
        </div>
      </div>
      <div className={styles.sns}>
        <a href="https://twitter.com/po3rin">
          <Twitter />
        </a>
        <a href="https://github.com/po3rin">
          <GitHub />
        </a>
      </div>
    </div>
  );
}
