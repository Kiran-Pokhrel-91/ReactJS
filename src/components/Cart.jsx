import React from "react";

const Cart = ({ cartItems }) => {
  const items = Object.values(cartItems);

  const totalPrice = items.reduce((total, product) => total + product.price, 0);

  return (
    <div className="max-w-md mr-5 mt-12 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6 border-b pb-2">
        Shopping Cart
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-12 text-lg">Your cart is empty</p>
      ) : (
        <div className="flex flex-col gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Img
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800 mr-2">{item.name}</h3>
                  <p className="text-gray-600 font-normal mt-1">${item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-3 py-1 rounded-lg transition">
                  -
                </button>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg font-medium">
                  1
                </span>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-3 py-1 rounded-lg transition">
                  +
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t text-lg font-semibold text-gray-900">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
