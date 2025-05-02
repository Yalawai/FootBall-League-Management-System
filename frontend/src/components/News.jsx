import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import styles from "../styles/News.module.css";
import Header from "../components/Header";

function News() {
  const { id } = useParams();
  const [item, setItem] = useState({});

  useEffect(() => {
    api
      .get(`/api/news/${id}/`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  if (!item) {
    return <div>Loading...</div>;
  }

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1];
    const ampersandPosition = videoId ? videoId.indexOf("&") : -1;
    if (ampersandPosition !== -1) {
      return `https://www.youtube.com/embed/${videoId.substring(
        0,
        ampersandPosition
      )}`;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div>
          <div className={styles.newsItem}>
            <div className={styles.news_header}>

              <div className={styles.title_container}>
                <h4>{item.category}</h4>

                <h2>{item.title}</h2>

                <span>{new Date(item.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              
            </div>
            <div className={styles.news_image}>

            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className={styles.newsImage}
              />
            )}

            </div>
           
            <div className={styles.news_text}>
            <p>{item.content}</p>

            </div>

            <div className={styles.news_image}>
            {item.video_url && (
              <div className={styles.videoContainer}>
                <iframe
                  src={getYouTubeEmbedUrl(item.video_url)}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                ></iframe>
                <div style={{ display: "none", color: "red" }}>
                  Failed to load video
                </div>
              </div>
            )}

            

            </div>
              
            
            {item.video_file && (
              <div className={styles.videoContainer}>
                <video controls>
                  <source src={item.video_file} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;
