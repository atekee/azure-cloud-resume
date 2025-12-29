/*
 Frontend-only mock script used during initial setup
 before backend APIs were implemented.
 */

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
// VISITOR COUNTER (MOCK)
// ===============================
function loadMockVisitorCount() {
  return Math.floor(100 + Math.random() * 50);
}

// Count-up animation
function animateCount(target) {
  const el = document.getElementById("count");
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
// INITIALIZATION
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  // Initial load
  await handleNavigation();

  // Re-handle on hash change
  window.addEventListener("hashchange", handleNavigation);

  // Visitor counter animation (trigger once when visible)
  const counterWrapper = document.getElementById("visitor-counter");
  let hasAnimated = false;

  if (counterWrapper) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateCount(loadMockVisitorCount());
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(counterWrapper);
  }
});
