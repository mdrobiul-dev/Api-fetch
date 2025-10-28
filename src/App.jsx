import { BrowserRouter, Route, Routes } from "react-router-dom";
import BlogDetails from "./components/home/BlogDetails";
import EcommerceLanding from "./pages/EcommerceLanding";
import RegistrationForm from "./pages/RegistrationForm";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<RegistrationForm />} />
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/landing" element={<EcommerceLanding />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

