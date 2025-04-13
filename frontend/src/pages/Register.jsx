import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import register from "../assets/register.webp";
import { registerUser } from "../redux/slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Hooks from React Router and Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Select relevant state from Redux
  const { user, guestId } = useSelector((state)=>state.auth);
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


  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("User Registered:", { name, email, password });
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-center font-bold text-2xl mb-6">Hey there! 🙌</h2>
          <p className="text-center mb-6">
            Enter your username and password to Register
          </p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button className="w-full bg-black text-white rounded-lg font-semibold p-2 hover:bg-gray-500 transition">
            Sign Up
          </button>
          <p className="text-sm mt-6 text-center">
            Don't have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="w-full flex flex-col justify-center items-center">
          <img
            src={register}
            alt="Register to account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
