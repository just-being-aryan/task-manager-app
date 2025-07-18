import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="bg-indigo-900 text-white py-4 shadow flex items-center justify-between px-6">
      <div className="font-bold text-xl tracking-wide">Finance Tracker</div>
      <div className="space-x-4">
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link to="/register" className="hover:underline">
          Register
        </Link>
      </div>
    </nav>
  );
}
