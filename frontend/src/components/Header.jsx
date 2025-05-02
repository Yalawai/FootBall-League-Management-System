import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import api from '../api';
import Logo from '../assets/LeagueLogo.png'
import FederationLogo from '../assets/FederationLogo.png'

function NavigationHeader(){

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api.get('api/teams/')
      .then(response => {
        setTeams(response.data)
        console.log(response.data)
      }
       )
      .catch(error => console.log(error));
      
  }, []);




  return (
    <>
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={Logo} alt="Logo" />
        
      </div>
      <nav>
        <ul className={styles.navList}>
          <li>
            <Link to="/" className={styles.navItem}>Home</Link>
          </li>
          <li>
            <Link to="/fixtures" className={styles.navItem}>Fixture</Link>
          </li>
          <li>
            <Link to="/matches" className={styles.navItem}>Matches</Link>
          </li>
          <li>
            <Link to="/league" className={styles.navItem}>League Table</Link>
          </li>
          <li>
            <Link to="/news_list" className={styles.navItem}>News</Link>
          </li>
          <li>
            <Link to="/about" className={styles.navItem}>About</Link>
          </li>
        </ul>
      </nav>

      <div className={styles.federation_logo}>
        <img src={FederationLogo} alt="Federation_Logo" />
        
      </div>

      
    </header>
    <div className={styles.team_list}>
       
    <ul>
    {teams.map((team, idx )=> (
      <li key={team.id || idx}><img src={team.logo} alt="teamlogo" /></li>
    ))}
  </ul>

    

  </div>
  </>
  );
};

export default NavigationHeader;
