import React from "react";

export const CampaignForm = ({
  isOpen,
  onClose,
  form,
  handleChange,
  handleSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Campaign</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Campaign name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="keywords"
            placeholder="Keywords"
            value={form.keywords}
            onChange={handleChange}
            required
          />
          <input
            name="bid"
            placeholder="Bid (PLN)"
            type="number"
            min="1"
            value={form.bid}
            onChange={handleChange}
            required
          />
          <input
            name="fund"
            placeholder="Budget (PLN)"
            type="number"
            min="0"
            value={form.fund}
            onChange={handleChange}
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="on">Enabled</option>
            <option value="off">Disabled</option>
          </select>
          <select name="town" value={form.town} onChange={handleChange}>
            <option value="">-- select town --</option>
            <option value="Warszawa">Warsaw</option>
            <option value="Kraków">Krakow</option>
            <option value="Wrocław">Wroclaw</option>
          </select>
          <input
            name="radius"
            placeholder="Radius (km)"
            type="number"
            min="1"
            value={form.radius}
            onChange={handleChange}
            required
          />
          <div className="modal-actions">
            <button type="submit">Add Campaign</button>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
