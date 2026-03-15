import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.ts";
import { API_URL } from "../config/api.ts";
import { useEffect, useState } from "react";
import type { BoardRow } from "../types/boardType.ts";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isConnected = user !== null;

  const [show, setShow] = useState(false);
  const [boards, setBoards] = useState<BoardRow[]>([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            onClick={handleShow}
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

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Ajouter un tableau</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Titre du tableau</Form.Label>
                  <Form.Control
                    type="title"
                    placeholder="Entrez le titre içi"
                    required
                    autoFocus
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Example textarea</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
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
              <div
                style={{
                  border: "1px solid",
                  margin: "0 50px",
                  padding: "15px 40px",
                  borderRadius: "20px",
                }}
              >
                <h2>{board.title}</h2>
                <p>Nombre de colonnes : {board.kanbanColumns.length}</p>
                <p>Nombre de membres : {board.members.length}</p>
                <button>Ouvrir</button>
              </div>
            ))}
        </div>
      </>
    );
  } else {
    navigate("/login");
  }
}
