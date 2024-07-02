//::================================>>Core library<<================================::
import { Route, Routes } from "react-router-dom";
//::================================================================================::

//::================================>>Third party<<=================================::
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { PageNotFound } from "../screens";
import ProfileScreen from "../screens/auth/profile/ProfileScreen";
import LogScreen from "../screens/auth/profile/LogScreen";
import CustomerScreen from "../screens/views/customer/CustomerScreen";
import OrderScreen from "../screens/views/order/OrderScreen";
import EmployeeLayout from "../layout/employee/EmployeeLayout";
//::================================================================================::

const EmployeeRoute = () => {
  return (
    <Routes>
      <Route element={<EmployeeLayout />}>
        <Route path="/" element={<OrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile/log" element={<LogScreen />} />
        <Route path="/customer" element={<CustomerScreen />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default EmployeeRoute;
