import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

function DeletePost() {
  const { token } = useParams();

  useEffect(() => {
    const deletePost = async () => {
      const { error } = await supabase
        .from("post")
        .delete()
        .eq("delete_token", token);

      if (error) {
        alert("❌ Erreur suppression");
        return;
      }

      alert("✅ Annonce supprimée");

      // 🔥 retour + refresh
      window.location.href = "/";
    };

    deletePost();
  }, [token]);

  return <p>Suppression en cours...</p>;
}

export default DeletePost;