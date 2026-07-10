import React from 'react';

// Renders the constrained markdown subset used for article bodies: ##, ###
// and #### headings, "- " bullet lists, **bold** inline text, and plain
// paragraphs, separated by blank lines.
const renderInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderArticleBody = (content) => {
  const blocks = content.trim().split(/\n\s*\n/);

  return blocks.map((block, index) => {
    if (block.startsWith('#### ')) {
      return (
        <h4 key={index} className="article-page__h4">
          {renderInline(block.slice(5))}
        </h4>
      );
    }

    if (block.startsWith('### ')) {
      return (
        <h3 key={index} className="article-page__h3">
          {renderInline(block.slice(4))}
        </h3>
      );
    }

    if (block.startsWith('## ')) {
      return (
        <h2 key={index} className="article-page__h2">
          {renderInline(block.slice(3))}
        </h2>
      );
    }

    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const isList = lines.length > 0 && lines.every((line) => line.startsWith('- '));

    if (isList) {
      return (
        <ul key={index} className="article-page__list">
          {lines.map((line, li) => (
            <li key={li}>{renderInline(line.slice(2))}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="article-page__paragraph">
        {renderInline(block)}
      </p>
    );
  });
};

export default renderArticleBody;
