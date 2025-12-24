const Product = () => {
  return (
    <Item name="Laptop" price="1,50,000" />
  )
}

const Item = ({name,price}) => {
    return(
        <section>
            <h2>Product: {name}</h2>
            <p>Price: {price}</p>
        </section>
    )
}



export default Product