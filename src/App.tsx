
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Verify from "./pages/Verify";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Charts from "./pages/Charts";
import Methodology from "./pages/Methodology";
import Chatbot from "@/components/ui/Chatbot";
import Users from "./pages/Users";
import Blog from "./pages/Blog";
import BlogPost from "./pages/Blog/Post";
import AdminBlog from "./pages/AdminBlog";

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
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/activate" element={<Verify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
