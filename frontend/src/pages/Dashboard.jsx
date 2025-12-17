import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, logout } from "../store/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);
  return (
    <div className="card">
      <h2>Dashboard</h2>
      {user && (
        <div className="mt-3">
          <div>Email: {user.email}</div>
          <div>Username: {user.username}</div>
        </div>
      )}
      <button className="button mt-4" onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
}
