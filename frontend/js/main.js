// Load resume.html into the page
async function loadResume() {
  const container = document.getElementById("resume-container");

  try {
    const response = await fetch("./components/resume.html");
    const html = await response.text();
    container.insertAdjacentHTML("afterbegin", html);
  } catch (error) {
    console.error("Error loading resume:", error);
  }
}


/*
Do not commit API information to public repositories.
Use placeholders and replace them during your deployment process.
*/

const API_BASE_URL = "__API_BASE_URL__";
const API_KEY = "__API_KEY_PLACEHOLDER__";

async function getVisitorCount() {
  try {
    const response = await fetch(`${API_BASE_URL}/get`, {
      method: "GET",
      headers: { "x-api-key": API_KEY }
    });

    if (!response.ok) {
      console.error("GET failed:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.count;

  } catch (error) {
    console.error("Error in getVisitorCount:", error);
    return null;
  }
}

async function updateVisitorCount() {
  try {
    const response = await fetch(`${API_BASE_URL}/update`, {
      method: "POST",
      headers: { "x-api-key": API_KEY }
    });

    if (!response.ok) {
      console.error("UPDATE failed:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.count;

  } catch (error) {
    console.error("Error in updateVisitorCount:", error);
    return null;
  }
}

// Count visitor only once using localStorage
async function initializeVisitorCounter() {
  const hasVisited = localStorage.getItem("hasVisited");

  let count;

  if (!hasVisited) {
    // First time visiting → increment count
    count = await updateVisitorCount();
    localStorage.setItem("hasVisited", "true");
  } else {
    // Already counted → just fetch the latest count
    count = await getVisitorCount();
  }

  if (count !== null) {
    const counterEl = document.getElementById("visitor-count");
    if (counterEl) {
      counterEl.innerText = count;
    }
  }
}

// Run when full page is loaded
document.addEventListener("DOMContentLoaded", async () => {
  await loadResume();
  await initializeVisitorCounter();
});
