import React from 'react';
import styles from '../styles/NewsSection.module.css';
import NewsItem from '../components/NewsItem'

const NewsSection = ({ title, news, moreLink }) => {
  return (
    <div className={styles.newsSection}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {moreLink && <a href={moreLink} className={styles.moreLink}>More News &rarr;</a>}
      </div>
      <div className={styles.newsGrid}>
        {news.map((item, index) => (
          <NewsItem item = {item} key={index} varient='newsItem'/>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
