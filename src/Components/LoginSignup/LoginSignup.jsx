import confetti from "canvas-confetti";
import { useState } from "react";
import emailIcon from "../Assets/email.png";
import passwordIcon from "../Assets/password.png";
import userIcon from "../Assets/person.png";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [mode, setMode] = useState("Sign Up"); // "Sign Up" | "Login"
  const isLogin = mode === "Login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [createdUser, setCreatedUser] = useState(null);

  // loading states
  const [isRedirecting, setIsRedirecting] = useState(false); // 5 sec after signup
  const [isLoggingIn, setIsLoggingIn] = useState(false); // 3 sec on login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/\d/.test(password))
      return "Password must contain at least one number";
    return "";
  };

  const handleSignUp = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please fill the name field";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please fill the email field";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email ID";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Please fill the password field";
    } else {
      const pwdError = validatePassword(formData.password);
      if (pwdError) newErrors.password = pwdError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("⚠️ Please fill the above fields correctly.");
      return;
    }

    // success signup / reset password
    setErrors({});
    setCreatedUser({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });

    setMessage("🎉 Account updated / created! Redirecting to Login...");
    setIsRedirecting(true);

    // 5 sec loading, then go to Login page
    setTimeout(() => {
      setIsRedirecting(false);
      setMode("Login");
      setMessage("Now login with your email and password.");
      // form clear pannalaam
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    }, 5000);
  };

  const handleLogin = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please fill the email field";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email ID";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Please fill the password field";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("⚠️ Please fill the above fields correctly.");
      return;
    }

    if (
      createdUser &&
      formData.email === createdUser.email &&
      formData.password === createdUser.password
    ) {
      // 3 sec loading, then celebration
      setIsLoggingIn(true);
      setMessage("⏳ Logging in...");

      setTimeout(() => {
        setIsLoggingIn(false);
        setMessage(`🎉 Welcome back, ${createdUser.name}! You are logged in.`);
        confetti({
          particleCount: 200,
          spread: 80,
          origin: { y: 0.6 },
        });
      }, 3000);
    } else if (createdUser) {
      setMessage("❌ Email or password is incorrect. Try again.");
    } else {
      setMessage("✅ Login clicked (demo). In real app this will call API.");
    }
  };

  const switchToSignUp = () => {
    setMode("Sign Up");
    setMessage("");
    setErrors({});
  };

  const switchToLogin = () => {
    setMode("Login");
    setMessage("");
    setErrors({});
  };

  const handleForgotPassword = () => {
    // forgot password click -> go to Sign Up flow to reset password
    setMode("Sign Up");
    setMessage(
      "🔁 Reset your password: enter your name, email and new password, then click Sign Up."
    );
    setErrors({});
  };

  return (
    <div className="container">
      {/* Overlay loading - redirect / login loading */}
      {(isRedirecting || isLoggingIn) && (
        <div className="overlay">
          <div className="loader"></div>
          <p>{isRedirecting ? "Redirecting to Login..." : "Logging in..."}</p>
        </div>
      )}

      {message && <div className="toast">{message}</div>}

      <div className="header">
        <div className="text">{mode}</div>
        <div className="underline"></div>
      </div>

      {isLogin && createdUser && (
        <p className="info-text">
          Enter <strong>{createdUser.email}</strong> and your password to login.
        </p>
      )}

      <div className="inputs">
        {!isLogin && (
          <div className={`input ${errors.name ? "input-error" : ""}`}>
            <img src={userIcon} alt="User icon" className="icon" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        )}
        {errors.name && <p className="error-text">{errors.name}</p>}

        <div className={`input ${errors.email ? "input-error" : ""}`}>
          <img src={emailIcon} alt="Email icon" className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && <p className="error-text">{errors.email}</p>}

        <div className={`input ${errors.password ? "input-error" : ""}`}>
          <img src={passwordIcon} alt="Password icon" className="icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      {isLogin && (
        <div className="forgot-password">
          Lost Password? <span onClick={handleForgotPassword}>Click Here!</span>
        </div>
      )}

      <div className="submit-container">
        <button
          type="button"
          className={`submit ${isLogin ? "outline" : ""}`}
          onClick={isLogin ? switchToSignUp : handleSignUp}
        >
          Sign Up
        </button>

        <button
          type="button"
          className={`submit ${!isLogin ? "outline" : ""}`}
          onClick={isLogin ? handleLogin : switchToLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;
