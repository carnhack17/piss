import { useState } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid"; // Pour le token unique

function Form({ onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [quartier, setQuartier] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !city || !quartier || !budget) {
      alert("Remplis tous les champs !");
      return;
    }
    for (let key in habits) if (!habits[key]) return alert(`Choisis "${key}" !`);

    // 🔥 Génération du token de suppression
    const deleteToken = uuidv4();

    // 🔥 Insertion Supabase avec delete_token
    const { data, error } = await supabase
      .from("post")
      .insert([
        { name, phone, city, quartier, budget: Number(budget), habits, delete_token: deleteToken },
      ]);

    if (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement !");
      return;
    }

    // 🔥 Génération du lien de suppression
    const deleteLink = `https://ton-app.vercel.app/delete/${deleteToken}`;

    // 🔥 Envoi du lien via WhatsApp
    const waUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
      "Merci pour ta publication ! Pour supprimer ton annonce, clique ici : " + deleteLink
    )}`;
    window.open(waUrl, "_blank");

    setToast("✅ Publication réussie !");
    setTimeout(() => setToast(""), 3000);

    onSubmit({ name, phone, city, quartier, budget, habits });

    // Reset form
    setName("");
    setPhone("");
    setCity("");
    setQuartier("");
    setBudget("");
    setHabits({ fumeur: "", proprete: "", visites: "", vie_nocturne: "", travail: "" });
  };

  const renderOptionGroup = (label, field, options) => (
    <div className="criteria-group">
      <label
        onClick={() => toggleCriteria(field)}
        className={openCriteria[field] ? "open" : ""}
      >
        {label} <span className="arrow">▼</span>
      </label>
      <div
        className="options-row"
        style={{ display: openCriteria[field] ? "flex" : "none" }}
      >
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            className={`option-btn ${
              habits[field] === opt.toLowerCase() ? "active" : ""
            }`}
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
      <form onSubmit={handleSubmit}>
        <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Quartier" value={quartier} onChange={(e) => setQuartier(e.target.value)} />
        <input placeholder="Budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />

        {renderOptionGroup("Fumeur ?", "fumeur", ["Oui", "Non"])}
        {renderOptionGroup("Propreté ?", "proprete", ["Propre", "Moyen", "Bordel"])}
        {renderOptionGroup("Visites ?", "visites", ["Beaucoup", "Souvent", "Rarement"])}
        {renderOptionGroup("Vie nocturne ?", "vie_nocturne", ["Fêtard", "Calme", "Sort souvent"])}
        {renderOptionGroup("Travail ?", "travail", ["Étudiant", "Travailleur"])}

        <button type="submit">Publier</button>
      </form>

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

export default Form;