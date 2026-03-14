import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.ts";
import { API_URL } from "../config/api.ts";
import { useEffect, useState } from "react";
import type { BoardRow } from "../types/boardType.ts";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isConnected = user !== null;

  const [boards, setBoards] = useState<BoardRow[]>([]);

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/boards`, {
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
        err,
      );
    }
  };

  useEffect(() => {
    fetchBoards();
  });

  if (isConnected) {
    return (
      <>
        <div
          style={{
            marginTop: "100px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <h1 style={{ textTransform: "uppercase" }}>Mes tableaux</h1>
          <button
            style={{
              borderRadius: "20px",
              color: "black",
              backgroundColor: "white",
              border: "1px solid",
              borderTopStyle: "solid",
              borderRightStyle: "solid",
              borderBottomStyle: "solid",
              borderLeftStyle: "solid",
              borderStyle: "dashed",
              padding: "10px 40px",
            }}
          >
            + Créer un tableau
          </button>
        </div>
        <div
          style={{
            margin: "100px 0",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {Array.isArray(boards) &&
            boards.map((board) => (
              <div style={{ border: "1px solid", margin: "0 50px" }}>
                <h1>{board.title}</h1>
              </div>
            ))}
        </div>
      </>
    );
  } else {
    navigate("/login");
  }
}
