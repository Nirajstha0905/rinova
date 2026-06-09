import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (demoType) => {
    const demos = {
      admin: {
        email: "admin@rinova.com",
        password: "Admin@123",
      },
      staff: {
        email: "staff@rinova.com",
        password: "Staff@123",
      },
      agent: {
        email: "agent@rinova.com",
        password: "Agent@123",
      },
    };

    const credentials = demos[demoType];
    setEmail(credentials.email);
    setPassword(credentials.password);
    toast.success(`Demo ${demoType} credentials loaded`);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
      <p className="text-gray-500 mb-6">Enter your credentials to access the platform</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-bold">Email</label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-bold">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Demo Credentials Section */}
      <div className="mt-8 pt-6 border-t">
        <p className="text-xs text-gray-500 mb-3 font-semibold">DEMO CREDENTIALS (Development)</p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials("admin")}
            className="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-sm font-medium text-purple-700 border border-purple-200"
          >
            👨‍💼 Admin Account
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials("staff")}
            className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-sm font-medium text-blue-700 border border-blue-200"
          >
            👤 Staff Account
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials("agent")}
            className="w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition text-sm font-medium text-green-700 border border-green-200"
          >
            🤝 Agent Account
          </button>
        </div>
      </div>
    </div>
  );
}