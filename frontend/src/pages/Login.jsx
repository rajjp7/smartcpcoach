import { useState } from "react";
import axios from "../api"; // axios must have withCredentials: true
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { User, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", form);
      alert("Login successful!");
      navigate("/dashboard"); 
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    body {
        font-family: 'Poppins', sans-serif;
    }

    .bg-noise::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.03;
      pointer-events: none;
      z-index: -1;
    }

    .animated-gradient-bg {
      background: linear-gradient(300deg, #020617, #083344, #020617);
      background-size: 200% 200%;
      animation: gradient-animation 15s ease infinite;
    }

    @keyframes gradient-animation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

   return (
    <>
      <style>{customStyles}</style>
      <div className="flex items-center justify-center min-h-screen font-poppins animated-gradient-bg bg-noise text-white">
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md m-4"
        >
          <form
            onSubmit={handleLogin}
            className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-cyan-500/20 space-y-6"
          >
            <div className="text-center">
               <h1 
                  className="text-3xl font-bold tracking-tight text-white flex items-center justify-center space-x-1"
                >
                  <span className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
                    Smart
                  </span>
                  <span className="text-cyan-400">CP</span>
                  <span className="text-white">Coach</span>
                </h1>
              <h2 className="mt-2 text-2xl font-semibold text-white">Welcome Back</h2>
              <p className="text-sm text-gray-400">Sign in to continue your journey.</p>
            </div>
            
            {/* Form Inputs */}
            <div className="relative">
              <User className="absolute top-1/2 left-3 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full p-3 pl-10 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 pl-10 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                onChange={handleChange}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-cyan-500 text-slate-900 font-bold py-3 rounded-lg shadow-lg hover:bg-cyan-400 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Register
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
}
