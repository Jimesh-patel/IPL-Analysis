import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const players = ['Abdul Samad', 'Abhinav Manohar', 'Abhishek Sharma', 'Abishek Porel', 'Akash Deep', 'Akash Madhwal', 'Alzarri Joseph', 'Angkrish Raghuvanshi', 'Anmolpreet Singh', 'Anshul Kamboj', 'Anuj Rawat', 'Anukul Roy', 'Arjun Tendulkar', 'Arshad Khan', 'Arshdeep Singh', 'Arshin Kulkarni', 'Ashutosh Sharma', 'Ashwin', 'Atharva Taide', 'Avesh Khan', 'Axar', 'Ayush Badoni', 'Azmatullah', 'Bairstow', 'Bhui', 'Bhuvneshwar', 'Boult', 'Brevis', 'Bumrah', 'Buttler', 'Chahal', 'Chahar', 'Chakaravarthy', 'Chameera', 'Chawla', 'Cummins', 'Darshan Nalkande', 'Dhawan', 'Dhoni', 'Dhruv Jurel', 'Ferguson', 'Ferreira', 'Fraser-McGurk', 'Gaikwad', 'Gerald Coetzee', 'Gowtham', 'Green', 'Gulbadin', 'Gurbaz', 'Hardik Pandya', 'Harpreet Brar', 'Harpreet Singh', 'Harshal Patel', 'Harshit Rana', 'Head', 'Hetmyer', 'Himanshu Sharma', 'Hooda', 'Ishan Kishan', 'Ishant', 'J Richardson', 'Jadeja', 'Jaiswal', 'Jitesh Sharma', 'Joshua Little', 'Karn Sharma', 'Karthik', 'Kartik Tyagi', 'Kaverappa', 'Khaleel Ahmed', 'Klaasen', 'Kohler-Cadmore', 'Kohli', 'Krunal Pandya', 'Kuldeep Sen', 'Kuldeep Yadav', 'Kushagra', 'Kwena Maphaka', 'Lalit Yadav', 'Livingstone', 'Lomror', 'M Siddharth', 'Maharaj', 'Manav Suthar', 'Manish Pandey', 'Marco Jansen', 'Markande', 'Markram', 'Matt Henry', 'Maxwell', 'Mayank', 'Mayank Dagar', 'Mayank Yadav', 'Miller', 'Mishra', 'Mitchell', 'Mitchell Marsh', 'Moeen Ali', 'Mohit Sharma', 'Mohsin Khan', 'Mukesh Choudhary', 'Mukesh Kumar', 'Mustafizur', 'N Thushara', 'Nabi', 'Naman Dhir', 'Nandre Burger', 'Narine', 'Nathan Ellis', 'Naveen-ul-Haq', 'Nehal Wadhera', 'Nitish Rana', 'Nitish Reddy', 'Noor Ahmad', 'Nortje', 'Padikkal', 'Pant', 'Pathirana', 'Philip Salt', 'Pooran', 'Powell', 'Prabhsimran', 'Prabhudessai', 'Prithvi Shaw', 'Rabada', 'Rahane', 'Rahul', 'Rahul Chahar', 'Rahul Tewatia', 'Rajat Patidar', 'Ramandeep Singh', 'Rashid Khan', 'Rasikh Salam', 'Ravi Bishnoi', 'Ravindra', 'Raza', 'Richard Gleeson', 'Rinku Singh', 'Rishi Dhawan', 'Riyan Parag', 'Rohit', 'Rossouw', 'Russell', 'Saha', 'Sai Kishore', 'Sai Sudharsan', 'Sam Curran', 'Sameer Rizvi', 'Samson', 'Sandeep Sharma', 'Santner', 'Sanvir Singh', 'Saurav Chauhan', 'Shahbaz Ahmed', 'Shahrukh Khan', 'Shai Hope', 'Shamar Joseph', 'Shams Mulani', 'Shankar', 'Sharath BR', 'Shashank Singh', 'Shepherd', 'Shivam Dube', 'Shivam Singh', 'Shreyas Gopal', 'Shreyas Iyer', 'Shubham Dubey', 'Shubman Gill', 'Simarjeet Singh', 'Siraj', 'Spencer Johnson', 'Starc', 'Stoinis', 'Sumit Kumar', 'Suryakumar Yadav', 'Suyash Sharma', 'Swapnil Singh', 'T Natarajan', 'Tanush Kotian', 'Thakur', 'Theekshana', 'Tilak Varma', 'Tim David', 'Topley', 'Tripathi', 'Tristan Stubbs', 'Turner', 'Tushar Deshpande', 'Umesh Yadav', 'Umran Malik', 'Unadkat', 'V Viyaskanth', 'Vaibhav Arora', 'Venkatesh Iyer', 'Vijaykumar Vyshak', 'Wade', 'Warner', 'Warrier', 'Washington Sundar', 'Will Jacks', 'Williams', 'Williamson', 'Wood', 'Yash Dayal', 'Yash Thakur', 'Yudhvir Singh', 'de Kock', 'du Plessis'];

const venues = [
  'MA Chidambaram Stadium, Chennai',
  'Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur, Chandigarh',
  'Eden Gardens, Kolkata',
  'Sawai Mansingh Stadium, Jaipur',
  'Narendra Modi Stadium, Ahmedabad',
  'M.Chinnaswamy Stadium, Bengaluru',
  'Rajiv Gandhi International Stadium, Hyderabad',
  'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow',
  'Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam',
  'Wankhede Stadium, Mumbai',
  'Arun Jaitley Stadium, Delhi',
  'Himachal Pradesh Cricket Association Stadium, Dharamsala',
  'Barsapara Cricket Stadium, Guwahati'
];

const teams = [
  'KKR', 'RCB', 'MI', 'CSK', 'SRH', 'DC', 'RR', 'PBKS', 'LSG', 'GT'
];

const Prediction = () => {
  const [savedOvers, setSavedOvers] = useState([]);
  const [currentOver, setCurrentOver] = useState({ total_runs: '', wickets: '' });
  const [metadata, setMetadata] = useState({
    venue: '',
    batting_team: '',
    bowling_team: '',
    batsman1: '',
    batsman2: '',
    bowler: '',
    cum_runs: '',
    cum_wickets: '',
    bowler_economy: '',
    over_number: '',
    cum_run_rate: '',
    partnership: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search states
  const [searchStates, setSearchStates] = useState({
    venue: { showSuggestions: false, filteredItems: [] },
    batsman1: { showSuggestions: false, filteredItems: [] },
    batsman2: { showSuggestions: false, filteredItems: [] },
    bowler: { showSuggestions: false, filteredItems: [] }
  });

  const handleCurrentOverChange = (field, value) => {
    setCurrentOver({ ...currentOver, [field]: value });
  };

  const handleMetadataChange = (e) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  // Search functionality
  const handleSearchChange = (field, value) => {
    setMetadata({ ...metadata, [field]: value });

    if (value.length > 0) {
      let items = [];
      if (field === 'venue') {
        items = venues.filter(venue =>
          venue.toLowerCase().includes(value.toLowerCase())
        );
      } else if (['batsman1', 'batsman2', 'bowler'].includes(field)) {
        items = players.filter(player =>
          player.toLowerCase().includes(value.toLowerCase())
        );
      }

      setSearchStates(prev => ({
        ...prev,
        [field]: { showSuggestions: true, filteredItems: items.slice(0, 5) }
      }));
    } else {
      setSearchStates(prev => ({
        ...prev,
        [field]: { showSuggestions: false, filteredItems: [] }
      }));
    }
  };

  const handleSuggestionClick = (field, value) => {
    setMetadata({ ...metadata, [field]: value });
    setSearchStates(prev => ({
      ...prev,
      [field]: { showSuggestions: false, filteredItems: [] }
    }));
  };

  const hideSuggestions = (field) => {
    setTimeout(() => {
      setSearchStates(prev => ({
        ...prev,
        [field]: { ...prev[field], showSuggestions: false }
      }));
    }, 200);
  };

  const handleSubmit = async () => {

    if (!currentOver.total_runs || !currentOver.wickets) {
      setError('Please fill in runs and wickets for current over');
      return;
    }

    metadata.cum_runs = currentOver.total_runs;
    metadata.cum_wickets = currentOver.wickets;

    const requiredFields = ['venue', 'batting_team', 'bowling_team', 'batsman1', 'batsman2', 'bowler', 'cum_runs', 'cum_wickets', 'bowler_economy', 'over_number', 'cum_run_rate', 'partnership'];
    for (let field of requiredFields) {
      if (!metadata[field]) {
        setError(`Please fill in ${field.replace('_', ' ')}`);
        return;
      }
    }
    setLoading(true);
    setError('');
    setPrediction(null);

    const newSavedOvers = [...savedOvers, currentOver];
    if (newSavedOvers.length > 5) {
      newSavedOvers.shift();
    }
    setSavedOvers(newSavedOvers);

    const lastOvers = [];
    for (let i = 0; i < 5; i++) {
      if (newSavedOvers[i]) {
        lastOvers.push(newSavedOvers[i]);
      } else {
        lastOvers.push({ total_runs: 0, wickets: 0 });
      }
    }

    try {
      const body = {
        last_overs: lastOvers.map(over => ({
          total_runs: Number(over.total_runs) || 0,
          wickets: Number(over.wickets) || 0,
        })),
        metadata: {
          ...metadata,
          cum_runs: Number(metadata.cum_runs),
          cum_wickets: Number(metadata.cum_wickets),
          bowler_economy: Number(metadata.bowler_economy),
          over_number: Number(metadata.over_number),
          cum_run_rate: Number(metadata.cum_run_rate),
          partnership: Number(metadata.partnership),
        }
      };

      const res = await fetch(`${API_BASE}/predict-runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Prediction failed');
      const data = await res.json();
      setPrediction(data.predicted_runs);
      setCurrentOver({ total_runs: '', wickets: '' });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>IPL Next Over Run Prediction</h2>

      {/* Display Saved Overs */}
      {savedOvers.length > 0 && (
        <div style={{ marginBottom: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
          <h3>Saved Overs ({savedOvers.length}/5):</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {savedOvers.map((over, idx) => (
              <div key={idx} style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: 4,
                border: '1px solid #ddd',
                minWidth: 80
              }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Over {idx + 1}</div>
                <div><strong>{over.total_runs}</strong> runs</div>
                <div><strong>{over.wickets}</strong> wickets</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <fieldset style={{ marginBottom: 16 }}>
          <legend>Current Over</legend>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <label>
              Runs:
              <input
                type="number"
                min="0"
                max="36"
                placeholder="0"
                value={currentOver.total_runs}
                onChange={e => handleCurrentOverChange('total_runs', e.target.value)}
                required
                style={{ width: 80, marginLeft: 8 }}
              />
            </label>
            <label>
              Wickets:
              <input
                type="number"
                min="0"
                max="6"
                placeholder="0"
                value={currentOver.wickets}
                onChange={e => handleCurrentOverChange('wickets', e.target.value)}
                required
                style={{ width: 80, marginLeft: 8 }}
              />
            </label>
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            {/* Venue Search */}
            <div style={{ position: 'relative' }}>
              <input
                name="venue"
                placeholder="Search Venue..."
                value={metadata.venue}
                onChange={e => handleSearchChange('venue', e.target.value)}
                onBlur={() => hideSuggestions('venue')}
                required
                style={{ padding: 8, width: '100%' }}
              />
              {searchStates.venue.showSuggestions && searchStates.venue.filteredItems.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  maxHeight: 200,
                  overflowY: 'auto',
                  zIndex: 1000
                }}>
                  {searchStates.venue.filteredItems.map((venue, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 8,
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                      }}
                      onMouseDown={() => handleSuggestionClick('venue', venue)}
                      onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                    >
                      {venue}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <select
                name="batting_team"
                value={metadata.batting_team}
                onChange={handleMetadataChange}
                required
                style={{ padding: 8 }}
              >
                <option value="">Batting Team</option>
                {teams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                name="bowling_team"
                value={metadata.bowling_team}
                onChange={handleMetadataChange}
                required
                style={{ padding: 8 }}
              >
                <option value="">Bowling Team</option>
                {teams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {/* Batsman 1 Search */}
              <div style={{ position: 'relative' }}>
                <input
                  name="batsman1"
                  placeholder="Search Batsman 1..."
                  value={metadata.batsman1}
                  onChange={e => handleSearchChange('batsman1', e.target.value)}
                  onBlur={() => hideSuggestions('batsman1')}
                  required
                  style={{ padding: 8, width: '100%' }}
                />
                {searchStates.batsman1.showSuggestions && searchStates.batsman1.filteredItems.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderTop: 'none',
                    maxHeight: 150,
                    overflowY: 'auto',
                    zIndex: 1000
                  }}>
                    {searchStates.batsman1.filteredItems.map((player, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: 6,
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          fontSize: 14
                        }}
                        onMouseDown={() => handleSuggestionClick('batsman1', player)}
                        onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                      >
                        {player}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Batsman 2 Search */}
              <div style={{ position: 'relative' }}>
                <input
                  name="batsman2"
                  placeholder="Search Batsman 2..."
                  value={metadata.batsman2}
                  onChange={e => handleSearchChange('batsman2', e.target.value)}
                  onBlur={() => hideSuggestions('batsman2')}
                  required
                  style={{ padding: 8, width: '100%' }}
                />
                {searchStates.batsman2.showSuggestions && searchStates.batsman2.filteredItems.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderTop: 'none',
                    maxHeight: 150,
                    overflowY: 'auto',
                    zIndex: 1000
                  }}>
                    {searchStates.batsman2.filteredItems.map((player, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: 6,
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          fontSize: 14
                        }}
                        onMouseDown={() => handleSuggestionClick('batsman2', player)}
                        onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                      >
                        {player}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bowler Search */}
              <div style={{ position: 'relative' }}>
                <input
                  name="bowler"
                  placeholder="Search Bowler..."
                  value={metadata.bowler}
                  onChange={e => handleSearchChange('bowler', e.target.value)}
                  onBlur={() => hideSuggestions('bowler')}
                  required
                  style={{ padding: 8, width: '100%' }}
                />
                {searchStates.bowler.showSuggestions && searchStates.bowler.filteredItems.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderTop: 'none',
                    maxHeight: 150,
                    overflowY: 'auto',
                    zIndex: 1000
                  }}>
                    {searchStates.bowler.filteredItems.map((player, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: 6,
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          fontSize: 14
                        }}
                        onMouseDown={() => handleSuggestionClick('bowler', player)}
                        onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                      >
                        {player}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <input
                name="bowler_economy"
                type="number"
                step="0.01"
                placeholder="Bowler Economy"
                value={metadata.bowler_economy}
                onChange={handleMetadataChange}
                required
                style={{ padding: 8 }}
              />
              <input
                name="over_number"
                type="number"
                placeholder="Over Number"
                value={metadata.over_number}
                onChange={handleMetadataChange}
                required
                style={{ padding: 8 }}
              />
              <input
                name="cum_run_rate"
                type="number"
                step="0.01"
                placeholder="Run Rate"
                value={metadata.cum_run_rate}
                onChange={handleMetadataChange}
                required
                style={{ padding: 8 }}
              />
            </div>

            <input
              name="partnership"
              type="number"
              placeholder="Partnership Runs"
              value={metadata.partnership}
              onChange={handleMetadataChange}
              required
              style={{ padding: 8 }}
            />
          </div>
        </fieldset>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            fontSize: 16,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Predicting...' : 'Submit Over & Predict'}
        </button>
      </div>

      {error && (
        <div style={{
          color: 'red',
          marginTop: 15,
          padding: 10,
          backgroundColor: '#ffebee',
          borderRadius: 4
        }}>
          {error}
        </div>
      )}

      {prediction !== null && (
        <div style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: '#e8f5e8',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#2e7d32' }}>
            Predicted Runs for Next Over: {prediction}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Prediction;