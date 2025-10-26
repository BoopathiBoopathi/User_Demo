import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setMenu } from "@/features/layout/layoutSlice";
import { Users, Settings } from "lucide-react";

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const { selectedMenu } = useAppSelector((state) => state.layout);
    const menus = [
        { name: "Users", icon: <Users size={20} /> },
        { name: "Settings", icon: <Settings size={20} /> },
    ];

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
        </div>
    );
};

export default Sidebar;
