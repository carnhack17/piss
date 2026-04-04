import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function DeletePost() {
  const { token } = useParams();

  useEffect(() => {
    if (!token) return;
    const deletePost = async () => {
      const { error } = await supabase.from("post").delete().eq("delete_token", token);
      if (error) return alert("Impossible de supprimer l'annonce : " + error.message);
      alert("Annonce supprimée !");
      window.location.href = "/";
    };
    deletePost();
  }, [token]);

  return <p>Suppression en cours...</p>;
}

export default DeletePost;
