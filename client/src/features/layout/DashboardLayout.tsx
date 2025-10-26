import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppSelector } from "@/app/hooks";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";

const DashboardLayout = () => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const { selectedMenu } = useAppSelector((state) => state.layout);

    if (!token) {
        return <Navigate to="/login" />;
    }

    const renderContent = () => {
        switch (selectedMenu) {
            case "Users":
                return <Users />;
            case "Settings":
                return <Settings />;
            default:
                return <Users />
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-[15%]">
                <Sidebar />
            </div>

            <div className="flex-1 overflow-y-auto p-5">
                {renderContent()}
            </div>
        </div>
    );
};

export default DashboardLayout;
