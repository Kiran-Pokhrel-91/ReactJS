const Greeting = () => {
    const name = "Ramu"
    const date = `${new Date().getMonth()}/${new Date().getDate()}/${new Date().getFullYear()}`
  return (
    <div>
        <h1>Welcome to my Website {name}!</h1>
        <p>{date}</p>
    </div>
  )
}

export default Greeting