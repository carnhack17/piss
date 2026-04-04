import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import { supabase } from "../supabaseClient";

function MatchList({ user }) {
  const [post, setPost] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .eq("type", "propose");
      if (error) {
        console.log("Erreur Supabase:", error);
        return;
      }
      setPost(data);
    };
    fetchPost();
  }, []);

  const filtered = post?.filter(
    (p) =>
      p.city?.toLowerCase().trim() === user.city?.toLowerCase().trim() &&
      Math.abs(p.budget - user.budget) <= 20000
  ) || [];

  const calculateMatch = (post) => {
    let score = 0;
    if (user.habits.fumeur === post.habits?.fumeur) score += 30;
    if (user.habits.proprete === post.habits?.proprete) score += 30;
    if (user.habits.visites === post.habits?.visites) score += 20;
    if (user.habits.vie_nocturne === post.habits?.vie_nocturne) score += 10;
    if (user.habits.travail === post.habits?.travail) score += 10;
    return score;
  };

  const matches = filtered
    .map((p) => ({ ...p, score: calculateMatch(p) }))
    .sort((a, b) => b.score - a.score);

  const current = matches[index];
  if (!current) return <p style={{ color: "white" }}>❌ Aucun résultat trouvé</p>;

  const message = `Salut, je suis intéressé par ton annonce à ${current.city}`;
  const getScoreColor = (score) => (score >= 100 ? "#2ecc71" : score >= 50 ? "#f39c12" : "#e74c3c");

  const handleSwipe = (dir) => {
    if (dir === "right") setIndex(index + 1); // Passer
    if (dir === "left") {
      window.open(`https://wa.me/${current.phone}?text=${encodeURIComponent(message)}`);
      setIndex(index + 1); // Contacter
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: "white" }}>🔥 Meilleur match</h2>

      <TinderCard key={current.id} onSwipe={handleSwipe} preventSwipe={["up", "down"]}>
        <div style={styles.card}>
          <div style={styles.scoreContainer}>
            <div
              style={{
                ...styles.scoreFill,
                width: `${current.score}%`,
                backgroundColor: getScoreColor(current.score),
              }}
            />
            <span style={styles.scoreText}>{current.score}%</span>
          </div>

          <div style={styles.content}>
            <h3>{current.name}</h3>
            <p>{current.city}</p>
            {current.quartier && <p style={{ fontSize: "14px", color: "#666" }}>{current.quartier}</p>}
            <p>{current.budget.toLocaleString()} FCFA</p>
          </div>

          <div style={styles.habits}>
            <span style={styles.habitTag}>🚬 {current.habits?.fumeur}</span>
            <span style={styles.habitTag}>🧼 {current.habits?.proprete}</span>
            <span style={styles.habitTag}>🎉 {current.habits?.vie_nocturne}</span>
            <span style={styles.habitTag}>👥 {current.habits?.visites}</span>
            <span style={styles.habitTag}>💼 {current.habits?.travail}</span>
          </div>

          {/* 🔹 Indication visuelle du swipe */}
          <div style={styles.swipeHint}>
            <span>⬅️ Swipe pour Contacter</span>
            <span>Swipe pour Passer ➡️</span>
          </div>
        </div>
      </TinderCard>
    </div>
  );
}

export default MatchList;

const styles = {
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    overflowY: "auto",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "20px",
    padding: "32px",
    maxWidth: "700px",
    width: "90%",
    background: "#e3f2fd",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    transition: "transform 0.3s",
    position: "relative",
  },
  scoreContainer: {
    position: "relative",
    height: "20px",
    borderRadius: "10px",
    background: "#ddd",
    marginBottom: "12px",
    overflow: "hidden",
  },
  scoreFill: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 0.5s",
  },
  scoreText: {
    position: "absolute",
    top: "-25px",
    right: "0",
    fontWeight: "bold",
  },
  content: { textAlign: "center", marginBottom: "12px" },
  habits: {
    textAlign: "center",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
    flexWrap: "wrap",
    gap: "6px",
  },
  habitTag: { backgroundColor: "#f0f0f0", padding: "6px 12px", borderRadius: "12px" },
  swipeHint: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
    fontSize: "14px",
    color: "#555",
  },
};