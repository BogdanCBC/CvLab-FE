import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ArticlePage.scss';
import LandingHeader from '../LandingPage/LandingHeader';
import Footer from '../LandingPage/Footer';
import BlogSection from '../LandingPage/sections/BlogSection';
import articles from './articles';
import renderArticleBody from './renderArticleBody';

const ArticlePage = ({ isLoggedIn }) => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="landing-page">
        <LandingHeader isLoggedIn={isLoggedIn} />
        <main className="article-page">
          <Link to="/blog" className="article-page__back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.6667 8H3.33334M3.33334 8L8.00001 12.6667M3.33334 8L8.00001 3.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('blog.backToBlog', 'Go back to Blog')}
          </Link>
          <h1 className="article-page__title">{t('blog.notFound', 'Article not found')}</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(article.date).toLocaleDateString(i18n.language, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="landing-page">
      <LandingHeader isLoggedIn={isLoggedIn} />
      <main className="article-page">
        <Link to="/blog" className="article-page__back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6667 8H3.33334M3.33334 8L8.00001 12.6667M3.33334 8L8.00001 3.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('blog.backToBlog', 'Go back to Blog')}
        </Link>

        <h1 className="article-page__title">{article.title}</h1>
        <span className="article-page__date">
          {t('blog.publishedOn', 'Published on {{date}}', { date: formattedDate })}
        </span>

        <div className="article-page__cover">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.coverImageAlt || ''} />
          ) : (
            <div className="article-page__cover-placeholder" />
          )}
        </div>

        <div className="article-page__body">{renderArticleBody(article.content)}</div>
      </main>

      <BlogSection excludeSlug={article.slug} />

      <Footer />
    </div>
  );
};

export default ArticlePage;
