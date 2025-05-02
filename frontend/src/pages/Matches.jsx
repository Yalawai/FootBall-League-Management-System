import React, { useEffect, useState } from "react";
import api from "../api";
import styles from "../styles/Matches.module.css";
import Events from "../components/Events";
import NavigationHeader from "../components/Header"

function Matches() {
  const [matches, setMatches] = useState([]);
  const [events, setEvents] = useState([]); // State to store events

  useEffect(() => {
    let isMounted = true;

    // Fetch matches and events data from API
    api
      .get("api/matches/")
      .then((response) => {
        if (isMounted) {
          setMatches(response.data);
          console.log(response.data);
          // Extract and set events from the response data
          const allEvents = response.data.flatMap((match) => match.events);
          setEvents(allEvents);
        }
      })
      .catch((error) => console.log(error));

    const socket = new WebSocket("ws://127.0.0.1:8000/ws/matches/");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = function (event) {
      
      if (isMounted){

        const data = JSON.parse(event.data);


        if (data.type === "match_update") {
          // Update match data
          setMatches((prevMatches) =>
            prevMatches.map((match) =>
              match.id === data.message.id
                ? {
                    ...match,
                    homeScore: data.message.homeScore,
                    awayScore: data.message.awayScore,
                  }
                : match
            )
          );
        } else if (data.type === "event_update") {
          // Update event data
          setEvents((prevEvents) => [...prevEvents, data.message]);
        }
      }
      
      

      
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    return () => {
      isMounted = false;
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, []);

  return (
    <div>
      <NavigationHeader/>
      <div className={styles.container}>
        <h1>Matches</h1>
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <div key={index}>
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
                  <span className={styles.team_name} >{match.away_team_name}</span>
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
          ))
        ) : (
          <p>No matches available.</p>
        )}
      </div>
    </div>
  );
}

export default Matches;
