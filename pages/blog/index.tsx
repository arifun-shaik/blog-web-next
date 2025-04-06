// import { useRouter } from "next/router";
// import axios from "axios";
// import Layout from "../../components/Layout";
// import Cards from "../../components/Cards";
// import styles from "../../styles/BlogIndex.module.scss";

// interface BlogIndexProps {
//   blogs: Blog[];
//   total: number;
// }

// export default function BlogIndex({ blogs, total }: BlogIndexProps) {


// export default function BlogIndex({ blogs, total }) {
//   const router = useRouter();
//   const { page = "1", tags } = router.query;

//   const prevPage = () => {
//     const currentPage = parseInt(page);
//     if (currentPage > 1) {
//       const newPage = currentPage - 1;
//       const query = { page: newPage.toString() };
//       if (tags) query.tags = tags;
//       router.push({
//         pathname: "/blog",
//         query,
//       });
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     }
//   };

//   const nextPage = () => {
//     const currentPage = parseInt(page);
//     if (total - currentPage * 6 > 0) {
//       const newPage = currentPage + 1;
//       const query = { page: newPage.toString() };
//       if (tags) query.tags = tags;
//       router.push({
//         pathname: "/blog",
//         query,
//       });
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <Layout>
//       <div className={styles.container}>
//         {tags && (
//           <div className={styles.searched}>
//             <p>
//               🔍
//               {tags.split(",").map((tag, i) => (
//                 <span key={i} className={styles.searched_label}>
//                   {tag}
//                 </span>
//               ))}
//               タグの検索結果 !
//             </p>
//           </div>
//         )}
//         <Cards blogs={blogs} />
//         <div className={styles.pager}>
//           {page && page !== "1" && (
//             <div className={styles.btn} onClick={prevPage}>
//               前へ
//             </div>
//           )}
//           {total - parseInt(page) * 6 > 0 && (
//             <div className={styles.btn} onClick={nextPage}>
//               次へ
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export async function getServerSideProps({ query }) {
//   const { page = "1", tags } = query;
//   const pageSize = 6;

//   try {
//     let url = `${process.env.BASE_URL}/api/v1/post?size=${pageSize}`;

//     if (tags) {
//       url += `&tags=${tags}`;
//     }

//     if (page && page !== "0") {
//       const from = parseInt(page);
//       url += `&from=${(from - 1) * pageSize}`;
//     }

//     const res = await axios.get(url);

//     return {
//       props: {
//         blogs: res.data.data || [],
//         total: res.data.total || 0,
//       },
//     };
//   } catch (error) {
//     console.error("Failed to fetch blog posts:", error);
//     return {
//       props: {
//         blogs: [],
//         total: 0,
//       },
//     };
//   }
// }
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


// export async function getServerSideProps({ query }:GetServerSidePropsContext) {
//   const { page = "1", tags } = query;
//   const pageSize = 6;

//   try {
//     let url = `${process.env.BASE_URL}/api/v1/post?size=${pageSize}`;
//     if (tags) url += `&tags=${tags}`;
//     if (page && page !== "0") {
//       const from = parseInt(page as string);
//       url += `&from=${(from - 1) * pageSize}`;
//     }

//     const res = await axios.get(url);

//     return {
//       props: {
//         blogs: res.data.data || [],
//         total: res.data.total || 0,
//       },
//     };
//   } catch (error) {
//     console.error("Failed to fetch blog posts:", error);
//     return {
//       props: {
//         blogs: [],
//         total: 0,
//       },
//     };
//   }
// }
// import { useRouter } from "next/router";
// import { GetStaticProps } from "next";
// import axios from "axios";
// import Layout from "../../components/Layout";
// import Cards from "../../components/Cards";
// import styles from "../styles/Home.module.scss";
// import { Blog } from "../../types/blog";

// interface HomeProps {
//   blogs: Blog[];
// }

// export default function Home({ blogs }: HomeProps) {
//   const router = useRouter();

//   const handleMoreClick = () => {
//     router.push("/blog");
//   };

//   return (
//     <Layout>
//       <div className={styles.container}>
//         <h1 className={styles.title}>📝 Latest Blog Posts</h1>
//         <Cards blogs={blogs} />
//         <div className={styles.moreButtonWrapper}>
//           <button className={styles.moreButton} onClick={handleMoreClick}>
//             もっと見る →
//           </button>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export const getStaticProps: GetStaticProps = async () => {
//   try {
//     const res = await axios.get(`${process.env.BASE_URL}/api/v1/post?size=6`);
//     return {
//       props: {
//         blogs: res.data.data || [],
//       },
//       revalidate: 60, // ISR: Rebuild every 60 seconds
//     };
//   } catch (error) {
//     console.error("Failed to fetch home page blogs:", error);
//     return {
//       props: {
//         blogs: [],
//       },
//     };
//   }
// };

