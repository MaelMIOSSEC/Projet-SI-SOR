import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.ts";
import { API_URL } from "../config/api.ts";
import { useEffect, useState } from "react";
import type { BoardRow } from "../types/boardType.ts";

type BoardState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isConnected = user !== null;

  const [show, setShow] = useState(false);
  const [boards, setBoards] = useState<BoardRow[]>([]);
  const [state, setState] = useState<BoardState>({ status: "idle" });
  const [formData, setFormData] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreateBoard = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = {
      title: formData?.title,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/${user?.userId}/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Erreur lors de la création du tableau.");
        setState({
          status: "error",
          error: `Update failed (${response.status})`,
        });
        return;
      }

      alert("Tableau ajouté avec succès !");
      setState({ status: "idle" });
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

      const response = await fetch(`${API_URL}/users/${user?.userId}/boards`, {
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
                    type="text"
                    name="title"
                    placeholder="Entrez le titre içi"
                    required
                    autoFocus
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleCreateBoard}>
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
                  margin: "0 50px",
                  padding: "15px 40px",
                  borderRadius: "20px",
                  width: "250px",
                  boxShadow: "gray -3px 3px 20px"
                }}
              >
                <h2>{board.title}</h2>
                <hr />
                <div style={{ textAlign: "start" }}>
                  <p>Colonnes : {board.kanbanColumns.length}</p>
                  <p>Membres :</p>
                  <ul>
                  {board.members?.map((member) => (
                    <li>{member.userDto.username}</li>
                  ))}
                  </ul>
                </div>
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
