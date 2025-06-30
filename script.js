const container = document.getElementById("list-container");
const goalForm = document.getElementById("goal-form");
const categoryInput = document.getElementById("category-input");
const goalInput = document.getElementById("goal-input");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progress-text");

// Load dark mode
if (localStorage.getItem("dark-mode") === "true") {
  document.body.classList.add("dark-mode");
}
document.getElementById("toggle-dark-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
});

// Load saved goals
let goalsData = JSON.parse(localStorage.getItem("goals")) || {};

function renderGoals() {
  container.innerHTML = "";
  for (const category in goalsData) {
    const catDiv = document.createElement("div");
    catDiv.classList.add("category");

    const h3 = document.createElement("h3");
    h3.textContent = category;
    catDiv.appendChild(h3);

    const ul = document.createElement("ul");

    goalsData[category].forEach((goal, index) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = goal.done;
      checkbox.addEventListener("change", () => {
        goalsData[category][index].done = checkbox.checked;
        saveGoals();
        updateProgress();
      });

      label.appendChild(checkbox);
      label.append(` ${goal.text}`);
      li.appendChild(label);
      ul.appendChild(li);
    });

    catDiv.appendChild(ul);
    container.appendChild(catDiv);
  }
  updateProgress();
}

function updateProgress() {
  const total = Object.values(goalsData).flat().length;
  const done = Object.values(goalsData).flat().filter(goal => goal.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  progress.style.width = `${percent}%`;
  progressText.textContent = `${percent}% Completed`;
}

function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goalsData));
}

goalForm.addEventListener("submit", e => {
  e.preventDefault();
  const category = categoryInput.value.trim();
  const text = goalInput.value.trim();
  if (!category || !text) return;

  if (!goalsData[category]) goalsData[category] = [];
  goalsData[category].push({ text, done: false });

  categoryInput.value = "";
  goalInput.value = "";

  saveGoals();
  renderGoals();
});

// Initial render
renderGoals();
