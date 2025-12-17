import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { tryRefresh } from "../store/authSlice";

export default function ProtectedRoute({ children }) {
  const token = useSelector((s) => s.auth.accessToken);
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const run = async () => {
      if (!token) {
        try {
          await dispatch(tryRefresh()).unwrap();
        } catch (_) {}
      }
      setChecked(true);
    };
    run();
  }, [token, dispatch]);
  if (!checked) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
