import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { requestPasswordReset } from "../store/authSlice";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(requestPasswordReset({ email })).unwrap();
      setMsg(res);
    } catch (_) {}
  };
  return (
    <div className="card">
      <h2>Forgot Password</h2>
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="button mt-3" type="submit">Send</button>
      </form>
      {msg && <div className="mt-3" style={{ color:"#93c5fd" }}>{msg}</div>}
    </div>
  );
}
