import { Menu } from "lucide-react";
import { useAppDispatch } from "../store/hooks";
import { toggleSidebar } from "../store/appSlice";

const Header = () => {
    const dispatch = useAppDispatch();

    return (
        <header className="bg-white shadow-md flex items-center justify-between px-4 py-3 md:hidden sticky top-0 z-40">
            <h1 className="text-lg font-semibold">My Dashboard</h1>
            <button onClick={() => dispatch(toggleSidebar())}>
                <Menu size={22} />
            </button>
        </header>
    );
};

export default Header;
