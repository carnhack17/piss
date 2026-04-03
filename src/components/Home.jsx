
function Home({ proposerImg, chercherImg, setMode }) {
  return (
    <div className="split-container">
      {/* Proposer un logement */}
      <div
        className="split-item"
        style={{ backgroundImage: `url(${proposerImg})` }}
        onClick={() => setMode("propose")}
      >
        <span>🏠 Proposer un logement</span>
        <div className="overlay"></div>
      </div>

      {/* Chercher une colocation */}
      <div
        className="split-item"
        style={{ backgroundImage: `url(${chercherImg})` }}
        onClick={() => setMode("cherche")}
      >
        <span>🔍 Chercher une colocation</span>
        <div className="overlay"></div>
      </div>
    </div>
  );
}

export default Home;