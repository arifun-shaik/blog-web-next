
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "../../components/Layout";
import Cards from "../../components/Cards";
import styles from "../../styles/BlogIndex.module.scss";
import { Blog } from "../../types/blog"; // for /pages/blog/index.tsx
import { GetServerSidePropsContext } from "next"; // 👈 make sure this is imported


interface BlogIndexProps {
  blogs: Blog[];
  total: number;
}

export default function BlogIndex({ blogs, total }: BlogIndexProps) {
  const router = useRouter();
  const { page = "1", tags } = router.query;

  const prevPage = () => {
    const currentPage = parseInt(page as string);
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      const query: Record<string, string> = { page: newPage.toString() };
      if (tags) query.tags = tags as string;
      router.push({ pathname: "/blog", query });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextPage = () => {
    const currentPage = parseInt(page as string);
    if (total - currentPage * 6 > 0) {
      const newPage = currentPage + 1;
      const query: Record<string, string> = { page: newPage.toString() };
      if (tags) query.tags = tags as string;
      router.push({ pathname: "/blog", query });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        {tags && (
          <div className={styles.searched}>
            <p>
              🔍
              {(tags as string).split(",").map((tag, i) => (
                <span key={i} className={styles.searched_label}>
                  {tag}
                </span>
              ))}
              タグの検索結果 !
            </p>
          </div>
        )}
        {/* <Cards blogs={blogs} /> */}
        {Array.isArray(blogs) && blogs.length > 0 ? (
  <Cards blogs={blogs} />
) : (
  <p>No blog posts found.</p>
)}

        <div className={styles.pager}>
          {page && page !== "1" && (
            <div className={styles.btn} onClick={prevPage}>
              前へ
            </div>
          )}
          {total - parseInt(page as string) * 6 > 0 && (
            <div className={styles.btn} onClick={nextPage}>
              次へ
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { page = "1", tags } = query;
  const pageSize = 6;

  try {
    let url = `${process.env.BASE_URL}/api/v1/post?size=${pageSize}`;

    if (tags) {
      url += `&tags=${tags}`;
    }

    const pageNumber = parseInt(page as string);
    if (!isNaN(pageNumber) && pageNumber > 1) {
      const from = (pageNumber - 1) * pageSize;
      url += `&from=${from}`;
    }

    const res = await axios.get(url);

    return {
      props: {
        blogs: res.data?.data || [],
        total: res.data?.total || 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return {
      props: {
        blogs: [],
        total: 0,
      },
    };
  }
}




