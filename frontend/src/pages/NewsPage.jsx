import React, { useEffect, useState } from "react";
import api from "../api";
import styles from "../styles/NewsPage.module.css";
import NavigationHeader from "../components/Header";
import NewsItem from "../components/NewsItem";

function NewsPage() {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
      fetchNews(currentPage);
    }, [currentPage]);
  
    const fetchNews = (page) => {
      api
        .get(`api/news_list/?page=${page}`)
        .then((response) => {
          setNews(response.data.results);
          console.log(response.data);
          setTotalPages(Math.ceil(response.data.count / 10));
          console.log(response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching news:", error);
          alert("An error occurred while fetching news.");
        });
    };

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };
  

  return (
    <div>
    <NavigationHeader />
      <div className={styles.container}>
        <h1>News</h1>
        <div className={styles.news_list}>
        {news.map((item, index) => (
          <NewsItem item = {item} key={index} varient='newsList'/>
        ))}
      </div>
        
     </div> 

     <div className={styles.pagination}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>    
    </div>
  );
}

export default NewsPage;
