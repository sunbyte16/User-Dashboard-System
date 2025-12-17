import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../store/authSlice";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token") || "";
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {}, [token]);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(resetPassword({ token, new_password: password })).unwrap();
      setMsg(res);
      navigate("/login");
    } catch (_) {}
  };
  return (
    <div className="card">
      <h2>Reset Password</h2>
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="button mt-3" type="submit">Reset</button>
      </form>
      {msg && <div className="mt-3" style={{ color:"#93c5fd" }}>{msg}</div>}
    </div>
  );
}
