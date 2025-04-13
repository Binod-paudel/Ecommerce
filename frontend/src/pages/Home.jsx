import React, { useState, useEffect } from "react";
import axios from "axios";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import FeaturedCollection from "../components/Products/FeaturedCollection.jsx";
import FeaturesSection from "../components/Products/FeaturesSection.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice.js";

const Home = () => {
  const dispatch = useDispatch();
  
  // Access products, loading, and error state from the Redux store
  const { products, loading, error } = useSelector((state) => state.products);
  
  // State for storing the best seller product
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  // UseEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Dispatch action to fetch filtered products (Women - Bottom Wear)
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear", // Make sure category name is correct
        limit: 8, // Limit to 8 products
      })
    );

    // Async function to fetch the best seller product from the backend
    const fetchBestSeller = async () => {
      try {
        // Make sure the backend URL is set correctly in .env file
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v2/products/best-seller`);
        setBestSellerProduct(response.data); // Store best seller product
      } catch (error) {
        console.error("Error fetching best seller:", error);
      }
    };

    // Call fetchBestSeller on component mount
    fetchBestSeller();
  }, [dispatch]); // Empty dependency array ensures this runs once after initial render

  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Gender Collection Section */}
      <GenderCollectionSection />
      
      {/* New Arrivals Section */}
      <NewArrivals />

      {/* Best Seller Section */}
      <h2 className="text-3xl text-center font-bold mb-4 mt-8">Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">Loading best seller product...</p>
      )}

      {/* Top Wears for Women Section */}
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">Top Wears for Women</h2>
        {/* Product Grid for filtered products */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      
      {/* Featured Collection Section */}
      <FeaturedCollection />
      
      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

export default Home;
