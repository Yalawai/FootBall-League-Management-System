import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import styles from "../styles/Matches.module.css";
import Events from "../components/Events";
import NavigationHeader from "../components/Header";

function Matches() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [events, setEvents] = useState([]); // State to store events

  useEffect(() => {
    // Fetch matches and events data from API
    api
      .get(`api/result/${id}`)
      .then((response) => {
        setMatch(response.data);
        console.log(response.data);
        // Extract and set events from the response data
        const allEvents = response.data.events;
        console.log(allEvents);
        setEvents(allEvents || []); // Ensure events is at least an empty array
      })
      .catch((error) => console.log(error));
  }, [id]); // Adding id as a dependency to re-fetch data when id changes

  return (
    <div>
      <NavigationHeader/>
      <div className={styles.container}>
        <h1>Matches</h1>
        {match ? (
          <div>
            <div className={styles.match}>
              <div className={`${styles.team}`}>
                <img
                  src={match.home_team_logo}
                  alt="home_team_logo"
                  className={styles.logo}
                />
                <span className={styles.team_name}>{match.home_team_name}</span>
              </div>
              <div className={styles.details}>
                <span>
                  {match.homeScore} - {match.awayScore}
                </span>
              </div>
              <div className={`${styles.team} ${styles.team_right}`}>
                <span className={styles.team_name}>{match.away_team_name}</span>
                <img
                  src={match.away_team_logo}
                  alt="away_team_logo"
                  className={styles.logo}
                />
              </div>
            </div>

            <div className={styles.events}>
              <div className={styles.events_left}>
                {events
                  .filter((event) => event.playMatch === match.id && event.player_team === match.home_team_name)
                  .map((event, idx) => (
                    <Events key={idx} event={event} />
                  ))}
              </div>
              <div className={styles.events_right}>
                {events
                  .filter((event) => event.playMatch === match.id && event.player_team !== match.home_team_name)
                  .map((event, idx) => (
                    <Events key={idx} event={event} />
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <p>No matches available.</p>
        )}
      </div>
    </div>
  );
}

export default Matches;
