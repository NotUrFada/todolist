import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>About This Todo App 📋</h1>
      <p>
        This application is the bomb.com for managing your tasks efficiently! It allows you to add, update, complete, and filter your todo items with ease.
      </p>
      <p>
        The front-end uses modern React hooks, including `useReducer` for complex state management and `useEffect`/`useCallback` for optimized data fetching and side effects.
      </p>
      <h3>Author & Credits</h3>
      <p>
        This app was developed by Somtochi Ezeh 
      </p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none', marginTop: '15px', display: 'block' }}>
        ← Back to Todo List
      </Link>
    </div>
  );
};

export default About;