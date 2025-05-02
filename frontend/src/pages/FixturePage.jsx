import React, { useEffect, useState } from 'react';
import NavigationHeader from "../components/Header";
import Fixture from "../components/Fixture";
import api from '../api';
import styles from '../styles/FixturePage.module.css';

function FixturePage() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    // Fetch seasons
    api.get('api/seasons/')
      .then(response => {
        setSeasons(response.data);
        if (response.data.length > 0) {
          setSelectedSeason(response.data[0].id); // Set the first season as default
        }
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    // Fetch fixtures for the selected season
    if (selectedSeason) {
      api.get(`api/fixtures/?season=${selectedSeason}`)
        .then(response => {
          setFixtures(response.data.results);
          console.log(response.data);
        })
        .catch(error => console.log(error));
    }
  }, [selectedSeason]);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  return (
    <div>
      <NavigationHeader />
      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <label>Filter by Season</label>
          <select onChange={handleSeasonChange} value={selectedSeason}>
            {seasons.map(season => (
              <option key={season.id} value={season.id}>{season.name}</option>
            ))}
          </select>
        </div>
      </div>
      <Fixture data={fixtures} />
    </div>
  );
}

export default FixturePage;
