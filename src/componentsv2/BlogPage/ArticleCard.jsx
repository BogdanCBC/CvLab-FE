import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ArticleCard.scss';

const ArticleCard = ({ article }) => {
  const { t, i18n } = useTranslation();
  const formattedDate = new Date(article.date).toLocaleDateString(i18n.language, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link to={`/blog/${article.slug}`} className="article-card">
      <div className="article-card__image">
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.coverImageAlt || ''} />
        ) : (
          <div className="article-card__image-placeholder" />
        )}
      </div>

      <div className="article-card__body">
        <span className="article-card__category">{article.category}</span>
        <h3 className="article-card__title">{article.title}</h3>
        <p className="article-card__excerpt">{article.excerpt}</p>

        <div className="article-card__meta">
          <span className="article-card__date">{formattedDate}</span>
          <span className="article-card__read">
            {t('blog.read', 'Read')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33334 8H12.6667M12.6667 8L8.00001 3.33334M12.6667 8L8.00001 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
