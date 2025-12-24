const Greeting = ({timeOfDay}) => {
    if (timeOfDay == 'morning') return <p>Good Morning!</p>
    if (timeOfDay == 'evening') return <p>Good Evening!</p>
}
export default Greeting