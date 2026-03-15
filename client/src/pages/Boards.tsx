import Sidebar from "../components/Sidebar.tsx";

export default function Board() {
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
      </div>
    </main>
  );
}
