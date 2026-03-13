import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { URL_TOMCAT } from "../config/api";
import type { UserRow } from "../types/userType.ts";
import Table from "react-bootstrap/Table";

export default function AccountManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${URL_TOMCAT}/users`);

        const data = await response.json();

        setUsers(data);
      } catch (err) {
        console.error("Échec de la récupération : ", err);
      }
    })();
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
        <h1>Bonjour, {user.name}</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Prénom</th>
              <th scope="col">Email</th>
              <th scope="col">Mot de passe</th>
              <th scope="col">Pseudo</th>
              <th scope="col">Admin</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map((user) => (
                <tr>
                    <td>{ user.name }</td>
                    <td>{ user.lastName }</td>
                    <td>{ user.email }</td>
                    <td>{  }</td>
                    <td>{ user.username }</td>
                    <td>{ user.isAdmin === 0 ? "Admin" : "User" }</td>
                    <td></td>
                </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </main>
  );
}
