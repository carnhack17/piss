import { useState } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

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

    // 🔹 Génération du token de suppression
    const deleteToken = uuidv4();

    // 🔹 Construction du lien WhatsApp
    const cleanPhone = phone.replace(/\D/g, ""); // retire +, espaces, etc.
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      "Merci pour ta publication ! Pour supprimer ton annonce, clique ici : " +
      `https://piss-seven.vercel.app/delete/${deleteToken}`
    )}`;

    // 🔹 Essaie d'ouvrir WhatsApp d'abord
    const waWindow = window.open(waUrl, "_blank");
    if (!waWindow) {
      alert("Impossible d'ouvrir WhatsApp. L'annonce n'a pas été postée.");
      return;
    }

    // 🔹 Insertion Supabase uniquement si WhatsApp s'ouvre
    const { data, error } = await supabase
      .from("post")
      .insert([
        {
          name,
          phone,
          city,
          quartier,
          budget: Number(budget),
          habits,
          delete_token: deleteToken,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement !");
      return;
    }

    setToast("✅ Publication réussie !");

    onSubmit({ name, phone, city, quartier, budget, habits });

    setName("");
    setPhone("");
    setCity("");
    setQuartier("");
    setBudget("");
    setHabits({ fumeur: "", proprete: "", visites: "", vie_nocturne: "", travail: "" });

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

        <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              width: "200px",
              textAlign: "center",
            }}
          >
            Publier
          </button>
        </div>
      </form>

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

export default Form;