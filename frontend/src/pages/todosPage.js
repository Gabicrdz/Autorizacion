export const todosPage = () => {
  const container = document.createElement("div");

  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "min-h-screen",
    "bg-gray-200",
    "p-4"
  );

  const btnHome = document.createElement("button");
  btnHome.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );
  btnHome.textContent = "Home";
  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  const title = document.createElement("h1");
  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";

  const btnAdd = document.createElement("button");
  btnAdd.textContent = "Agregar";
  btnAdd.classList.add(
    "bg-green-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-green-600",
    "mb-4",
    "ml-4"
  );
  btnAdd.addEventListener("click", () => openModal());

  const table = document.createElement("table");
  table.classList.add(
    "w-full",
    "bg-white",
    "shadow-md",
    "overflow-hidden",
    "rounded-lg"
  );

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["ID", "Title", "Completed", "Owner Id", "Owner Name", "Actions"].forEach(headerText => {
    const th = document.createElement("th");
    th.classList.add("border", "px-4", "py-2", "bg-gray-100");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");
  tbody.classList.add("text-center");

  table.appendChild(thead);
  table.appendChild(tbody);

  container.appendChild(btnHome);
  container.appendChild(btnAdd);
  container.appendChild(title);
  container.appendChild(table);

  // Modal
  const modal = document.createElement("div");
  modal.classList.add("fixed", "inset-0", "bg-gray-600", "bg-opacity-50", "overflow-y-auto", "h-full", "w-full", "hidden");
  modal.id = "modal";

  const modalContent = document.createElement("div");
  modalContent.classList.add("relative", "top-20", "mx-auto", "p-5", "border", "w-96", "shadow-lg", "rounded-md", "bg-white");

  const form = document.createElement("form");
  form.id = "todoForm";

  const fields = [
    { name: "title", label: "Title", type: "text" },
    { name: "completed", label: "Completed", type: "checkbox" },
    { name: "owner", label: "Owner ID", type: "number" },
    { name: "ownerName", label: "Owner Name", type: "text" }
  ];

  fields.forEach(field => {
    const label = document.createElement("label");
    label.textContent = field.label;
    label.classList.add("block", "mb-2");

    const input = document.createElement("input");
    input.name = field.name;
    input.type = field.type;
    if (field.type !== "checkbox") {
      input.classList.add("w-full", "px-3", "py-2", "border", "rounded-md");
    }

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(document.createElement("br"));
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Submit";
  submitButton.classList.add("mt-4", "bg-blue-500", "text-white", "p-2", "rounded");

  form.appendChild(submitButton);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  container.appendChild(modal);

  function openModal(todo = null) {
    const form = document.getElementById("todoForm");
    form.reset();

    if (todo) {
      form.title.value = todo.title;
      form.completed.checked = todo.completed;
      form.owner.value = todo.owner;
      form.ownerName.value = todo.ownerName;
    }

    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const todoData = Object.fromEntries(formData);
    todoData.completed = form.completed.checked;

    // Aquí puedes enviar todoData a tu API o manejarla como necesites
    console.log("Todo data:", todoData);

    closeModal();
    // Aquí deberías actualizar la tabla con los nuevos datos
  });

  fetch("http://localhost:4000/todos", {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      data.todos.forEach((todo) => {
        if (todo.id > 10) return;

        const tr = document.createElement("tr");

        ["id", "title", "completed", "owner", "ownerName"].forEach(key => {
          const td = document.createElement("td");
          td.classList.add("border", "px-4", "py-2");
          td.textContent = key === "completed" ? (todo[key] ? "Sí" : "No") : todo[key];
          tr.appendChild(td);
        });

        const tdActions = document.createElement("td");
        tdActions.classList.add("border", "px-4", "py-2");

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Editar";
        btnEdit.classList.add("bg-yellow-500", "text-white", "p-2", "rounded", "hover:bg-yellow-600", "mr-2");
        btnEdit.addEventListener("click", () => openModal(todo));

        const btnDelete = document.createElement("button"); 
        btnDelete.textContent = "Delete";
        btnDelete.classList.add("bg-red-500", "text-white", "p-2", "rounded", "hover:bg-red-600");
        btnDelete.addEventListener("click", () => {
          tr.remove();
          // Aquí deberías también eliminar el todo de tu base de datos
        });

        tdActions.appendChild(btnEdit);
        tdActions.appendChild(btnDelete);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
      });
    });

  return container;
};