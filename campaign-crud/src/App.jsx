import { useEffect, useState } from "react";

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [balance, setBalance] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [form, setForm] = useState({
    name: "",
    keywords: "",
    bid: "",
    fund: "",
    status: "on",
    town: "",
    radius: "",
  });

  //łączenie z backendem
  useEffect(() => {
    fetch("http://localhost:5000/api/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data));

    fetch("http://localhost:5000/api/balance")
      .then((res) => res.json())
      .then((data) => setBalance(data.balance));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja podstawowa
    if (
      !form.name ||
      !form.keywords ||
      !form.bid ||
      !form.fund ||
      !form.radius
    ) {
      alert("Uzupełnij wszystkie wymagane pola!");
      return;
    }

    const res = await fetch("http://localhost:5000/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setCampaigns((prev) => [...prev, data]);
      setBalance((prev) => prev - parseFloat(form.fund)); // aktualizacja salda
      setForm({
        name: "",
        keywords: "",
        bid: "",
        fund: "",
        status: "on",
        town: "",
        radius: "",
      });
    } else {
      alert(data.error || "Błąd dodawania kampanii");
    }
  };

  const handleDelete = async (id, fund) => {
    const res = await fetch(`http://localhost:5000/api/campaigns/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      setBalance((prev) => prev + parseFloat(fund)); // zwróć środki
    } else {
      alert("Błąd usuwania kampanii");
    }
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const startEditing = (campaign) => {
    setEditingId(campaign.id);
    setEditForm({ ...campaign });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:5000/api/campaigns/${editingId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      }
    );

    if (res.ok) {
      const updated = await res.json();
      setCampaigns((prev) =>
        prev.map((c) => (c.id === editingId ? updated : c))
      );
      setEditingId(null);
      setEditForm({});
    } else {
      alert("Błąd edycji kampanii");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Lista kampanii</h1>
      <p>
        <strong>Saldo konta:</strong> {balance} zł
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="name"
          placeholder="Nazwa kampanii"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="keywords"
          placeholder="Słowa kluczowe"
          value={form.keywords}
          onChange={handleChange}
          required
        />
        <input
          name="bid"
          placeholder="Kwota za kliknięcie"
          type="number"
          min="0.01"
          value={form.bid}
          onChange={handleChange}
          required
        />
        <input
          name="fund"
          placeholder="Budżet kampanii"
          type="number"
          min="0.01"
          value={form.fund}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="on">Włączona</option>
          <option value="off">Wyłączona</option>
        </select>
        <select name="town" value={form.town} onChange={handleChange}>
          <option value="">-- wybierz miasto --</option>
          <option value="Warszawa">Warszawa</option>
          <option value="Kraków">Kraków</option>
          <option value="Wrocław">Wrocław</option>
        </select>
        <input
          name="radius"
          placeholder="Promień w km"
          type="number"
          min="1"
          value={form.radius}
          onChange={handleChange}
          required
        />
        <button type="submit">Dodaj kampanię</button>
      </form>

      <ul>
        {campaigns.map((c) => (
          <li key={c.id}>
            {editingId === c.id ? (
              <form onSubmit={handleEditSubmit}>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="keywords"
                  value={editForm.keywords}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="bid"
                  type="number"
                  value={editForm.bid}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="fund"
                  type="number"
                  value={editForm.fund}
                  onChange={handleEditChange}
                  required
                />
                <button type="submit">Zapisz</button>
                <button type="button" onClick={cancelEditing}>
                  Anuluj
                </button>
              </form>
            ) : (
              <>
                <strong>{c.name}</strong> – {c.keywords} | Bid: {c.bid} zł |
                Fundusz: {c.fund} zł
                <button
                  onClick={() => startEditing(c)}
                  style={{ marginLeft: "1rem" }}
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.fund)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Usuń
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
