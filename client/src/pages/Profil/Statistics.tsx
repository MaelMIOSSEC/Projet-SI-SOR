import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar.tsx";
import { API_URL } from "../../config/api.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import type { UserRow } from "../../types/userType.ts";
import type { BoardRow } from "../../types/boardType.ts";
import type { TaskRow } from "../../types/taskType.ts";
import { useNavigate } from "react-router-dom";
import "../../index.css";

export default function Statistics() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [boards, setBoards] = useState<BoardRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await authFetch(`${API_URL}/users`, {
        method: "GET",
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
  }, []);

  const fetchBoards = useCallback(async () => {
    try {
      const response = await authFetch(`${API_URL}/boards`, {
        method: "GET",
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
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await authFetch(`${API_URL}/tasks`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Échec de la récupération des informations Taches: ", err);
    }
  }, []);

  useEffect(() => {
    if (user === null) navigate("/");
    else {
      fetchUsers();
      fetchBoards();
      fetchTasks();
    }
  }, [fetchUsers, fetchBoards, fetchTasks]);

  return (
    <main className="statistics-page-container">
      <Sidebar />

      <div className="statistics-content">
        <h1 className="statistics-title">Statistiques globales</h1>

        <div className="stats-cards-container">
          <div className="stat-card">
            <h2>Tableaux</h2>
            <p className="stat-number">{boards.length}</p>
          </div>

          <div className="stat-card">
            <h2>Tâches</h2>
            <p className="stat-number">{tasks.length}</p>
          </div>

          <div className="stat-card">
            <h2>Utilisateurs</h2>
            <p className="stat-number">{users.length}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
