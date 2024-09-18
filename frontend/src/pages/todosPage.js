// Importaciones y funciones auxiliares
const fetchTodos = (tbody) => {
  fetch("http://localhost:4000/todos", {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al obtener tareas`);
      }
      return response.json();
    })
    .then((data) => {
      tbody.innerHTML = "";
      data.todos.forEach((todo) => {
        const tr = document.createElement("tr");
        tr.classList.add("hover:bg-gray-50");

        const createCell = (content, additionalClasses = []) => {
          const td = document.createElement("td");
          td.classList.add("px-6", "py-4", ...additionalClasses);
          td.textContent = content;
          return td;
        };

        tr.appendChild(createCell(todo.id));
        tr.appendChild(createCell(todo.title));
        tr.appendChild(createCell(todo.completed ? "Sí" : "No"));
        tr.appendChild(createCell(todo.owner));

        const actionCell = document.createElement("td");
        actionCell.classList.add("px-6", "py-4", "text-right");

        const updateBtn = document.createElement("button");
        updateBtn.classList.add(
          "text-blue-600",
          "hover:text-blue-800",
          "font-medium",
          "mr-2"
        );
        updateBtn.textContent = "Actualizar";
        updateBtn.addEventListener("click", () => {
          showModal(todo, tbody);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add(
          "text-red-600",
          "hover:text-red-800",
          "font-medium"
        );
        deleteBtn.textContent = "Borrar";
        deleteBtn.addEventListener("click", () => {
          fetch(`http://localhost:4000/todos/${todo.id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((response) => {
              if (!response.ok) {
                return response.json().then((data) => {
                  throw new Error(data.message);
                });
              }
              return response.json();
            })
            .then((data) => {
              alert(data.message);
              fetchTodos(tbody);
            })
            .catch((error) => {
              alert("Error al eliminar tarea: " + error.message);
            });
        });

        actionCell.appendChild(updateBtn);
        actionCell.appendChild(deleteBtn);
        tr.appendChild(actionCell);

        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      alert(error.message);
    });
};

const showModal = (todo, tbody) => {
  const modal = document.createElement("div");
  modal.classList.add(
    "fixed",
    "inset-0",
    "bg-gray-600",
    "bg-opacity-50",
    "overflow-y-auto",
    "h-full",
    "w-full",
    "flex",
    "items-center",
    "justify-center"
  );

  const modalContent = document.createElement("div");
  modalContent.classList.add(
    "bg-white",
    "p-8",
    "rounded-lg",
    "shadow-xl",
    "w-full",
    "max-w-md"
  );

  const modalTitle = document.createElement("h2");
  modalTitle.classList.add("text-2xl", "font-semibold", "mb-4", "text-gray-800");
  modalTitle.textContent = todo.id
    ? `Editando Tarea ${todo.id}`
    : "Agregar Nueva Tarea";
  modalContent.appendChild(modalTitle);

  const inputTitle = document.createElement("input");
  inputTitle.value = todo.title || "";
  inputTitle.classList.add(
    "border",
    "rounded",
    "p-2",
    "w-full",
    "mb-4",
    "text-gray-700"
  );
  modalContent.appendChild(inputTitle);

  const completedLabel = document.createElement("label");
  completedLabel.classList.add("flex", "items-center", "mb-4");
  const completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  completedCheckbox.checked = todo.completed || false;
  completedCheckbox.classList.add("mr-2");
  completedLabel.appendChild(completedCheckbox);
  completedLabel.appendChild(document.createTextNode("Completada"));
  modalContent.appendChild(completedLabel);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("flex", "justify-end");

  const confirmButton = document.createElement("button");
  confirmButton.textContent = todo.id ? "Actualizar" : "Agregar";
  confirmButton.classList.add(
    "bg-blue-600",
    "text-white",
    "px-4",
    "py-2",
    "rounded",
    "mr-2",
    "hover:bg-blue-700",
    "transition",
    "duration-300"
  );
  confirmButton.addEventListener("click", () => {
    const updatedTodo = {
      title: inputTitle.value,
      completed: completedCheckbox.checked,
    };

    const url = todo.id
      ? `http://localhost:4000/todos/${todo.id}`
      : "http://localhost:4000/todos";
    const method = todo.id ? "PUT" : "POST";

    fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        modal.remove();
        fetchTodos(tbody);
      })
      .catch((error) => {
        alert(`Error al ${todo.id ? "actualizar" : "agregar"} tarea: ${error.message}`);
      });
  });
  buttonContainer.appendChild(confirmButton);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancelar";
  cancelButton.classList.add(
    "bg-gray-300",
    "text-gray-700",
    "px-4",
    "py-2",
    "rounded",
    "hover:bg-gray-400",
    "transition",
    "duration-300"
  );
  cancelButton.addEventListener("click", () => {
    modal.remove();
  });
  buttonContainer.appendChild(cancelButton);

  modalContent.appendChild(buttonContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

export const todosPage = () => {
  const container = document.createElement("div");
  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "min-h-screen",
    "bg-gray-100",
    "p-8"
  );

  const header = document.createElement("header");
  header.classList.add("w-full", "max-w-4xl", "mb-8", "flex", "justify-between", "items-center");

  const title = document.createElement("h1");
  title.classList.add("text-3xl", "font-semibold", "text-gray-800");
  title.textContent = "Lista de Tareas";

  const btnHome = document.createElement("button");
  btnHome.classList.add(
    "bg-gray-200",
    "text-gray-700",
    "px-4",
    "py-2",
    "rounded",
    "hover:bg-gray-300",
    "transition",
    "duration-300",
    "font-medium"
  );
  btnHome.textContent = "Inicio";
  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  header.appendChild(title);
  header.appendChild(btnHome);

  const table = document.createElement("table");
  table.classList.add(
    "w-full",
    "max-w-4xl",
    "bg-white",
    "shadow-lg",
    "rounded-lg",
    "overflow-hidden"
  );

  const thead = document.createElement("thead");
  thead.classList.add("bg-gray-200", "text-gray-700");
  const headerRow = document.createElement("tr");
  ["ID", "Título", "Completado", "Propietario", "Acciones"].forEach(text => {
    const th = document.createElement("th");
    th.classList.add("px-6", "py-3", "text-left", "font-semibold");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");
  tbody.classList.add("divide-y", "divide-gray-200");

  table.appendChild(thead);
  table.appendChild(tbody);

  const addButton = document.createElement("button");
  addButton.classList.add(
    "mt-6",
    "bg-blue-600",
    "text-white",
    "px-6",
    "py-2",
    "rounded",
    "hover:bg-blue-700",
    "transition",
    "duration-300",
    "font-medium"
  );
  addButton.textContent = "Agregar Tarea";
  addButton.addEventListener("click", () => {
    showModal({}, tbody);
  });

  container.appendChild(header);
  container.appendChild(table);
  container.appendChild(addButton);

  fetchTodos(tbody);

  return container;
};