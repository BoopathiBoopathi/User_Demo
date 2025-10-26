import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setMenu } from "@/features/layout/layoutSlice";
import { Users, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { clearTokens } from "@/apiCall/v1/api_v1";

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { selectedMenu } = useAppSelector((state) => state.layout);
    const menus = [
        { name: "Users", icon: <Users size={20} /> },
        { name: "Settings", icon: <Settings size={20} /> },
    ];

    const handleLogout = () => {
        clearTokens();
        navigate("/login");
    };

    return (
        <div className="w-full bg-gray-100 text-gray-900 h-screen flex flex-col shadow-[4px_0_10px_rgba(0,0,0,0.1)]">
            <div className="p-4 text-xl font-bold border-b border-gray-300">MyApp</div>
            <nav className="flex-1">
                {menus.map((menu) => (
                    <div
                        key={menu.name}
                        onClick={() => dispatch(setMenu(menu.name))}
                        className={`flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-200 ${selectedMenu === menu.name ? "bg-gray-200" : ""
                            }`}
                    >
                        {menu.icon}
                        <span>{menu.name}</span>
                    </div>
                ))}
            </nav>
            <div className="border-t border-gray-300 p-4">
                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                >
                    <LogOut size={18} />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
