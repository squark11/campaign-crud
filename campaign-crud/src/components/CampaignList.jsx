export const CampaignList = ({
  campaigns,
  editingId,
  editForm,
  handleEditChange,
  startEditing,
  cancelEditing,
  handleEditSubmit,
  handleDelete,
}) => {
  return (
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
  );
};
