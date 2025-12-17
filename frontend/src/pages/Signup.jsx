import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signup, fetchMe } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup({ email, username, password })).unwrap();
      await dispatch(fetchMe());
      navigate("/dashboard");
    } catch (_) {}
  };
  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="button mt-3" type="submit">Signup</button>
      </form>
      <div className="mt-3">
        <Link className="link" to="/login">Login</Link>
      </div>
    </div>
  );
}
