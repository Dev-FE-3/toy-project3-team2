import { Navigate, Outlet } from "react-router-dom";

import useUserStore from "@/store/useUserStore";

export const ProtectedRoute = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
