import { useState, useEffect } from "react";
import "./App.css";
import Cita from "./components/Cita";
import Formulario from "./components/Formulario";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  //Citas en local storage
  let citasIniciales = JSON.parse(localStorage.getItem("citas"));
  if (!citasIniciales) {
    citasIniciales = [];
    console.log(citasIniciales);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  //Arreglo de citas
  const [citas, setCitas] = useState(citasIniciales);
  // console.log(citas);

  useEffect(() => {
    let citasIniciales = JSON.parse(localStorage.getItem("citas"));

    if (citasIniciales) {
      localStorage.setItem("citas", JSON.stringify(citas));
    } else {
      localStorage.setItem("citas", JSON.stringify([]));
    }
  }, [citas]);

  //Funcion que tome las citas y agregue la nueva
  const crearCita = (cita) => {
    setCitas([...citas, cita]);
  };

  //Funcion que elimina cita por su id
  const eliminarCita = (id) => {
    setCitas(citas.filter((cita) => cita.id !== id));
  };

  //Mensaje condicional
  const titulo = citas.length > 0 ? "Administra tus Citas" : "No hay Citas";

  return (
    <>
      <h1>Administrador de Pacientes</h1>
      <div className="container">
        <div className="row">
          <div className="one-half column">
            <Formulario crearCita={crearCita} />
          </div>
          <DragDropContext
            onDragEnd={(result) => {
              const { source, destination } = result;
              if (!destination) {
                return;
              }
              if (
                source.index === destination.index &&
                source.droppableId === destination.droppableId
              ) {
                return;
              }
              setCitas((prevCitas) =>
                reorder(prevCitas, source.index, destination.index)
              );
            }}
          >
            <div className="one-half column">
              <h2>{titulo}</h2>
              <Droppable droppableId="citas">
                {(droppableProvided) => (
                  <ul
                    className="cita-container"
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    {citas.map((cita, index) => (
                      <Draggable
                        key={cita.id}
                        draggableId={cita.id}
                        index={index}
                      >
                        {(draggableProvided) => (
                          <li
                            {...draggableProvided.draggableProps}
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.dragHandleProps}
                            className="cita-item"
                          >
                            <Cita
                              cita={cita}
                              key={cita.id}
                              eliminarCita={eliminarCita}
                            />
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </div>
      </div>
    </>
  );
}

export default App;
