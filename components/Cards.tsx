

import { useRouter } from "next/router";
import styles from "../styles/Cards.module.scss";

type Blog = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  tags: string[];
  cover: string;
};

interface CardsProps {
  blogs: Blog[];
}



export default function Cards({ blogs }:CardsProps) {
  const router = useRouter();

  const formatDate = (dateString:string):string => {
    return dateString.split("T")[0].split("-").join(" / ");
  };

  const handleClick = (id:string):void => {
    router.push(`/blog/${id}`);
  };

  return (
    <div className={styles.cards}>
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className={styles.card}
          onClick={() => handleClick(blog.id)}
        >
          <div
            className={styles.card_cover}
            style={{ backgroundImage: `url(${blog.cover})` }}
          />
          <div className={styles.card_body}>
            <p className={styles.card_title}>{blog.title}</p>
            <p className={styles.card_description}>{blog.description}</p>
          </div>
          <p className={styles.card_date}>{formatDate(blog.created_at)}</p>
          <p className={styles.card_tags}>{blog.tags.join(" / ")}</p>
        </div>
      ))}
    </div>
  );
}
