import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice.js";
import { mergeCart } from "../redux/slices/cartSlice.js";
import login from "../assets/login.webp";

const Login = () => {
  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hooks from React Router and Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Select relevant state from Redux
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Get redirect query parameter or default to "/"
  const redirect = searchParams.get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  /**
   * 🔁 useEffect:
   * When the user logs in and a cart exists for the guest,
   * merge guest cart with user cart and then navigate accordingly.
   */
  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        // Merge guest cart into logged-in user cart, then redirect
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        // If no merge is needed, just navigate
        navigate(redirect);
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, redirect, dispatch]);

  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })); // Redux action to log in
  };

  return (
    <div className="flex">
      {/* Left: Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">
            Hey there! 🙌
          </h2>
          <p className="text-center mb-6">
            Enter your username and password to Login
          </p>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Sign In
          </button>

          {/* Redirect to Register */}
          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right: Image */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
