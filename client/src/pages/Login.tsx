import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doLogin } from "@/apiCall/v1/api_v1";

const Login = () => {
    const { toast } = useToast();
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const params = { emailId, password }
            const { status, accessToken, message, refreshToken } = await doLogin(params);
            if (status) {
                if (rememberMe) {
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                } else {
                    sessionStorage.setItem("accessToken", accessToken);
                    sessionStorage.setItem("refreshToken", refreshToken);
                }
                toast({
                    duration: 5000,
                    variant: 'default',
                    title: message,
                    description: 'Login succefully'
                })
                navigate("/users");
            } else {
                setError("Invalid credentials");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none text-gray-500 hover:text-blue-500"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="form-checkbox text-blue-600"
                            />
                            <span>Remember me</span>
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
