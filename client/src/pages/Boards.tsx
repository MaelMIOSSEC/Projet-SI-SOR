import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.tsx";
import Table from "react-bootstrap/Table";
import { API_URL } from "../config/api.ts";
import type { BoardRow } from "../types/boardType.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router/internal/react-server-client";

type BoardState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Board() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<BoardRow[]>([]);
  const [state, setState] = useState<BoardState>({ status: "idle" });

  const handleDelete = async (e: SubmitEvent<HTMLFormElement>, boardId: string) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/boards/${boardId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alert("Erreur lors de la mise à jour du profil.");
        setState({
          status: "error",
          error: `Update failed (${response.status})`,
        });
        return;
      }

      fetchBoards();
    } catch (error) {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Registration failed.",
      });
    }
  };

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/${user.userId}/boards`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      }
    } catch (err) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        err
      );
    }
  };

  console.log("boards => ", boards);

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: "63px",
        height: "800px",
      }}
    >
      <Sidebar />
      <div
        style={{
          width: "75%",
          margin: "40px",
        }}
      >
        <p style={{ marginTop: "200px" }}>
          Dans cette page, mettre un tableau contenant tous les tableaux dont
          l'utilisateur fais partie avec les informations nécéssaires et si
          l'utilisateur est le créateur du tableau, lui offir la possibilité de
          l'administrer. AJouter un bouton pour supprimer le tableau ou le
          quitter.
        </p>
        <Table striped bordered hover style={{ marginTop: "75px" }}>
          <thead>
            <tr>
              <th scope="col">Nom du tableau</th>
              <th scope="col">Nombre de membres</th>
              <th scope="col">Nombre de colonnes</th>
              <th scope="col">Rôle</th>
              <th scope="col"></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(boards) &&
              boards.map((board) => (
                <>
                  <td>{board.title}</td>
                  <td>{board.members.length}</td>
                  <td>{board.kanbanColumns?.length}</td>
                  <td>
                    <td>
                      <button
                        onClick={(e) => handleDelete(e, board.id)}
                        style={{ borderRadius: "10px", backgroundColor: "red" }}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </td>
                </>
              ))}
          </tbody>
        </Table>
      </div>
    </main>
  );
}
