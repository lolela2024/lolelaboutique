"use client"
import React, { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Aici va trebui să apelezi API-ul tău pentru a înregistra utilizatorul
      const response = await axios.post("/api/auth/register", formData);
      if (response.status === 200) {
        // Redirecționează utilizatorul după înregistrare cu succes
        router.push("/dashboard");
      } else {
        setError("Failed to register");
      }
    } catch (error) {
      setError("Error occurred during registration");
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        h1 {
          font-size: 2rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        input {
          padding: 0.5rem;
          font-size: 1rem;
        }
        .error {
          color: red;
        }
        button {
          padding: 0.75rem 1.5rem;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
