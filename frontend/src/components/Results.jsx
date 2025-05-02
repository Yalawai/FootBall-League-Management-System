import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import styles from "../styles/ResultsPage.module.css";



function ResultsItem({match}) {

    const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/result/${match.id}`);
  };


    return (
        <div className={styles.match_container } onClick={handleClick} >

          <div className={styles.match } >
            <div className={`${styles.team}`}>
              <span className={styles.team_name}>{match.home_team_name}</span>
              <img
                src={match.home_team_logo}
                alt="home_team_logo"
                className={styles.logo}
              />
            </div>
            <div className={styles.details}>
              
              <span>
                {match.homeScore} - {match.awayScore}
              </span>
            </div>
            <div className={`${styles.team} ${styles.team_right}`}>
              <img
                src={match.away_team_logo}
                alt="away_team_logo"
                className={styles.logo}
              />
              <span className={styles.team_name} >{match.away_team_name}</span>
            </div>
          </div>

          <div className={styles.playfield}>
            {match.playField}
          </div>

          <div className={styles.date}>
            {new Date(match.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>


          </div>

    )
}

export default ResultsItem


