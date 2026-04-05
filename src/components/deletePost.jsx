import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function DeletePost() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) return;

    const deletePost = async () => {
      // 🔍 vérifier si existe
      const { data } = await supabase
        .from("post")
        .select("*")
        .eq("delete_token", token)
        .single();

      if (!data) {
        setStatus("notfound");
        return;
      }

      // 🗑️ supprimer
      const { error } = await supabase
        .from("post")
        .delete()
        .eq("delete_token", token);

      if (error) {
        setStatus("error");
        return;
      }

      setStatus("success");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    };

    deletePost();
  }, [token]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
      {status === "loading" && <p>Suppression en cours...</p>}
      {status === "success" && <p>✅ Annonce supprimée</p>}
      {status === "notfound" && <p>❌ Lien invalide ou déjà utilisé</p>}
      {status === "error" && <p>❌ Erreur lors de la suppression</p>}
    </div>
  );
}

export default DeletePost;