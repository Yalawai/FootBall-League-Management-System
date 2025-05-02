// LeagueTable.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import styles from '../styles/Table.module.css'; // Import the CSS module
import league_header from '../assets/LeagueHeader.png'

function LeagueTable({data=null}) {

   
  const [leagueTable, setLeagueTable] = useState([]);
  const [teamForm, setTeamForm] = useState([])
  

  useEffect(() => {
    if (data) {
      setLeagueTable(data);
    } else {
      api.get('api/league-table/')
        .then(response => {
          setLeagueTable(response.data);
          console.log(response.data);
        })
        .catch(error => console.log(error));
    }
  }, [data]);


  

  

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={league_header} alt="league_logo" />
      </header>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr className={styles.long}>
            <th className={styles.tableHeader}>Position</th>
            <th className={`${styles.tableHeader} ${styles.tableHeaderImage}`}>Club</th>
            <th className={styles.tableHeader}>Match</th>
            <th className={styles.tableHeader}>Won</th>
            <th className={styles.tableHeader}>Drawn</th>
            <th className={styles.tableHeader}>Lost</th>
            <th className={styles.tableHeader}>GF</th>
            <th className={styles.tableHeader}>GA</th>
            <th className={styles.tableHeader}>GD</th>
            <th className={styles.tableHeader}>Points</th>
            <th className={styles.tableHeader}>Form</th>
          </tr>
          <tr className={styles.short}>
            <th className={styles.tableHeader}>Position</th>
            <th className={`${styles.tableHeader} ${styles.tableHeaderImage}`}>Club</th>
            
            <th className={styles.tableHeader}>Points</th>
            
          </tr>
        </thead>
        <tbody>
          {leagueTable.map((team, index) => (
            <tr key={team.id || index}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={`${styles.tableCell} ${styles.club}` }>
                <img src={team.team_logo} alt={`${team.team_name} logo`} className={styles.teamLogo} />
                <span className={`${styles.fullName} ${styles.clubName}` }>{team.team_name}</span>
                
              </td>
              <td className={`${styles.tableCell} ${styles.info} ${styles.col}`}>{team.matches_played}</td>
              <td className={`${styles.tableCell} ${styles.info} ${styles.col}`}>{team.wins}</td>
              <td className={`${styles.tableCell} ${styles.info} ${styles.col}`}>{team.draws}</td>
              <td className={`${styles.tableCell} ${styles.info} ${styles.col}`}>{team.losses}</td>
              <td className={`${styles.tableCell} ${styles.info} ${styles.col}`}>{team.goals_scored}</td>
              <td className={`${styles.tableCell} ${styles.info} ${styles.col}`}>{team.goals_conceded}</td>
              <td className={`${styles.tableCell} ${styles.info} ${styles.col}`}>{team.goal_difference}</td>
              <td className={`${styles.tableCell} ${styles.info} `}><b>{team.points}</b></td>
              <td className={`${styles.tableCell} ${styles.info} ${styles.col}`}>
                <div className={styles.form_container}>
                {team.recent_form.map((form, index) => (
                  <div key={index} className={`${styles.form} ${styles[form]}`}>{form}</div>

))}
                  
                </div>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeagueTable;
