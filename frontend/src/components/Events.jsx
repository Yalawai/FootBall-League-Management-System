import React from 'react';
import styles from '../styles/Events.module.css';
import goal from '../assets/goal.png'
import injured from '../assets/injured.png'
import red from '../assets/red.png'
import yellow from '../assets/yellow.png'
import subsitution from '../assets/subsitution.png'

const eventTypeImages = {
  G: goal,
  I: injured,
  Y: yellow,
  R: red,
  S: subsitution,
  F: '/path/to/foul.png',
  O: '/path/to/offside.png',
  C: '/path/to/corner.png',
  FK: '/path/to/free_kick.png',
  SG: '/path/to/self_goal.png',
  A: '/path/to/assist.png',
  P: '/path/to/penalty.png',
};



function Events ({ event })  {
    const eventImage = eventTypeImages[event.eventType];


    return (
      <div key={event.id} className={`${styles.eventItem}`}>
        <span className={styles.eventTime}>{`${event.event_minute}${event.extra_time ? ` + ${event.extra_time}`: ""}"`}</span>
        <span className={styles.eventPlayer}>{event.player_name}</span>
        <img src={eventImage} alt={event.eventType} className={styles.eventIcon} />

        {event.eventType === 'S' && (
          <span className={styles.substitutePlayer}>
            {event.substitute_player_name}
          </span>
        )}
        
      </div>
    );
  
};



export default Events;
