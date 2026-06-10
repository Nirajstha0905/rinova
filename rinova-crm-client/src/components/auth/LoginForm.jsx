import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  Mail,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLogin = ({ email, password }) => {
  const nextErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    nextErrors.email = "Email is required.";
  } else if (!emailPattern.test(trimmedEmail)) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    nextErrors.password = "Password is required.";
  } else if (password.length < 6) {
    nextErrors.password = "Password must be at least 6 characters.";
  }

  return nextErrors;
};

const getFriendlyLoginError = (message = "") => {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid")) {
    return "Incorrect email or password.";
  }
  if (normalized.includes("incorrect")) {
    return "Incorrect email or password.";
  }
  if (normalized.includes("credentials")) {
    return "Incorrect email or password.";
  }
  if (normalized.includes("connect") || normalized.includes("network")) {
    return "Cannot connect to the server. Make sure the API is running.";
  }
  if (normalized.includes("required")) {
    return "Please enter both your email and password.";
  }

  return message || "Login failed. Please try again.";
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const updateEmail = (value) => {
    setEmail(value);
    setServerError("");
    setErrors((current) => ({ ...current, email: "" }));
  };

  const updatePassword = (value) => {
    setPassword(value);
    setServerError("");
    setErrors((current) => ({ ...current, password: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validateLogin({ email, password });
    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      const message = getFriendlyLoginError(error.message);
      if (message.toLowerCase().includes("incorrect")) {
        setErrors({
          email: "Incorrect email or password.",
          password: "Incorrect email or password.",
        });
      }
      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();

    const trimmedEmail = resetEmail.trim();
    if (!trimmedEmail) {
      setResetMessage("Enter your account email first.");
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setResetMessage("Enter a valid account email.");
      return;
    }

    setResetMessage(
      "Password reset is not enabled on the server yet. Please contact a Super Admin or Consultancy Admin to reset this account."
    );
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
    setErrors({});
    setServerError("");
    toast.success(`Demo ${demoType} credentials loaded`);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
      <p className="text-gray-500 mb-6">
        Enter your credentials to access the platform
      </p>

      {serverError && (
        <div className="mb-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block mb-2 text-sm font-bold" htmlFor="login-email">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              className={`w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-300 focus:ring-red-200"
                  : "focus:ring-violet-500"
              }`}
              disabled={loading}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-sm font-bold" htmlFor="login-password">
              Password
            </label>
            <button
              type="button"
              onClick={() => {
                setResetEmail(email);
                setResetMessage("");
                setShowForgotPassword(true);
              }}
              className="text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => updatePassword(e.target.value)}
              className={`w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-300 focus:ring-red-200"
                  : "focus:ring-violet-500"
              }`}
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {showForgotPassword && (
        <form
          onSubmit={handleForgotPassword}
          className="mt-5 rounded-xl border border-violet-100 bg-violet-50/60 p-4"
          noValidate
        >
          <div className="flex items-start gap-3">
            <HelpCircle size={18} className="mt-0.5 flex-shrink-0 text-violet-600" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Reset password</p>
              <p className="mt-1 text-xs text-gray-600">
                Enter your account email. Server-side reset emails are not configured yet.
              </p>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setResetMessage("");
                }}
                placeholder="name@example.com"
                className="mt-3 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {resetMessage && (
                <p className="mt-2 text-xs text-gray-700">{resetMessage}</p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                >
                  Check reset option
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-green-600" />
        <p>
          Passwords are case-sensitive. If your account was created by an admin,
          use the exact temporary password they provided.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t">
        <p className="text-xs text-gray-500 mb-3 font-semibold">
          DEMO CREDENTIALS (Development)
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials("admin")}
            className="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-sm font-medium text-purple-700 border border-purple-200"
          >
            Admin Account
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials("staff")}
            className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-sm font-medium text-blue-700 border border-blue-200"
          >
            Staff Account
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials("agent")}
            className="w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition text-sm font-medium text-green-700 border border-green-200"
          >
            Agent Account
          </button>
        </div>
      </div>
    </div>
  );
}
