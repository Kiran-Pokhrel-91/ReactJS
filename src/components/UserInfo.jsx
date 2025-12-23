const UserInfo = () => {
    const users = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    location: "New York, USA"
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    location: "London, UK"
  },
  {
    name: "Carla Martinez",
    email: "carla.martinez@example.com",
    location: "Madrid, Spain"
  },
  {
    name: "David Lee",
    email: "david.lee@example.com",
    location: "Seoul, South Korea"
  }
];

  return (
    <div>
        <h1>Users Info</h1>
    
        {users.map((user,i) => (
            <ul key={Math.random()}>
                User: {i+1}
                <li>Name: {user.name}</li>
                <li>Email: {user.email}</li>
                <li>Location: {user.location}</li>
            </ul>
        ))}

    </div>
  )
}

export default UserInfo