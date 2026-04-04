import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import HabitsForm from "./components/HabitsForm";
import MatchList from "./components/MatchList";
import DeletePost from "./components/DeletePost";

import proposerImg from "./components/images/proposer.jpg";
import chercherImg from "./components/images/chercher.jpg";

function App({ posts }) {
  const [mode, setMode] = useState(null);
  const [user, setUser] = useState(null);

  const handleCreate = (formData) => {
    setUser(formData);
    setMode(null);
  };

  const handleSearch = (formData) => {
    setUser(formData);
  };

  const mainApp = (
    <div>
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
          <MatchList posts={posts} user={user} />
        </div>
      )}
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={mainApp} />
        <Route path="/delete/:token" element={<DeletePost />} />
      </Routes>
    </Router>
  );
}

export default App;