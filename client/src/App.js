import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [armies, setArmies] = useState([]);
  const [selectedArmy, setSelectedArmy] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [armyList, setArmyList] = useState([]);

  // Fetch armies on component mount
  useEffect(() => {
    fetchArmies();
  }, []);

  const fetchArmies = async () => {
    try {
      const response = await fetch('/api/armies');
      if (response.ok) {
        const data = await response.json();
        setArmies(data);
      }
    } catch (err) {
      console.error('Error fetching armies:', err);
    }
  };

  const fetchUnits = async (armyId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/armies/${armyId}/units`);
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    } catch (err) {
      console.error('Error fetching units:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArmySelect = (army) => {
    setSelectedArmy(army);
    fetchUnits(army.id);
  };

  const parseCatalogs = async () => {
    try {
      const response = await fetch('/api/parse-catalogs', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        fetchArmies(); // Refresh list
        alert('Catalogs parsed successfully!');
      } else {
        alert('Error parsing catalogs');
      }
    } catch (err) {
      console.error('Error parsing catalogs:', err);
      alert('Error parsing catalogs');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Warhammer 40k Army Builder</h1>
        <button className="import-btn" onClick={parseCatalogs}>
          Import Catalog Files
        </button>
      </header>

      <div className="content">
        <div className="armies-section">
          <h2>Armies</h2>
          {armies.length === 0 ? (
            <p>No armies loaded. Click "Import Catalog Files" first.</p>
          ) : (
            <div className="army-list">
              {armies.map(army => (
                <button
                  key={army.id}
                  onClick={() => handleArmySelect(army)}
                  className={`army-btn ${selectedArmy?.id === army.id ? 'active' : ''}`}
                >
                  {army.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="units-section">
          <h2>{selectedArmy ? `${selectedArmy.name} Units` : 'Select an army'}</h2>
          {loading ? (
            <p>Loading units...</p>
          ) : units.length === 0 ? (
            <p>No units available.</p>
          ) : (
            <div className="units-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Points</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map(unit => (
                    <tr key={unit.id}>
                      <td>{unit.name}</td>
                      <td>{unit.points}</td>
                      <td>
                        <button className="add-btn">Add to Army</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
