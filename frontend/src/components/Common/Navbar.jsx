import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);

  const cartItemCount = cart?.products?.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="container mx-auto flex items-center justify-between py-4 px-5">
        {/* Left - Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            Rabbit
          </Link>
        </div>

        {/* Center - Navigation Links (Hidden on Mobile) */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?gender=Men&category=Top wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top wear
          </Link>
          <Link
            to="/collections/all?gender=Men&category=Bottom wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom wear
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center space-x-4">
          {/* User Profile */}
          <Link
            to="/Admin"
            className="block bg-black px-2 rounded text-sm text-white"
          >
            Admin
          </Link>
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          {/* Shopping Cart */}
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Search Bar */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleNavDrawer}>
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer Component */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-screen bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col space-y-4 p-6">
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-lg font-medium uppercase"
            onClick={toggleNavDrawer}
          >
            Men
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-lg font-medium uppercase"
            onClick={toggleNavDrawer}
          >
            Women
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-lg font-medium uppercase"
            onClick={toggleNavDrawer}
          >
            Top wear
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-lg font-medium uppercase"
            onClick={toggleNavDrawer}
          >
            Bottom wear
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
