//::================================>>Core library<<================================::
import { Route, Routes } from "react-router-dom";
//::================================================================================::

//::================================>>Third party<<=================================::
//::================================================================================::

//::===============================>>Custom library<<===============================::
import AdminLayout from "../layout/admin/AdminLayout";
import UserScreen from "../screens/admin/user/UserScreen";
import { Dashboard, PageNotFound } from "../screens";
//::================================================================================::

const AdminRoute = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/user" element={<UserScreen />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoute;
