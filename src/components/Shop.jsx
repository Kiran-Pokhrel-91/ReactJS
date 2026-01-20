import { useState } from "react";
import Product from "./Product";
import Cart from "./Cart";

const Shop = () => {
    const [addToCart, setAddToCart] = useState({});
  return (
    <div className="flex">
      <div className="ml-5">
        <Product addToCart={addToCart} setAddToCart={setAddToCart} />
      </div>

      <div className="ml-5">
        <Cart cartItems={addToCart} />
      </div>
    </div>
  );
};

export default Shop;
