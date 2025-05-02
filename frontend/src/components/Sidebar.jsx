
import Fixture from "../components/Fixture";
import NavigationHeader from "../components/Header"
import React, { useEffect, useState } from 'react';
import api from '../api'
import styles from '../styles/Sidebar.module.css'
import LeagueTable from "../components/LeagueTable";


function Sidebar(){


    return (
    <div className="side_bar">
    
      <div className={styles.container}>
        <Fixture/>
      </div>

      <div className={styles.container}>
        <LeagueTable/>
      </div>

      

      </div>


    )
}

export default Sidebar