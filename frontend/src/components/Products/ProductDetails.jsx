import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Use productId from props or fallback to URL param
  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    } else {
      setMainImage("https://via.placeholder.com/500"); // Default placeholder image
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    setQuantity((prev) => (action === "plus" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.");
      return;
    }

    setIsButtonDisabled(true);

    try {
      await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId: user?._id,
        })
      ).unwrap();
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add product to cart. Try again.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  if (loading) return <p className="text-center">Loading product details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!selectedProduct) return <p className="text-center text-red-500">Product not found</p>;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2">
            <img 
              src={mainImage} 
              alt={selectedProduct.name || "Product Image"} 
              className="w-full h-auto rounded-lg"
            />
            <div className="flex overflow-x-auto space-x-4 mt-2">
              {selectedProduct?.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 cursor-pointer border rounded ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl font-semibold">{selectedProduct?.name}</h1>
            <p className="text-gray-500 mb-2 text-lg">
              <span className="font-bold">Price:</span> ${selectedProduct?.discountPrice || selectedProduct?.price}
            </p>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="font-semibold">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct?.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border transition ${
                      selectedColor === color ? "border-black scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="font-semibold">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct?.sizes?.map((size) => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)} 
                    className={`px-4 py-2 border transition ${
                      selectedSize === size ? "bg-black text-white border-black" : "border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-4 flex items-center">
              <p className="font-semibold mr-4">Quantity:</p>
              <button onClick={() => handleQuantityChange("minus")} className="px-3 py-1 bg-gray-200 rounded">-</button>
              <span className="mx-3">{quantity}</span>
              <button onClick={() => handleQuantityChange("plus")} className="px-3 py-1 bg-gray-200 rounded">+</button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart} 
              disabled={isButtonDisabled} 
              className="bg-black text-white py-2 px-6 rounded w-full transition hover:bg-gray-800"
            >
              {isButtonDisabled ? "Adding..." : "ADD TO CART"}
            </button>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Similar Products</h2>
          <ProductGrid products={similarProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
