
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardLayout from "./features/layout/DashboardLayout";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<DashboardLayout />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </>

  );
}
