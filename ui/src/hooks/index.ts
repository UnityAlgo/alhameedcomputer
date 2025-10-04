  "use client";

  import { useEffect } from "react";
  import { useAppSelector, useAppDispatch } from "@/store/hooks";
  import { loadFromStorage, logout } from "@/store/authSlice";
  import { useRouter } from "next/navigation";

  export function useAuth() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
      dispatch(loadFromStorage());
    }, [dispatch]);

    const handleLogout = () => {
    dispatch(logout())
    router.replace("/login");
    };

    return { isAuthenticated, user, handleLogout };
  }

