import { useState } from "react";
import { supabase } from "../supabaseClient";

function Form() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 format simple (comme avant)
    const formattedPhone = phone.replace(/\D/g, "");

    const delete_token = Math.random().toString(36).substring(2, 12);

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
      console.log(error);
      alert("Erreur lors de la publication");
      return;
    }

    // 🔥 lien delete
    const deleteLink = `https://piss-seven.vercel.app/delete/${delete_token}`;

    const message = `Nouvelle annonce GBONHI

Nom: ${name}
Ville: ${city}
Budget: ${budget}

Supprimer:
${deleteLink}`;

    // 🔥 ouverture WhatsApp (comme ton ancien code)
    window.open(
      `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Ville"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <input
        type="text"
        placeholder="Numéro WhatsApp"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button type="submit">Publier</button>
    </form>
  );
}

export default Form;