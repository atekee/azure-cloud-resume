/*
 Frontend-only mock script used during initial setup before backend APIs were implemented.
 */

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

// Mock visitor count until backend is built
function loadMockVisitorCount() {
  const span = document.getElementById("count");
  span.textContent = Math.floor(100 + Math.random() * 50);
}

loadResume();
loadMockVisitorCount();
