import React, { Suspense, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import LandingPage from './Landing.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/play",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

startTransition(() => {
  root.render(
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </React.StrictMode>
  );
});
