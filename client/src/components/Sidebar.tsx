import { Home, Users, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const { pathname } = useLocation();

    const menu = [
        { name: "Dashboard", path: "/", icon: <Home size={18} /> },
        { name: "Users", path: "/users", icon: <Users size={18} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
    ];

    return (
        <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col p-5 fixed md:static top-0 left-0 z-50">
            <h2 className="text-2xl font-bold mb-8">My Dashboard</h2>
            <nav className="space-y-2">
                {menu.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition ${pathname === item.path ? "bg-gray-800" : ""
                            }`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
