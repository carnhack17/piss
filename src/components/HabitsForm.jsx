import { useState } from "react";
import { supabase } from "../supabaseClient";

function HabitsForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [toast, setToast] = useState("");

  const [habits, setHabits] = useState({
    fumeur: "",
    proprete: "",
    visites: "",
    vie_nocturne: "",
    travail: "",
  });

  const [openCriteria, setOpenCriteria] = useState({
    fumeur: false,
    proprete: false,
    visites: false,
    vie_nocturne: false,
    travail: false,
  });

  const toggleCriteria = (field) => {
    setOpenCriteria({ ...openCriteria, [field]: !openCriteria[field] });
  };

  const handleSubmit = () => {
  if (!city || !budget) return alert("Ville et budget obligatoires !");
  for (let key in habits) if (!habits[key]) return alert(`Choisis "${key}" !`);

  // 🚫 Pas d'insert ici
  onSubmit({ name, phone, city, budget, habits });

  setToast("✅ Recherche définie !");
  setTimeout(() => setToast(""), 3000);
};

  const renderOptionGroup = (label, field, options) => (
    <div className="criteria-group">
      <label onClick={() => toggleCriteria(field)} className={openCriteria[field] ? "open" : ""}>
        {label} <span className="arrow">▼</span>
      </label>
      <div className="options-row" style={{ display: openCriteria[field] ? "flex" : "none" }}>
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            className={`option-btn ${habits[field] === opt.toLowerCase() ? "active" : ""}`}
            onClick={() => setHabits({ ...habits, [field]: opt.toLowerCase() })}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="form-container">
      <h2>🧠 Tes habitudes</h2>
      <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
      <input placeholder="Budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />

      {renderOptionGroup("Fumeur ?", "fumeur", ["Oui", "Non"])}
      {renderOptionGroup("Propreté ?", "proprete", ["Propre", "Moyen", "Bordel"])}
      {renderOptionGroup("Visites ?", "visites", ["Beaucoup", "Souvent", "Rarement"])}
      {renderOptionGroup("Vie nocturne ?", "vie_nocturne", ["Fêtard", "Calme", "Sort souvent"])}
      {renderOptionGroup("Travail ?", "travail", ["Étudiant", "Travailleur"])}

      <br />
      <button onClick={handleSubmit}>Continuer</button>

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

export default HabitsForm;