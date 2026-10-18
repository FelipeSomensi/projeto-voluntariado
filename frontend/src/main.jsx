import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx';
import EventForm from './pages/EventForm.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { eventLoader } from './loaders/eventLoader.js';
import { eventEditLoader } from './loaders/eventEditLoader.js';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      { path: '/events', element: <Events /> },
      {
        path: '/events/new',
        element: (
          <ProtectedRoute adminOnly>
            <EventForm />
          </ProtectedRoute>
        ),
      },
      {
        path: '/events/:id',
        element: <EventDetails />,
        loader: eventLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: '/events/:id/edit',
        element: (
          <ProtectedRoute adminOnly>
            <EventForm />
          </ProtectedRoute>
        ),
        loader: eventEditLoader,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);