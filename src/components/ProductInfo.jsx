const ProductInfo = () => {
    const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 25.99
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 89.99
  },
  {
    id: 3,
    name: "HD Monitor",
    price: 199.99
  },
  {
    id: 4,
    name: "USB-C Hub",
    price: 49.99
  }
];

  return (
    <div>
        <h1>Product Info</h1>

        {products.map((product,i) => (
            <ul key={product.id}>
                Product: {i+1}
                <li>Name: {product.name}</li>
                <li>Price: {product.price}</li>
            </ul>
        ))}

    </div>
  )
}

export default ProductInfo