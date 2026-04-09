import { Navigate, Outlet, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  isAuthenticated: boolean;
  redirectPath?: string;
};

export default function ProtectedRoute({
  isAuthenticated,
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}