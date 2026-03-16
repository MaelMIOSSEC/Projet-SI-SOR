import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.tsx";
import Table from "react-bootstrap/Table";
import { API_URL } from "../config/api.ts";
import type { BoardRow } from "../types/boardType.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { Trash2 } from "lucide-react";
import { Modal, Button, ListGroup, Badge } from "react-bootstrap";
import { User, Mail, ShieldCheck, Calendar } from "lucide-react"; // Importez vos icônes habituelles

type BoardState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Board() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<BoardRow[]>([]);
  const [state, setState] = useState<BoardState>({ status: "idle" });
  const [show, setShow] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const handleShow = (member: any) => {
    setSelectedMember(member);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedMember(null);
  };

  const handleDelete = async (
    e: SubmitEvent<HTMLFormElement>,
    boardId: string
  ) => {
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

  const HandleDeleteFromBoard = async (
    e: SubmitEvent<HTMLFormElement>,
    boardId: string,
    userId: string
  ) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/boards/${boardId}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      if (!response.ok) {
        alert("Erreur lors de la mise à jour du profil.");
        setState({
          status: "error",
          error: `Update failed (${response.status})`,
        });
        return;
      }

      alert("ok");
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

  useEffect(() => {
    fetchBoards();
  }, []);

  const getRole = (boardId: number) => {
    const members = boards[boardId]?.members;
    for (let i = 0; i < members?.length; i++) {
      if (members[i].userDto.id === user?.userId) {
        return members[i].role;
      }
    }

    return null;
  };

  console.log("boards", boards);

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
              <th scope="col">Membres</th>
              <th scope="col">Nombre de colonnes</th>
              <th scope="col">Rôle</th>
              <th scope="col"></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(boards) &&
              boards.map((board, index) => (
                <tr key={board.id}>
                  <td>{board.title}</td>
                  <td>
                    {board.members?.map((member) => (
                      <button
                        key={member.userDto.id}
                        onClick={() =>
                          handleShow({ ...member, boardId: board.id })
                        }
                        className="btn btn-outline-secondary btn-sm m-1 rounded-pill"
                        style={{ width: "120px" }}
                      >
                        {member.userDto.username}
                      </button>
                    ))}
                  </td>
                  <td>{board.kanbanColumns?.length}</td>
                  <td>
                    <Badge bg="secondary">{getRole(index)}</Badge>
                  </td>
                  <td>
                    {getRole(index) === "Owner" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => handleDelete(e, board.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Profil de {selectedMember?.userDto.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <ListGroup variant="flush">
              <ListGroup.Item>
                <div className="fw-bold text-muted small">Nom complet</div>
                {selectedMember.userDto.name} {selectedMember.userDto.lastName}
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="fw-bold text-muted small">Email</div>
                <div className="d-flex align-items-center">
                  <Mail size={14} className="me-2" />{" "}
                  {selectedMember.userDto.email}
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="fw-bold text-muted small">
                  Rôle sur le projet
                </div>
                <Badge bg="primary">{selectedMember.role}</Badge>
              </ListGroup.Item>
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              HandleDeleteFromBoard(
                e,
                selectedMember.boardId,
                selectedMember.userDto.id
              );
              handleClose();
            }}
          >
            Retirer du tableau
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
