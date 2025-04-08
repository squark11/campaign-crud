import { useEffect, useState } from "react";
import { CampaignForm } from "./components/CampaignForm";
import { CampaignList } from "./components/CampaignList";
import { Balance } from "./components/Balance";

function App() {
  const URL = "https://campaign-crud.onrender.com/api";
  const [campaigns, setCampaigns] = useState([]);
  const [balance, setBalance] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);

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
    fetch(URL+"/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data));

    fetch(URL+"/balance")
      .then((res) => res.json())
      .then((data) => setBalance(data.balance));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const res = await fetch(URL+"/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setCampaigns((prev) => [...prev, data]);
      setBalance((prev) => prev - parseFloat(form.fund));
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
    const res = await fetch(URL+`/campaigns/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      setBalance((prev) => prev + parseFloat(fund));
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

    const oldCampaign = campaigns.find((c) => c.id === editingId);
    const oldFund = parseFloat(oldCampaign.fund);
    const newFund = parseFloat(editForm.fund);

    const fundDifference = newFund - oldFund;

    if (fundDifference > 0 && fundDifference > balance) {
      alert(
        `Brak wystarczających środków! Brakuje ${fundDifference - balance} zł`
      );
      return;
    }

    const updatedCampaigns = campaigns.map((campaign) =>
      campaign.id === editingId ? editForm : campaign
    );

    await fetch(URL+`/campaigns/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    setCampaigns(updatedCampaigns);
    setBalance(balance - fundDifference);
    cancelEditing();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Campaign List</h1>
      <Balance balance={balance} />

      <button onClick={() => setModalOpen(true)}>Add Campaign</button>

      <CampaignForm
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        handleChange={handleChange}
        handleSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
          setModalOpen(false);
        }}
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
