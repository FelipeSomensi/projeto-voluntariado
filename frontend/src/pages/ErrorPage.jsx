import { useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="container py-5 text-center">
      <h1>Oops! Algo deu errado.</h1>
      <p>Desculpe, não conseguimos carregar a página.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

export default ErrorPage;
