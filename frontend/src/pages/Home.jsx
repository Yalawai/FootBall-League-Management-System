import NavigationHeader from "../components/Header";
import React, { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import styles from '../styles/Home.module.css'
import nono from '../assets/goal.png'
import Sponser from "../components/Sponser";
import NewsSection from "../components/NewsSection";
import { useNavigate } from 'react-router-dom';

function Home() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('api/featurednews/')
      .then(response => {
        setNews(response.data);
        console.log(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  if (news.length === 0) return null;

  const mainNews = news[0];
  const sideNews = news.slice(1, 3);
  const listNews = news.slice(3)

 

  return (
    <div className="App">
      <NavigationHeader />
      <div className={styles.container}>

      
      <Sidebar />
      <div className={styles.Feature}>
      <div className={styles.gridContainer}>
      <div className={styles.mainNews} onClick={() => navigate(`/news/${mainNews.id}`)}>
        <img src={mainNews.image} alt={mainNews.title} />
        <div className={styles.overlay}>
          <div className={styles.newsCategory}>{mainNews.category}</div>
          <div className={styles.newsTitle}>{mainNews.title}</div>
          
        </div>
      </div>
      <div className={styles.sideNews}>
        {sideNews.map((item, index) => (
          <div key={index} className={styles.sideNewsItem} onClick={() => navigate(`/news/${item.id}`)}>
            <img src={item.image} alt={item.title} />
            <div className={styles.overlay}>
              <div className={styles.newsCategory}>{item.category}</div>
              <div className={styles.newsTitle}>{item.title}</div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
    <Sponser/>
    <div className={styles.mainContent}>
          
          <NewsSection title="Latest News" news={listNews} moreLink="/more-latest-news" />
        </div>

    </div>

   




      </div>
      
      
    </div>
  );
}

export default Home;
