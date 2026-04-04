import { useState } from "react";
import { supabase } from "../supabaseClient";

function Form() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [phone, setPhone] = useState("");

  const generateToken = () => {
    return Math.random().toString(36).substring(2, 12);
  };

  const formatPhone = (num) => {
    let cleaned = num.replace(/\D/g, "");

    // si commence par 0 → on suppose Côte d’Ivoire
    if (cleaned.startsWith("0")) {
      cleaned = "225" + cleaned.substring(1);
    }

    return cleaned;
  };

  const isValidPhone = (num) => {
    return /^[0-9]{8,15}$/.test(num);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPhone = formatPhone(phone);

    if (!isValidPhone(formattedPhone)) {
      alert("❌ Numéro invalide");
      return;
    }

    const delete_token = generateToken();

    const { error } = await supabase.from("post").insert([
      {
        name,
        city,
        budget,
        phone: formattedPhone,
        delete_token,
      },
    ]);

    if (error) {
      alert("❌ Erreur lors de la publication");
      return;
    }

    // 🔥 lien de suppression (ton domaine vercel)
    const deleteLink = `https://piss-seven.vercel.app/delete/${delete_token}`;

    const message = `📢 Nouvelle annonce GBONHI

👤 Nom: ${name}
📍 Ville: ${city}
💰 Budget: ${budget}

❌ Supprimer mon annonce:
${deleteLink}`;

    // 🔥 ouverture WhatsApp
    window.open(
      `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // 🔥 refresh app
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Ville"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Numéro WhatsApp"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      {/* 🔥 TON BOUTON (inchangé UI) */}
      <button type="submit">Publier</button>
    </form>
  );
}

export default Form;