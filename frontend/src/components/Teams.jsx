
import React, { useEffect, useState } from 'react';
import api from '../api';

function Teams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api.get('api/teams/')
      .then(response => setTeams(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h1>Teams</h1>
      <ul>
        {teams.map(team => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Teams;
