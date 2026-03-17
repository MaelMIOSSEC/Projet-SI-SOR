import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { API_URL } from "../config/api.ts";
import { useAuth } from "../hooks/useAuth.ts";
import type { Board } from "../types/boardType.ts";
import { useParams } from "react-router/internal/react-server-client";
import type { KanbanColumn } from "../types/kanbanColumnType.ts";
import type { Task } from "../types/taskType.ts";

const KanbanColumnItem = ({
  kanbanColumn,
  onTasksLoaded,
}: {
  kanbanColumn: KanbanColumn;
  onTasksLoaded: (count: number) => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/columns/${kanbanColumn.id}/tasks`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        onTasksLoaded(data.length);
      }
    } catch (err) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        err
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  console.log("tasks => ", tasks);

  return (
    <>
      {tasks.map((task: Task) => (
        <p>{task.title}</p>
      ))}
    </>
  );
};

export default function BoardDetails() {
  const { user } = useAuth();
  const { boardId } = useParams();

  const [show, setShow] = useState(false);
  const [board, setBoard] = useState<Board>();
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: ""
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUpdateCount = (columnId: string, count: number) => {
    setTaskCounts((prev) => ({ ...prev, [columnId]: count }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    console.log("name => ", name);
    console.log("value => ", value);
    
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const fetchBoard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/boards/${boardId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBoard(data);
      }
    } catch (err) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        err
      );
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  console.log("boards => ", board);

  return (
    <>
      <div
        style={{
          marginTop: "100px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <h3>{board?.title}</h3>
        {Array.isArray(board?.kanbanColumns) &&
          board?.kanbanColumns.map((kanbanColumn) => (
            <div style={{ border: "1px solid" }}>
              <strong>
                {kanbanColumn.title} ({taskCounts[kanbanColumn.id] || 0})
              </strong>
              <KanbanColumnItem
                kanbanColumn={kanbanColumn}
                onTasksLoaded={(count) =>
                  handleUpdateCount(kanbanColumn.id, count)
                }
              />
              <button
                type="button"
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
                  padding: "8px 20px",
                  margin: "10px 0",
                }}
              >
                + Ajouter une tache
              </button>
            </div>
          ))}
        <div></div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un tableau</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Titre de la tache</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Entrez le titre içi"
                required
                autoFocus
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Description de la tache</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Entrez la description içi"
                required
                autoFocus
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Deadline de la tache</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                placeholder="Entrez la deadline içi"
                required
                autoFocus
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskPriority">
              <Form.Label>Priorité de la tache</Form.Label>
              <Form.Select name="priority" required onChange={handleChange}>
                <option value="">Sélectionnez une priorité</option>
                <option value="Strong">Strong (Haute)</option>
                <option value="Medium">Medium (Moyenne)</option>
                <option value="Low">Low (Basse)</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            test
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
