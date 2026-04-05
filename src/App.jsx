import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Form from "./components/Form";
import HabitsForm from "./components/HabitsForm";
import MatchList from "./components/MatchList";
import DeletePost from "./components/DeletePost"; // ⚠️ adapte si besoin

import proposerImg from "./components/images/proposer.jpg";
import chercherImg from "./components/images/chercher.jpg";

function Home({ post }) {
  const [mode, setMode] = useState(null);
  const [user, setUser] = useState(null);

  const handleCreate = (formData) => {
    setUser(formData);
    setMode(null);
  };

  const handleSearch = (formData) => {
    setUser(formData);
  };

  const backBtnStyle = {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 10,
    backgroundColor: "#f0f0f0",
    color: "#333",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div>
      {mode && (
        <button onClick={() => setMode(null)} style={backBtnStyle}>
          ← Retour
        </button>
      )}

      {!mode && (
        <div className="split-container">
          <div
            className="split-item"
            style={{ backgroundImage: `url(${proposerImg})` }}
            onClick={() => setMode("propose")}
          >
            <span>🏠 Proposer un logement</span>
          </div>
          <div
            className="split-item"
            style={{ backgroundImage: `url(${chercherImg})` }}
            onClick={() => setMode("cherche")}
          >
            <span>🔍 Chercher une colocation</span>
          </div>
        </div>
      )}

      {mode === "propose" && (
        <div
          className="mode-container"
          style={{ backgroundImage: `url(${proposerImg})` }}
        >
          <Form onSubmit={handleCreate} />
        </div>
      )}

      {mode === "cherche" && !user && (
        <div
          className="mode-container"
          style={{ backgroundImage: `url(${chercherImg})` }}
        >
          <HabitsForm onSubmit={handleSearch} />
        </div>
      )}

      {mode === "cherche" && user && (
        <div
          className="mode-container"
          style={{ backgroundImage: `url(${chercherImg})` }}
        >
          <MatchList post={post} user={user} />
        </div>
      )}
    </div>
  );
}

function App({ post }) {
  return (
    <Router>
      <Routes>
        {/* 🔥 TON APP NORMALE */}
        <Route path="/" element={<Home post={post} />} />

        {/* 🔥 LA ROUTE QUI MANQUAIT */}
        <Route path="/delete/:token" element={<DeletePost />} />
      </Routes>
    </Router>
  );
}

export default App;