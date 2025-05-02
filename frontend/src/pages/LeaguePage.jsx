import NavigationHeader from "../components/Header";
import LeagueTable from "../components/LeagueTable";
import React, { useEffect, useState } from "react";
import api from "../api";
import styles from "../styles/LeaguePage.module.css";

function LeaguePage() {
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [tableData, setTableData] = useState(null);
  
    useEffect(() => {
      // Fetch the list of seasons
      api.get('api/seasons/')
        .then(response => {
          setSeasons(response.data);
          // Set the default selected season to the latest season
          if (response.data.length > 0) {
            setSelectedSeason(response.data[0].id); // Assuming each season has an `id` field
          }
        })
        .catch(error => console.log(error));
    }, []);
  
    useEffect(() => {
      // Fetch league table data when the selected season changes
      if (selectedSeason) {
        api.get(`api/league-table/?season=${selectedSeason}`)
          .then(response => {
            setTableData(response.data);
          })
          .catch(error => console.log(error));
      }
    }, [selectedSeason]);
  
    const handleSeasonChange = (event) => {
      setSelectedSeason(event.target.value);
    };
  
    const handleResetFilters = () => {
      if (seasons.length > 0) {
        setSelectedSeason(seasons[0].id);
      }
    };

  return (
    <div>
      <NavigationHeader />
      <div>
        <header className={styles.header}>
          <h2>Tables</h2>
        </header>
        <div className={styles.filters}>
          
          <div className={styles.filterItem}>
            <label>Filter by Season</label>
            <select value={selectedSeason} onChange={handleSeasonChange}>
              {seasons.map(season => (
                <option key={season.id} value={season.id}>
                  {season.name} {/* Assuming each season has a `name` field */}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.resetFilters}>
            <button onClick={handleResetFilters}>RESET FILTERS</button>
          </div>
        </div>
        <div className={styles.table_container}>
          <LeagueTable data={tableData} />

        </div>
      </div>
    </div>
  );
}

export default LeaguePage;
