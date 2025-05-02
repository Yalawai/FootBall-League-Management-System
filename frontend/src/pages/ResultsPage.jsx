import React, { useEffect, useState } from "react";
import api from "../api";
import styles from "../styles/ResultsPage.module.css";

import NavigationHeader from "../components/Header";
import ResultsItem from "../components/Results";

function Results() {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');




  useEffect(() => {
   
    api.get('api/seasons/')
      .then(response => {
        setSeasons(response.data);
        if (response.data.length > 0) {
          setSelectedSeason(response.data[0].id); 
        }
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {

    api.get('api/teams/')
      .then(response => {
        setTeams(response.data);
        console.log(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
  
    let query = `api/results_list/?season=${selectedSeason}`

    if (selectedTeam){
      query += `&team=${selectedTeam}`;
    }

    
      api.get(query)
        .then(response => {
          setResults(response.data.results);
          console.log(response.data);
        })
        .catch(error => console.log(error));
    
  }, [selectedSeason, selectedTeam]);

  

  




  useEffect(() => {
   fetchResults(currentPage)
  }, [currentPage]);


  


  const fetchResults = (page) => {
    api
      .get(`api/results_list/?page=${page}`)
      .then((response) => {
        setResults(response.data.results);
        console.log(response.data);
        setTotalPages(Math.ceil(response.data.count / 15));
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

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleResetFilters = () => {
    if (seasons.length > 0) {
      setSelectedSeason(seasons[0].id);
    }
    setSelectedTeam("")
  };

  return <div>
  <NavigationHeader/>
  <div className={styles.filters}>
        <div className={styles.filterItems}>
          <div className={styles.filterItem}>
            <label>Filter by Season</label>
            <select onChange={handleSeasonChange} value={selectedSeason}>
              {seasons.map(season => (
                <option key={season.id} value={season.id}>{season.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterItem}>
            <label>Filter by Team</label>
            <select onChange={handleTeamChange} value={selectedTeam}>
            <option  value={''}>All Club</option>
              {teams.map((team, index) => (
                <option key={index} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.resetFilters}>
            <button onClick={handleResetFilters}>RESET FILTERS</button>
          </div>
      </div>
  <div className={styles.container}>
    <h1>Results</h1>
    {
      results.map((match, index) => (
        <div key={index} >
         <ResultsItem match = {match}/>
          

        </div>
      ))
   }
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
</div>
}

export default Results;
