
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import Charts from "./pages/Charts";
import Methodology from "./pages/Methodology";
import Chatbot from "@/components/ui/Chatbot";
import Users from "./pages/Users";

const App = () => (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/activate" element={<Verify />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/users" element={<Users />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
);

export default App;
