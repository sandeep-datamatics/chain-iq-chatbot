import { NavLink } from 'react-router-dom';
import './navbar.scss';
const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><NavLink to="/" style={({ isActive }) => ({ color: isActive ? 'red' : '#fff', })}>Chatbot</NavLink></li>
                <li><NavLink to="/dashboard" style={({ isActive }) => ({ color: isActive ? 'red' : '#fff', })}>Dashboard</NavLink></li>
                <li><NavLink to="/about" style={({ isActive }) => ({ color: isActive ? 'red' : '#fff', })}>About</NavLink></li>

            </ul>
        </nav>
    );
}

export default Navigation;