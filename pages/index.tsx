import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "../components/Layout";
import Cards from "../components/Cards";
import Twitter from "../components/sns/Twitter";
import GitHub from "../components/sns/GitHub";
import styles from "../styles/Home.module.scss";
import { Blog } from "../types/blog";

interface HomeProps {
  blogs: Blog[];
}

export default function Home({ blogs }:HomeProps) {
  const router = useRouter();

  const handleMoreClick = () => {
    router.push("/blog?page=2");
  };

  return (
    <Layout>
      <div className={styles.container}>
        <section className={styles.top}>
          <h1 className={styles.title}>好奇心に殺される。</h1>
          <p className={styles.sub}>
            ソフトウェアエンジニア pon のブログサイト
          </p>
          <div className={styles.top_sns}>
            <a href="https://twitter.com/po3rin">
              <Twitter />
            </a>
            <a href="https://github.com/po3rin">
              <GitHub />
            </a>
          </div>
        </section>
        <Cards blogs={blogs} />
        <div className={styles.btn} onClick={handleMoreClick}>
          🍙もっと見る！
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await axios.get(`${process.env.BASE_URL}/api/v1/post?size=6`);

    return {
      props: {
        blogs: res.data.data,
      },
    };
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return {
      props: {
        blogs: [],
      },
    };
  }
}


