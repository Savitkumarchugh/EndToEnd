import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MEMBERS_API } from "../config/api";

export default function LogIn() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "owner",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    setMessage("");

    if (!form.email || !form.password) {
      setMessage("⚠️ Email and Password are required");
      return;
    }

    // ---------------- SIGNUP ----------------
    if (!isLogin) {
      if (!form.name) {
        setMessage("⚠️ Name is required");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setMessage("❌ Passwords do not match");
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(MEMBERS_API.SIGNUP, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage("✅ Signup successful! Please login.");
          setIsLogin(true);
        } else {
          setMessage(data.error || "Signup failed ❌");
        }
      } catch (err) {
        console.error(err);
        setMessage("Server error ❌");
      } finally {
        setLoading(false);
      }

      return;
    }

    // ---------------- LOGIN ----------------
    try {
      setLoading(true);

      const res = await fetch(MEMBERS_API.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login Successful");

        // 🔐 store JWT token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

          if (data.user.role === "owner") {
    navigate("/owner");
  } else if (data.user.role === "trainer") {
    navigate("/trainer");
  } else {
    navigate("/user");
  }
        

        // 👉 redirect based on role (optional)
        // window.location.href = "/dashboard";
      } else {
        setMessage(data.error || "❌ Email or Password wrong");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-gray-900 p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          {isLogin ? "Login to A1 Fitness" : "Create Account"}
        </h1>

        <p className="mt-2 text-gray-400 text-center">
          {isLogin
            ? "Welcome back! Continue your fitness journey 💪"
            : "Start your transformation today 🚀"}
        </p>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-sm text-yellow-400">
            {message}
          </p>
        )}

        <div className="mt-6 space-y-4">

          {/* NAME */}
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 bg-gray-800 rounded-xl"
              value={form.name}
              onChange={handleChange}
            />
          )}

          {/* ROLE */}
          {!isLogin && (
            <select
              name="role"
              className="w-full p-3 bg-gray-800 rounded-xl"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="trainer">Trainer</option>
              <option value="owner">Gym Owner</option>
            </select>
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-800 rounded-xl"
            value={form.email}
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 bg-gray-800 rounded-xl pr-12"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          {!isLogin && (
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 bg-gray-800 rounded-xl pr-12"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          )}

          {/* REMEMBER ME (LOGIN ONLY) */}
          {isLogin && (
            <div className="flex justify-end text-sm text-gray-400">
              <button className="hover:text-white">
                Forgot Password?
              </button>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 p-3 rounded-xl text-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </div>

        {/* TOGGLE */}
        <p className="mt-6 text-center text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-green-500 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </section>
  );
}