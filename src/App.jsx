import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import BlogDetails from "./components/home/BlogDetails";
import EcommerceLanding from "./pages/EcommerceLanding";
import RegistrationForm from "./pages/RegistrationForm";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route index element={<Home />} /> */}
           <Route index element={<RegistrationForm />} />
           <Route path="/landing" element={<EcommerceLanding />} />
           <Route path="/login" element={<LoginPage />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
