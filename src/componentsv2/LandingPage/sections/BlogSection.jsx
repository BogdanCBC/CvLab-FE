import React from 'react';
import { Link } from 'react-router-dom';
import './BlogSection.scss';
import { useTranslation } from 'react-i18next';
import articles from '../../BlogPage/articles';
import ArticleCard from '../../BlogPage/ArticleCard';

const BlogSection = ({ excludeSlug }) => {
  const { t } = useTranslation();
  const featured = articles.filter((article) => article.slug !== excludeSlug).slice(0, 3);

  if (featured.length === 0) return null;

  const seeMoreLink = (className, label) => (
    <Link to="/blog" className={className}>
      {label}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.33334 8H12.6667M12.6667 8L8.00001 3.33334M12.6667 8L8.00001 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );

  return (
    <section id="blog" className="blog-section">
      <div className="blog-section__header">
        <div>
          <span className="blog-section__eyebrow">{t('landing.blog.eyebrow', 'Blog')}</span>
          <h2 className="blog-section__title">{t('landing.blog.title', 'Resources & Articles')}</h2>
        </div>
        {seeMoreLink('blog-section__see-more blog-section__see-more--desktop', t('landing.blog.seeMore', 'See more'))}
      </div>

      <div className="blog-section__grid">
        {featured.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {seeMoreLink(
        'blog-section__see-more blog-section__see-more--mobile',
        t('landing.blog.seeMoreArticles', 'See more articles')
      )}
    </section>
  );
};

export default BlogSection;
