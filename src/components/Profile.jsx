import React, { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    age: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>User Profile</h1>

      <label>
        Name:
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={profile.name}
          onChange={handleChange}
        />
      </label>

      <br />

      <label>
        Age:
        <input
          type="text"
          name="age"
          placeholder="Enter your age"
          value={profile.age}
          onChange={handleChange}
        />
      </label>

      <h2>Profile Information</h2>
      <p>Name: {profile.name}</p>
      <p>Age: {profile.age}</p>
    </div>
  );
};

export default Profile;
