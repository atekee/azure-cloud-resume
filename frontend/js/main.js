/*
  Main frontend script
  Integrates routing, component loading, navbar state,
  and real visitor counter (no mocks).
*/

/*
  Do not commit API information to public repositories.
  Use placeholders and replace them during your deployment process.
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
// VISITOR COUNTER (REAL API)
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

// Count-up animation
function animateCount(target) {
  const el = document.getElementById("count");
  if (!el || target === null) return;

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

// Count visitor only once using localStorage
async function initializeVisitorCounter() {
  const hasVisited = localStorage.getItem("hasVisited");
  let count;

  if (!hasVisited) {
    count = await updateVisitorCount();
    localStorage.setItem("hasVisited", "true");
  } else {
    count = await getVisitorCount();
  }

  return count;
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
// INITIALIZATION
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  // Initial page load
  await handleNavigation();

  // Re-handle on hash change
  window.addEventListener("hashchange", handleNavigation);

  // Visitor counter animation (trigger once when visible)
  const counterWrapper = document.getElementById("visitor-counter");
  let hasAnimated = false;

  if (counterWrapper) {
    const observer = new IntersectionObserver(
      async entries => {
        entries.forEach(async entry => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            const count = await initializeVisitorCounter();
            animateCount(count);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(counterWrapper);
  }
});
