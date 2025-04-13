import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity, removeFromCart } from "../../redux/slices/cartSlice"; // Ensure `removeFromCart` is imported

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle increasing or decreasing product quantity in the cart
  const handleUpdateQuantity = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;

    // Only update if new quantity is 1 or more
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  // Handle removing a product completely from the cart
  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          {/* Product Image and Info */}
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4"
            />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {product.size} | Color: {product.color}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center mt-2 space-x-4">
                <button
                  onClick={() =>
                    handleUpdateQuantity(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-lg font-medium"
                >
                  -
                </button>
                <span className="text-lg">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleUpdateQuantity(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Price and Delete */}
          <div className="text-right">
            <p className="font-semibold">$ {product.price.toLocaleString()}</p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
              className="mt-2"
              title="Remove from cart"
            >
              <RiDeleteBin3Line className="h-6 w-6 text-red-600 hover:text-red-800" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
