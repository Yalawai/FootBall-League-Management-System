import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/FeaturedNews.module.css'; 
import nono from '../assets/goal.png';

const NewsCarousel = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get('api/featurednews/')
      .then(response => {
        setNews(response.data);
        console.log(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <Carousel>
      {news.map((item, index) => (
        <Carousel.Item key={index} className={styles.carouselItem}>
          {item.image ? (
            <img
              className={`d-block w-100 ${styles.carouselImage}`}
              src={item.image}
              alt={item.title}
            />
          ) : (
            <img
              className={`d-block w-100 ${styles.carouselImage}`}
              src={nono}
              alt={item.title}
            />
          )}
          {item.video_url && (
            <iframe
              className={`d-block w-100 ${styles.carouselIframe}`}
              src={item.video_url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={item.title}
            ></iframe>
          )}
          <Carousel.Caption className={styles.carouselCaption}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default NewsCarousel;
