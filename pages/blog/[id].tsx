
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Cards from '../../components/Cards';
import Twitter from '../../components/sns/Twitter';
import styles from '../../styles/BlogPost.module.scss';
import MarkdownIt from 'markdown-it';
import type { Token, Renderer } from 'markdown-it';


type Blog = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  cover: string;
  body: string;
  renderedHTML?: string;
};

interface BlogPostProps {
  post: Blog;
  relational: Blog[];
}

export default function BlogPost({ post, relational }: BlogPostProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && post) {
      const Prism = require('prismjs');
      require('prismjs/components/prism-go');
      require('prismjs/components/prism-javascript');
      require('prismjs/components/prism-docker');
      require('prismjs/components/prism-diff');
      require('prismjs/components/prism-hcl');
      require('prismjs/components/prism-json');
      require('prismjs/components/prism-yaml');
      require('prismjs/components/prism-rust');
      require('prismjs/components/prism-python');
      require('prismjs/components/prism-java');
      Prism.highlightAll();
    }
  }, [post, router.asPath]);

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0].split('-').join(' / ');
  };

  const postTwitter = () => {
    window.open(
      `https://twitter.com/share?url=https://po3rin.com/blog/${post.id}`,
      'SNS_window',
      'width=600,height=500,menubar=no,toolbar=no,scrollbars=no'
    );
  };

  const renderMarkdown = () => {
    if (!post || !post.body) return { __html: '' };

    try {
      const md = new MarkdownIt();

      const defaultRender =
        md.renderer.rules.image ||
        function (
          tokens: Token[],
          idx: number,
          options: MarkdownIt.Options,
          env: any,
          self: Renderer
        ) {
          return self.renderToken(tokens, idx, options);
        };

      md.renderer.rules.image = function (
        tokens: Token[],
        idx: number,
        options: MarkdownIt.Options,
        env: any,
        self: Renderer
      ) {
        tokens[idx].attrPush(['loading', 'lazy']);
        return defaultRender(tokens, idx, options, env, self);
      };

      let content = post.body;
      const parts = content.split('---');
      if (parts.length >= 3) {
        content = parts.slice(2).join('---');
      }

      return { __html: md.render(content) };
    } catch (error) {
      console.error('Markdown rendering error:', error);
      return { __html: '<p>記事の読み込みに失敗しました。</p>' };
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Head>
        <title>{`${post.title} - 好奇心に殺される。- pon のテックブログ`}</title>
        <meta name="description" content={post.description} />
        <meta property="og:url" content={`https://po3rin.com/blog/${post.id}`} />
        <meta property="og:title" content={`${post.title} - 好奇心に殺される。`} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.cover} />
        <meta property="og:image:alt" content="OGP image" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@po3rin" />
        <meta property="og:site_name" content={`${post.title} - 好奇心に殺される。`} />
        <meta property="og:locale" content="ja_JP" />
      </Head>

      <section>
        <div className={styles.post_header}>
          <div className={styles.post_header_info}>
            <div className={styles.post_header_info_body}>
              <p className={styles.post_header_tags}>{post.tags.join(' / ')}</p>
              <h1 className={styles.post_header_title}>{post.title}</h1>
              <p className={styles.post_header_desc}>{post.description}</p>
              <div className={styles.sns} onClick={postTwitter}>
                <Twitter />
              </div>
              <p className={styles.post_header_date}>{formatDate(post.created_at)}</p>
            </div>
          </div>
          <div
            className={styles.post_header_media}
            style={{ backgroundImage: `url(${post.cover})` }}
          />
        </div>

        <div className={styles.post}>
          <div
            dangerouslySetInnerHTML={
              post.renderedHTML ? { __html: post.renderedHTML } : renderMarkdown()
            }
          />
          <div className={styles.footer}>
            <div className={styles.footer_tags}>
              {post.tags.map((tag, i) => (
                <div key={i} className={styles.footer_tag}>
                  <a href={`/blog?tags=${tag}&page=1`}>{tag}</a>
                </div>
              ))}
            </div>
            <div className={styles.sns} onClick={postTwitter}>
              <Twitter />
            </div>
          </div>
        </div>

        {relational && relational.length > 0 && (
          <>
            <div className={styles.more}>
              <p className={styles.section_title}>🔍 more !!</p>
            </div>
            <Cards blogs={relational} />
          </>
        )}
      </section>
    </Layout>
  );
}

// 👇 Type-safe server-side props
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { id } = context.params as { id: string };

    const res = await axios.get(`${process.env.BASE_URL}/api/v1/post/${id}`);
    const post: Blog = res.data.data;

    let tagsQuery = '';
    if (post.tags && post.tags.length > 0) {
      tagsQuery = `&tags=${post.tags.join(',')}`;
    }

    const relationalRes = await axios.get(
      `${process.env.BASE_URL}/api/v1/post?size=3${tagsQuery}`
    );
    const relational: Blog[] = relationalRes.data.data.filter((d: Blog) => d.id !== id);

    const md = new MarkdownIt();

    let content = post.body;
    const parts = content.split('---');
    if (parts.length >= 3) {
      content = parts.slice(2).join('---');
    }

    post.renderedHTML = md.render(content);

    return {
      props: {
        post,
        relational,
      },
    };
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return {
      notFound: true,
    };
  }
};


