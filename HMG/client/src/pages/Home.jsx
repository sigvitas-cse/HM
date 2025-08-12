// client/src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">Welcome to HR Management System</h1>
      <p className="text-lg text-gray-200 mb-6 text-center">
        Manage your workforce efficiently with our comprehensive HR solution.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;