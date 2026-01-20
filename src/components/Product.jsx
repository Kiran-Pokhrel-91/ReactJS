import React from "react";

const Product = ({ addToCart, setAddToCart }) => {
const products = {
  1: { id: 1, name: "Wireless Mouse", price: 29.99 },
  2: { id: 2, name: "Mechanical Keyboard", price: 89.99 },
  3: { id: 3, name: "Notebook", price: 4.99 },
  4: { id: 4, name: "Water Bottle", price: 14.99 },
  5: { id: 5, name: "Laptop Stand", price: 39.99 },
  6: { id: 6, name: "USB-C Hub", price: 24.99 },
  7: { id: 7, name: "Wireless Earbuds", price: 59.99 },
  8: { id: 8, name: "Desk Lamp", price: 34.99 },
};


  const productList = Object.values(products);

  const handleCart = (prodId) => {
    const cartItem = { [prodId]: { ...products[prodId] } };
    setAddToCart((prev) => {
      if (prev[prodId]) return prev; // skip if already added
      return { ...prev, ...cartItem };
    });
  };

  return (
    <div className="max-w-5xl mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productList.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition transform hover:-translate-y-1"
        >
          <div className="mb-4">
            <div className="h-32 w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
              Image
            </div>

            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 font-medium mt-1">${product.price.toFixed(2)}</p>
          </div>

          <button
            className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition"
            onClick={() => handleCart(product.id)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Product;
