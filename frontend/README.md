# Frontend — Cloud Resume Challenge
This folder contains the **static frontend** for the Azure Cloud Resume Challenge.
It includes HTML resume, styling, JavaScript logic, and all static assets required for deployment to Azure Static Website Hosting.

## Folder Structure
```
frontend/
├── index.html                # Main entry point for the website
├── css/
│   └── styles.css            # Global stylesheet
├── js/
│   ├── main.js               # Loads resume.html + backend visitor counter logic
│   └── main.mock.js          # Loads resume.html + mock visitor counter logic
├── components/
│   └── resume.html           # Resume content injected into index.html
└── assets/
    └── images/
        ├── profile.png       # Profile placeholder image
        ├── icon-github.png   # Github icon
        └── icon-linkedin.png # Linkedin icon
```

## Overview
### index.html
- Loads global styling (`css/styles.css`)
- Loads JavaScript (`js/main.js`)
- Contains a `<main>` container where `resume.html` is injected
- Displays the visitor counter placeholder

### resume.html
- Contains the resume layout and content
- Loaded dynamically into `index.html` using JavaScript (`fetch()`)

### main.mock.js (Initial Setup / Frontend Testing)
This file is used **only for initial frontend testing**.
- Loads `resume.html` into the page
- Displays a **mock visitor count** that changes on every page refresh

Example mock logic:

```js
function loadMockVisitorCount() {
  const span = document.getElementById("count");
  span.textContent = Math.floor(100 + Math.random() * 50);
}
```
This confirms that:
- JavaScript is executing correctly
- DOM elements are wired properly
- No backend dependency exists yet

### main.js (Production)
`main.js` is the production script and includes logic that communicates with the backend API.
It is **not required** for initial frontend testing.

### styles.css
- Controls layout, fonts, colors, and component styling
- Includes `.profile-pic` for formatting the profile image

## Running the Frontend Locally
To test the frontend **without a backend**:
1. Open `index.html`
2. Ensure the script reference points to the mock file:

```html
<script src="js/main.mock.js"></script>
```

3. Start a local web server:
```bash
cd frontend
python3 -m http.server 5500
```

4. Open your browser at:
```
http://localhost:5500
```

## How to Verify the Initial Setup
The initial setup is successful if:

- The resume content appears on the page
- Styles are applied correctly
- The visitor counter displays a random number
- Refreshing the page changes the counter value

No Azure resources or backend services are required for this step.

## Deployment & Production
For deployment and production use, the frontend uses `main.js`.

`main.js` contains the production JavaScript logic, including integration with the backend API for the visitor counter.

The mock script (`main.mock.js`) is intended only for initial frontend testing and local development before backend resources are available.
