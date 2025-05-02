import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/NewsItem.module.css';

const NewsItem = ({ item, varient }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/news/${item.id}`);
  };
  return (
    <div className={styles[varient]} onClick={handleClick}>
      <img src={item.image} alt={item.title} className={styles.newsImage} />
      <div className={styles.newsContent}>
        <div className={styles.category}>{item.category}</div>
        <h3 className={styles.title}>{item.title}</h3>
        
      </div>
    </div>
  );
};

export default NewsItem;
