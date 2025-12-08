# Frontend — Cloud Resume Challenge

This folder contains the static frontend for the **Azure Cloud Resume Challenge**.
It includes your HTML resume, styling, JavaScript logic, and all static assets required for deployment to Azure Static Website Hosting.

## Folder Structure

```
frontend/
  index.html            # Main entry point for the website
  css/
    styles.css          # Global stylesheet
  js/
    main.js             # Loads resume.html + visitor counter logic
  components/
    resume.html         # Resume content injected into index.html
  images/
    profile.png         # Profile placeholder image
    icon-github.png     # GitHub icon
    icon-linkedin.png   # LinkedIn icon
```

## How It Works

### index.html
- Loads global styling (`css/styles.css`)
- Loads JavaScript (`js/main.js`)
- Contains a `<main>` container where `resume.html` is injected
- Displays the visitor counter placeholder

### resume.html
- Contains the resume layout and content
- Loaded dynamically into `index.html` using JavaScript (`fetch()`)

### main.js
Handles:
- Injecting `resume.html` into the page
- Displaying a mock visitor counter
- Preparing for backend integration with Azure Functions

### styles.css
- Controls layout, fonts, colors, and component styling
- Includes `.profile-pic` for formatting the profile image

## Running the Frontend Locally

Run:

```bash
cd frontend
python3 -m http.server 5500
```

Then open:

```
http://localhost:5500
```

## Visitor Counter (Mock for Now)

```js
function loadMockVisitorCount() {
  const span = document.getElementById("count");
  span.textContent = Math.floor(100 + Math.random() * 50);
}
```

## Deployment (Coming Soon)

This frontend will later be deployed to Azure Storage Static Website and Azure CDN.

## Notes

- All paths are relative to `index.html`
- No build tools required — pure static website
