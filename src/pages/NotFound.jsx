import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 Not Found </h1>
      <p>
        Oops! Sorry buddy.
      </p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontSize: '1.1em' }}>
        Go to the Home page
      </Link>
    </div>
  );
};

export default NotFound;
