import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar.tsx";
import { API_URL } from "../../config/api.ts";
import type { UserRow } from "../../types/userType.ts";
import type { BoardRow } from "../../types/boardType.ts";
import type { TaskRow } from "../../types/taskType.ts";

export default function Statistics() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [boards, setBoards] = useState<BoardRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        err,
      );
    }
  };

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
        "Échec de la récupération des informations tableaux: ",
        err,
      );
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Échec de la récupération des informations Taches: ", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBoards();
    fetchTasks();
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Statistiques globales</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "80%",
            border: "1px solid",
            marginTop: "50px",
          }}
        >
          <div style={{ width: "33%", padding: "30px" }}>
            <h2>Tableaux</h2>{" "}
            <p style={{ fontSize: "25px" }}>{boards.length}</p>
          </div>
          <div style={{ width: "33%", padding: "30px" }}>
            <h2>Taches</h2> <p style={{ fontSize: "25px" }}>{tasks.length}</p>
          </div>
          <div style={{ width: "33%", padding: "30px" }}>
            <h2>Utilisateurs</h2>{" "}
            <p style={{ fontSize: "25px" }}>{users.length}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
