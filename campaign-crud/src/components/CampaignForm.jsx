export const CampaignForm = ({ form, handleChange, handleSubmit }) => {
  return (
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
  );
};
