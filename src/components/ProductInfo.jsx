const ProductInfo = () => {
    const name = "Laptop"
    const price = "Rs. 2,50,000"
    const availability = "In Stock" 
  return (
    <div>
        <h2>Products</h2>
            <p>Name:{name} </p>
            <p>Price:{price}</p>
            <p>Availability:{availability}</p>
    </div>
  )
}

export default ProductInfo