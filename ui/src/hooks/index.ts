"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.warn(isAuthenticated, user)

  // useEffect(() => {
  //   dispatch(loadFromStorage());
  // }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout())
    router.replace("/login");
  };

  return { isAuthenticated, user, handleLogout };
}

