//::================================>>Core library<<================================::
import { useEffect } from "react";
//::================================================================================::

//::================================>>Third party<<=================================::
import { Route, Routes, useNavigate } from "react-router-dom";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { PageNotFound } from "../screens";
import LoginScreen from "../screens/auth/login/LoginScreen";
import AuthLayout from "../layout/auth/AuthLayout";
//::================================================================================::

const AuthRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth/login");
  }, [navigate]);
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default AuthRoute;
