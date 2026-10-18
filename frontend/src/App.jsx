import { Link, Outlet, useNavigate } from 'react-router-dom';
import { getUser, logout } from './services/auth';

function App() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-primary px-3">
        <Link className="navbar-brand" to="/">
          Voluntariado IFRS
        </Link>

        <div className="navbar-nav me-auto">
          <Link className="nav-link" to="/events">
            Eventos
          </Link>
        </div>

        <div className="d-flex align-items-center gap-3 text-white">
          {user ? (
            <>
              <span>
                {user.email} ({user.role})
              </span>
              <button className="btn btn-sm btn-light" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <Link className="btn btn-sm btn-light" to="/login">
              Entrar
            </Link>
          )}
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}

export default App;