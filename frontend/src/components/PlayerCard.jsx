import React from "react";

import "../styles/PlayerCard.module.css";

function PlayerCard({ player }) {
  return (
    <div className="player-card">
      <div className="player-card-container">
        <div className="card-header">
          <img
            src={`${player.player_img}`}
            alt="Player-image"
            className="player-image"
          />
          <div className="side-bar">
            <img
              src={`${player.team.logo}`}
              alt="team logo"
              className="team-logo"
            />

            <span className="player-position">
              {player.position.map((pos) => pos.name).join(" ")}
            </span>
          </div>
        </div>

        <div className="card-content">
          <p className="player-name">{player.name}</p>
          <div className="player-stats">
            <p>{player.dateOfBirth}</p>
            <p>{player.dzongkhag}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
