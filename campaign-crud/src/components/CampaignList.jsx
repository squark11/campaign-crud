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
    <table className="campaign-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Keywords</th>
          <th>Bid (PLN)</th>
          <th>Fund (PLN)</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((c) =>
          editingId === c.id ? (
            <tr key={c.id}>
              <td>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </td>
              <td>
                <input
                  name="keywords"
                  value={editForm.keywords}
                  onChange={handleEditChange}
                  required
                />
              </td>
              <td>
                <input
                  name="bid"
                  type="number"
                  value={editForm.bid}
                  onChange={handleEditChange}
                  required
                />
              </td>
              <td>
                <input
                  name="fund"
                  type="number"
                  value={editForm.fund}
                  onChange={handleEditChange}
                  required
                />
              </td>
              <td>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                </select>
              </td>
              <td className="actions">
                <button type="submit" onClick={handleEditSubmit}>
                  Save
                </button>
                <button
                  type="button"
                  className="cancel"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ) : (
            <tr key={c.id}>
              <td>
                <strong>{c.name}</strong>
              </td>
              <td>{c.keywords}</td>
              <td>{c.bid} PLN</td>
              <td>{c.fund} PLN</td>
              <td>
                {c.status === "on" ? (
                  <span className="status on">On</span>
                ) : (
                  <span className="status off">Off</span>
                )}
              </td>
              <td className="actions">
                <button onClick={() => startEditing(c)}>Edit</button>
                <button
                  className="cancel"
                  onClick={() => handleDelete(c.id, c.fund)}
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};
