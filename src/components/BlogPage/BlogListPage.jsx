import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BlogListPage.scss';
import LandingHeader from '../LandingPage/LandingHeader';
import Footer from '../LandingPage/Footer';
import ArticleCard from './ArticleCard';
import articles from './articles';

const BlogListPage = ({ isLoggedIn }) => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page">
      <LandingHeader isLoggedIn={isLoggedIn} />
      <main className="blog-list-page">
        <Link to="/" className="blog-list-page__back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6667 8H3.33334M3.33334 8L8.00001 12.6667M3.33334 8L8.00001 3.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('blog.backToMain', 'Go back to Main Page')}
        </Link>

        <h1 className="blog-list-page__title">{t('blog.pageTitle', 'Blog')}</h1>

        <div className="blog-list-page__grid">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogListPage;
