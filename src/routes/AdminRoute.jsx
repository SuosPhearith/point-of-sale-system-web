//::================================>>Core library<<================================::
import { Route, Routes } from "react-router-dom";
//::================================================================================::

//::================================>>Third party<<=================================::
//::================================================================================::

//::===============================>>Custom library<<===============================::
import AdminLayout from "../layout/admin/AdminLayout";
import EmployeeScreen from "../screens/views/employee/EmployeeScreen";
import { Dashboard, PageNotFound } from "../screens";
import ProfileScreen from "../screens/auth/profile/ProfileScreen";
import LogScreen from "../screens/auth/profile/LogScreen";
import CustomerScreen from "../screens/views/customer/CustomerScreen";
import CategoryScreen from "../screens/views/category/CategoryScreen";
//::================================================================================::

const AdminRoute = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employee" element={<EmployeeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile/log" element={<LogScreen />} />
        <Route path="/customer" element={<CustomerScreen />} />
        <Route path="/category" element={<CategoryScreen />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoute;
