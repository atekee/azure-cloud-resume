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
    if (isBlog) {
      link.classList.add("disabled");
    } else {
      link.classList.remove("disabled");
    }
  });

  if (resumeLink) {
    if (isBlog) {
      resumeLink.classList.add("primary");
    } else {
      resumeLink.classList.remove("primary");
    }
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

// Count-up animation
function animateCount(target) {
  const el = document.getElementById("visitor-count");
  if (!el) return;

  let current = 0;
  const increment = Math.ceil(target / 60);

  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(interval);
    } else {
      el.textContent = current;
    }
  }, 25);
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

  // Scroll to resume section if hash exists
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
// INITIALIZATION (FIXED)
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  // Initial load
  await handleNavigation();

  // Re-handle on hash change
  window.addEventListener("hashchange", handleNavigation);

  // Visitor counter animation (trigger once when visible)
  const counterWrapper = document.getElementById("visitor-counter");
  let hasAnimated = false;

  if (!counterWrapper) return;

  const observer = new IntersectionObserver(
    async entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          observer.disconnect();

          try {
            const hasVisited = localStorage.getItem("hasVisited");
            const count = hasVisited
              ? await getVisitorCount()
              : await updateVisitorCount();

            localStorage.setItem("hasVisited", "true");
            animateCount(count);

          } catch (err) {
            console.error("Visitor counter error:", err);
          }
        }
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(counterWrapper);
});
