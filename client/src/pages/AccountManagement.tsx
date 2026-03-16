import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { API_URL } from "../config/api.ts";
import type { UserRow } from "../types/userType.ts";
import Table from "react-bootstrap/Table";
import { SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router/internal/react-server-client";

type AdminState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function AccountManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user: connectedUser } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);

  if (!connectedUser?.isAdmin) {
    navigate("/");
  }

  const UserRowItem = ({ user }: { user: UserRow }) => {
    const [formData, setFormData] = useState(user);
    const [state, setState] = useState<AdminState>({ status: "idle" });

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdate = async (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();

      const data = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        isAdmin: formData.isAdmin ? 1 : 0,
        createdAt: formData.createdAt,
      };

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/users/${user.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          alert("Erreur lors de la mise à jour du profil.");
          setState({
            status: "error",
            error: `Update failed (${response.status})`,
          });
          return;
        }

        fetchUsers();
        alert("Profil mis à jour avec succès !");
        setState({ status: "idle" });
      } catch (error) {
        setState({
          status: "error",

          error:
            error instanceof Error ? error.message : "Registration failed.",
        });
      }
    };

    const handleUpdateIsAdmin = async (
      e: SubmitEvent<HTMLFormElement>,
      isAdmin,
    ) => {
      e.preventDefault();

      const isAdminState = isAdmin === 1 ? 0 : 1;

      const updatedData = {
        ...formData,
        isAdmin: isAdminState,
      };

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/users/${user.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          alert("Erreur lors de la mise à jour du profil.");
          setState({
            status: "error",
            error: `Update failed (${response.status})`,
          });
          return;
        }

        fetchUsers();
        setState({ status: "idle" });
      } catch (error) {
        setState({
          status: "error",

          error:
            error instanceof Error ? error.message : "Registration failed.",
        });
      }
    };

    const handleDelete = async (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (connectedUser?.userId === user.id) {
        const confirmation = window.confirm(
          "Voulez-vous vraiment supprimer votre propre compte ?",
        );

        if (!confirmation) return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/users/${user.id}`, {
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

        if (connectedUser?.userId === user.id) {
          logout();
          navigate("/");
        }

        fetchUsers();
      } catch (error) {
        setState({
          status: "error",

          error:
            error instanceof Error ? error.message : "Registration failed.",
        });
      }
    };

    return (
      <tr>
        <td>
          <input
            style={{ width: "200px", textAlign: "center" }}
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={(e) => handleChange(e)}
          />
        </td>
        <td>
          <input
            style={{ width: "200px", textAlign: "center" }}
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={(e) => handleChange(e)}
          />
        </td>
        <td>
          <input
            style={{ width: "300px", textAlign: "center" }}
            type="text"
            name="email"
            required
            value={formData.email}
            onChange={(e) => handleChange(e)}
          />
        </td>
        <td>
          <input
            style={{ width: "200px", textAlign: "center" }}
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={(e) => handleChange(e)}
          />
        </td>
        <td>
          {user.isAdmin === 0 ? (
            <button
              onClick={(e) => handleUpdateIsAdmin(e, formData.isAdmin)}
              style={{
                marginTop: "3px",
                borderRadius: "10px",
                width: "40px",
                height: "40px",
                backgroundColor: "red",
              }}
            ></button>
          ) : (
            <button
              onClick={(e) => handleUpdateIsAdmin(e, formData.isAdmin)}
              style={{
                marginTop: "3px",
                borderRadius: "10px",
                width: "40px",
                height: "40px",
                backgroundColor: "green",
              }}
            ></button>
          )}
        </td>
        <td>
          <button onClick={handleUpdate} style={{ borderRadius: "10px" }}>
            <SquarePen />
          </button>
        </td>
        <td>
          <button
            onClick={handleDelete}
            style={{ borderRadius: "10px", backgroundColor: "red" }}
          >
            <Trash2 />
          </button>
        </td>
      </tr>
    );
  };

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
      console.error("Échec de la récupération : ", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!users) {
    return (
      <h1 style={{ marginTop: "400px" }}>
        <b>Chargement de la page...</b>
      </h1>
    );
  }

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
        <h1>Bonjour, {connectedUser?.name}</h1>
        <Table striped bordered hover style={{ marginTop: "75px" }}>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Prénom</th>
              <th scope="col">Email</th>
              <th scope="col">Pseudo</th>
              <th scope="col">Admin</th>
              <th scope="col"></th>
              <th></th>
            </tr>
          </thead>Rôle
          <tbody>
            {Array.isArray(users) &&
              users.map((user) => <UserRowItem key={user.id} user={user} />)}
          </tbody>
        </Table>
      </div>
    </main>
  );
}
