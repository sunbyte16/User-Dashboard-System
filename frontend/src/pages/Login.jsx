import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchMe } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((s) => s.auth.error);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      await dispatch(fetchMe());
      navigate("/dashboard");
    } catch (_) {}
  };
  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="button mt-3" type="submit">Login</button>
      </form>
      <div className="mt-3">
        <Link className="link" to="/signup">Signup</Link> &nbsp;|&nbsp; <Link className="link" to="/forgot-password">Forgot password</Link>
      </div>
      {error && <div className="mt-3" style={{ color:"#fca5a5" }}>{error}</div>}
    </div>
  );
}
