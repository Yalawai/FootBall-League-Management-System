import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/Sponser.module.css';
import api from '../api';


const Sponser = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    api.get('api/sponser/')
      .then(response => {
        setLogos(response.data);
        console.log(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  // Split logos into chunks of 5
  const chunkedLogos = [];
  for (let i = 0; i < logos.length; i += 5) {
    chunkedLogos.push(logos.slice(i, i + 5));
  }
  console.log(chunkedLogos)

  return (
    <div className={styles.carouselContainer}>
      <Carousel slide={false} fade={true} controls={false}>
        {chunkedLogos.map((chunk, index) => (
          <Carousel.Item key={index} interval={3000}>
            <div className={styles.logoRow}>
              {chunk.map((logo, idx) => (
                <img
                  key={idx}
                  className={styles.logoImage}
                  src={logo.image}
                  alt={logo.title}
                />
              ))}
            </div>

            
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Sponser;
