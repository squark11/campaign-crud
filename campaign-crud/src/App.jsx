import { useEffect, useState } from "react";
import { CampaignForm } from "./components/CampaignForm";
import { CampaignList } from "./components/CampaignList";
import { Balance } from "./components/Balance";

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
      <Balance balance={balance} />

      <CampaignForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      <CampaignList
        campaigns={campaigns}
        editingId={editingId}
        editForm={editForm}
        handleEditChange={handleEditChange}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        handleEditSubmit={handleEditSubmit}
        handleDelete={handleDelete}
      />
    </div>
  );
}
export default App;
