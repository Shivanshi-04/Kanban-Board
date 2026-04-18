let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];
let dragElement = null;

function addTask(title, desc, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = `<h2>${title}</h2>
    <p>${desc}</p>
    <button>Delete</button>
    `;
  column.appendChild(div);

  div.addEventListener("drag", (e) => {
    dragElement = div;
  });

  // Add delete event listener
  div.querySelector("button").addEventListener("click", function () {
    div.remove();
    updateTaskCount();
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
  });

  return div;
}

function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    count.innerText = tasks.length;
  });
}

if (localStorage.getItem("tasksData")) {
  const data = JSON.parse(localStorage.getItem("tasksData"));
  // console.log(data);

  for (let col in data) {
    const column = document.querySelector(`#${col}`);
    data[col].forEach((task) => {
      addTask(task.title, task.desc, column);
    });
  }

  //Count update on reload
  updateTaskCount();
}

function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    // console.log("droped: ", dragElement, column);

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    updateTaskCount();

    localStorage.setItem("tasksData", JSON.stringify(tasksData));
  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// modal related logic
const toggleModalBtn = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addNewTaskBtn = document.querySelector("#add-new-task");

function handleToggleModalClick() {
  modal.classList.toggle("active");
}

toggleModalBtn.addEventListener("click", handleToggleModalClick);

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addNewTaskBtn.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-desc-input").value;

  const div = addTask(taskTitle, taskDesc, todo);

  dragElement = div;

  updateTaskCount();

  localStorage.setItem("tasksData", JSON.stringify(tasksData));

  // Clear the input fields
  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";

  modal.classList.remove("active");
});
// modal related logic end
