
import { useState } from "react";
import { loginUser, registerUser } from "./api";
import { ShieldCheck, Eye, EyeOff, Sparkles } from "lucide-react";

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRegister = mode === "register";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        setSuccess("Registration successful! Please sign in.");
        setMode("login");
        setPassword("");
      } else {
        const data = await loginUser({
          email: email.trim(),
          password,
        });

        onLogin(data);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">V</div>
          <span>VE<span>LOOP</span></span>
        </div>

        <div className="auth-heading">
          <div className="auth-sparkle">
            <Sparkles size={19} />
          </div>
          <p className="auth-eyebrow">YOUR REWARDS JOURNEY STARTS HERE</p>
          <h1>{isRegister ? "Create your account" : "Welcome back!"}</h1>
          <p>
            {isRegister
              ? "Join VELoop and start earning rewards."
              : "Sign in to continue to your VELoop dashboard."}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={!isRegister ? "selected" : ""}
            onClick={() => {
              setMode("login");
              setError("");
              setSuccess("");
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            className={isRegister ? "selected" : ""}
            onClick={() => {
              setMode("register");
              setError("");
              setSuccess("");
            }}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Full Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                maxLength={100}
                required
              />
            </label>
          )}

          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              maxLength={120}
              required
            />
          </label>

          <label>
            Password
            <div className="auth-password">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <div className="auth-security">
          <ShieldCheck size={16} />
          <span>Your account is protected with secure authentication.</span>
        </div>

        <p className="auth-footer">
          © 2026 VELoop Rewards. All rights reserved.
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
