import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState("Hooligan64");
  const [userData, setUserData] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://lichess.org/api/user/${query}`);
      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();

      setUserData({
        id: data.id,
        rating: data.perfs.blitz.rating,
        matchesPlayed: data.count.all,
        winRate: ((data.count.win / data.count.all) * 100).toFixed(2)
      });

      // Fetch recent games
      const recentGamesResponse = await fetch(`https://lichess.org/api/games/user/${query}?max=10`);
      const recentGamesData = await recentGamesResponse.json();
      setRecentGames(recentGamesData.games);

      setError(null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Please enter a valid username");
    }
  };

  const handleSearchClick = async () => {
    await fetchData();
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="wrapper">
          <div className="input-container">
            <input
              className="input-field"
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Enter Username"
            />
            <button className="search-button" onClick={handleSearchClick}>Find</button>
          </div>

          {userData && (
            <div className="user-info">
              <p>Username: {userData.id}</p>
              <p>Rating: {userData.rating}</p>
              <p>Matches Played: {userData.matchesPlayed}</p>
              <p>Win Rate: {userData.winRate}%</p>
            </div>
          )}

          {recentGames.length > 0 && (
            <div className="recent-games">
              <h2>Recent Games:</h2>
              <ul>
                {recentGames.map((game) => (
                  <li key={game.id}>{game.end_time} - {game.result}</li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
