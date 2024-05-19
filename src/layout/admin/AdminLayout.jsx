//::================================>>Core library<<================================::
//::================================================================================::

//::================================>>Third party<<=================================::
import { Outlet } from "react-router-dom";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import Sidebar from "./sidebar/Sidebar";
//::================================================================================::

const AdminLayout = () => {
  return (
    <main className="page-wrapper">
      {/* left of page */}
      <Sidebar />
      {/* right side/content of the page */}
      <div className="content-wrapper">
        <Outlet />
      </div>
    </main>
  );
};

export default AdminLayout;
