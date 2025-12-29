/*
  Main frontend script
  - Handles routing (resume / blog)
  - Loads components dynamically
  - Manages navbar state
  - Integrates real visitor counter backend
*/

/*
  Do not commit API information to public repositories.
  Use placeholders and replace them during deployment.
*/
const API_BASE_URL = "__API_BASE_URL__";
const API_KEY = "__API_KEY_PLACEHOLDER__";

// ===============================
// COMPONENT LOADER
// ===============================
async function loadComponent(name) {
  const container = document.getElementById("resume-container");
  container.innerHTML = "";

  try {
    const response = await fetch(`./components/${name}.html`);
    const html = await response.text();
    container.insertAdjacentHTML("afterbegin", html);
  } catch (error) {
    console.error(`Error loading ${name}:`, error);
  }
}

// ===============================
// NAVBAR STATE HANDLING
// ===============================
function updateNavbarState(isBlog) {
  const sectionLinks = document.querySelectorAll(
    '#navbar a[data-nav="section"]'
  );
  const resumeLink = document.querySelector(
    '#navbar a[data-nav="resume"]'
  );

  sectionLinks.forEach(link => {
    link.classList.toggle("disabled", isBlog);
  });

  if (resumeLink) {
    resumeLink.classList.toggle("primary", isBlog);
  }
}

// ===============================
// VISITOR COUNTER (REAL BACKEND)
// ===============================
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

// Count visitor only once per browser
async function initializeVisitorCounter() {
  const hasVisited = localStorage.getItem("hasVisited");
  let count;

  if (!hasVisited) {
    count = await updateVisitorCount();
    localStorage.setItem("hasVisited", "true");
  } else {
    count = await getVisitorCount();
  }

  if (count !== null) {
    const counterEl = document.getElementById("visitor-count");
    if (counterEl) {
      counterEl.textContent = count;
    }
  }
}

// ===============================
// ROUTING + CONTENT LOADING
// ===============================
async function handleNavigation() {
  const hash = window.location.hash.replace("#", "");

  // BLOG ROUTE
  if (hash === "blog") {
    await loadComponent("blog");
    updateNavbarState(true);
    return;
  }

  // DEFAULT: RESUME
  await loadComponent("resume");
  updateNavbarState(false);

  // Scroll to section if hash exists
  if (hash) {
    setTimeout(() => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }
}

// ===============================
// INITIALIZATION
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  await handleNavigation();
  await initializeVisitorCounter();

  window.addEventListener("hashchange", handleNavigation);
});
