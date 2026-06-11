# React Weather Frontend

A React application for searching and displaying weather information from the backend API.

## Prerequisites

* Node.js 18 or higher
* npm

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd <project-folder>
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

Replace the URL with the address of your backend API if different.

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Build for Production

Generate an optimized production build:

```bash
npm run build
```

The build output will be generated in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

public/
.env
package.json
vite.config.js
```

## Available Scripts

Start development server:

```bash
npm run dev
```

Build application:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Notes

* Ensure the backend API is running before starting the frontend.
* Verify that `VITE_API_URL` points to the correct backend server.
* After modifying the `.env` file, restart the development server.
