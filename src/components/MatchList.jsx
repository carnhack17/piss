import { useEffect, useState, useMemo } from "react";
import TinderCard from "react-tinder-card";
import { supabase } from "../supabaseClient";

function MatchList({ user }) {
  const [post, setPost] = useState([]);
  const [index, setIndex] = useState(0);
  const [swipeColor, setSwipeColor] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .eq("type", "propose");

      if (!error && isMounted) setPost(data);
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered =
    post?.filter(
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

  const matches = useMemo(
    () =>
      filtered
        .map((p) => ({ ...p, score: calculateMatch(p) }))
        .sort((a, b) => b.score - a.score),
    [filtered]
  );

  const current = matches[index];
  if (!current) return <p style={{ color: "white" }}>❌ Aucun résultat trouvé</p>;

  const message = `Salut, je suis intéressé par ton annonce à ${current.city}`;
  const getScoreColor = (score) =>
    score >= 100 ? "#2ecc71" : score >= 50 ? "#f39c12" : "#e74c3c";

  const handleSwipe = (dir) => {
    setIndex((prev) => prev + 1);
    setSwipeColor(null);

    if (dir === "left") {
      window.open(
        `https://wa.me/${current.phone}?text=${encodeURIComponent(message)}`
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: "white" }}>🔥 Meilleur match</h2>

      <TinderCard
        key={current.id}
        onSwipe={handleSwipe}
        onSwipeRequirementFulfilled={(dir) => {
          if (dir === "left") setSwipeColor("green");
          if (dir === "right") setSwipeColor("red");
        }}
        onSwipeRequirementUnfulfilled={() => setSwipeColor(null)}
        preventSwipe={["up", "down"]}
      >
        <div style={styles.card}>
          {/* Overlay couleur */}
          {swipeColor && (
            <div
              style={{
                ...styles.overlay,
                backgroundColor:
                  swipeColor === "green" ? "#2ecc71" : "#e74c3c",
              }}
            />
          )}

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
            {current.quartier && (
              <p style={{ fontSize: "14px", color: "#666" }}>
                {current.quartier}
              </p>
            )}
            <p>{current.budget.toLocaleString()} FCFA</p>
          </div>

          <div style={styles.habits}>
            <span style={styles.habitTag}>🚬 {current.habits?.fumeur}</span>
            <span style={styles.habitTag}>🧼 {current.habits?.proprete}</span>
            <span style={styles.habitTag}>🎉 {current.habits?.vie_nocturne}</span>
            <span style={styles.habitTag}>👥 {current.habits?.visites}</span>
            <span style={styles.habitTag}>💼 {current.habits?.travail}</span>
          </div>

          {/* Indications swipe */}
          <div style={styles.swipeHints}>
            <span style={styles.leftHint}>⬅️ Contacter</span>
            <span style={styles.rightHint}>Passer ➡️</span>
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
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "20px",
    padding: "32px",
    maxWidth: "900px",
    width: "95%",
    minHeight: "500px",
    background: "#e3f2fd",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.25,
    borderRadius: "20px",
    zIndex: 1,
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
  habitTag: {
    backgroundColor: "#f0f0f0",
    padding: "6px 12px",
    borderRadius: "12px",
  },
  swipeHints: {
    position: "absolute",
    bottom: "10px",
    width: "90%",
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "14px",
    opacity: 0.7,
  },
  leftHint: { color: "#2ecc71" },
  rightHint: { color: "#e74c3c" },
};