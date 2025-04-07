import { useEffect, useState } from 'react';

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/campaigns')
      .then(res => res.json())
      .then(data => setCampaigns(data));

    fetch('http://localhost:5000/api/balance')
      .then(res => res.json())
      .then(data => setBalance(data.balance));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista kampanii</h1>
      <p><strong>Saldo konta:</strong> {balance} zł</p>
      <ul>
        {campaigns.map(c => (
          <li key={c.id}>
            <strong>{c.name}</strong> – {c.keywords} | Bid: {c.bid} zł | Fundusz: {c.fund} zł
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
