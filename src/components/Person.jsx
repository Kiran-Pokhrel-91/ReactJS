const Person = () => {
  return <User name="kiran" age="18" />;
};

const User = (props) => {
  return (
    <section>
      <h2>Name: {props.name}</h2>
      <p>Age: {props.age}</p>
    </section>
  );
};

export default Person;
