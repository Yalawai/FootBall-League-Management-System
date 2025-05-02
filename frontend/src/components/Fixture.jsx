// LeagueTable.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import styles from '../styles/Fixture.module.css'; // Import the CSS module
import league_logo from '../assets/LeagueLogo.png'

function Fixture({data = null}) {
  const [groupedFixtures, setGroupedFixtures] = useState([]);


 
  

  useEffect(() => {
    if (data) {
      setGroupedFixtures(data);
    } else {
      api.get('api/fixtures/')
        .then(response => {
          setGroupedFixtures(response.data.results.slice(0,5));
          
        })
        .catch(error => console.log(error));
    }
  }, [data]);



  return (
    <div className={styles.fixtureContainer}>
      <div className={styles.header}><h1>Fixtures</h1></div>
      {groupedFixtures.map((group, index) => (
        <div key={index} className={styles.fixtureGroup}>
          <div className={styles.fixtureDate}>
            <h2>{group.date}</h2>
            <img className={styles.league_logo} src={league_logo} alt="league_logo" />
          
          </div>
          {group.fixtures.map((fixture, index) => (
            <div key={index} className={styles.fixtureItem}>
              <div className={styles.team_left}>
              <h4 className={styles.team_name}>{fixture.home_team_name}</h4>
                <img src={fixture.home_team_logo} alt={`${fixture.home_team_name} logo`} className={styles.teamLogo} />
                
              </div>
              <div className={styles.matchInfo}>
                <span>{fixture.formatted_time}</span>
              </div>
              <div className={styles.team_right}>
                
                <img src={fixture.away_team_logo} alt={`${fixture.away_team_name} logo`} className={styles.teamLogo} />
                <h4 className={styles.team_name}>{fixture.away_team_name}</h4>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Fixture;
