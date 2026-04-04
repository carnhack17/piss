import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import { supabase } from "../supabaseClient";

function MatchList({ user }) {
  const [post, setPost] = useState([]);
  const [index, setIndex] = useState(0);

  const fetchPost = async () => {
    const { data, error } = await supabase.from("post").select("*");

    if (error) {
      console.log(error);
      return;
    }

    setPost(data);
    setIndex(0); // 🔥 reset cartes
  };

  useEffect(() => {
    fetchPost();
  }, [user]);

  const filtered =
    post?.filter(
      (p) =>
        p.city?.toLowerCase().trim() === user.city?.toLowerCase().trim() &&
        Math.abs(p.budget - user.budget) <= 20000
    ) || [];

  const current = filtered[index];

  const message = current
    ? `Salut, je suis intéressé par ton annonce à ${current.city}`
    : "";

  const handleSwipe = (dir) => {
    if (dir === "left" && current) {
      window.open(
        `https://wa.me/${current.phone}?text=${encodeURIComponent(message)}`
      );
    }

    if (index + 1 >= filtered.length) {
      fetchPost(); // 🔥 recharge automatiquement
    } else {
      setIndex(index + 1);
    }
  };

  if (!current)
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        ❌ Aucun résultat
        <br />
        🔄 Rechargement...
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <TinderCard
        key={current.id}
        onSwipe={handleSwipe}
        preventSwipe={["up", "down"]}
      >
        <div
          style={{
            background: "#e3f2fd",
            padding: "30px",
            borderRadius: "20px",
            maxWidth: "700px",
            margin: "auto",
          }}
        >
          <h3>{current.name}</h3>
          <p>{current.city}</p>
          <p>{current.budget} FCFA</p>

          {/* 🔹 indication swipe */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <span>⬅️ Contacter</span>
            <span>Passer ➡️</span>
          </div>
        </div>
      </TinderCard>
    </div>
  );
}

export default MatchList;