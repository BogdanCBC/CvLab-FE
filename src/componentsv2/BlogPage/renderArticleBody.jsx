import React from 'react';

// Renders the constrained markdown subset used for article bodies: ## and ###
// headings plus plain paragraphs, separated by blank lines.
const renderArticleBody = (content) => {
  const blocks = content.trim().split(/\n\s*\n/);

  return blocks.map((block, index) => {
    if (block.startsWith('### ')) {
      return (
        <h3 key={index} className="article-page__h3">
          {block.slice(4)}
        </h3>
      );
    }

    if (block.startsWith('## ')) {
      return (
        <h2 key={index} className="article-page__h2">
          {block.slice(3)}
        </h2>
      );
    }

    return (
      <p key={index} className="article-page__paragraph">
        {block}
      </p>
    );
  });
};

export default renderArticleBody;
