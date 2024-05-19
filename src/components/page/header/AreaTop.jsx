//::================================>>Core library<<================================::
import { useContext } from "react";
//::================================================================================::

//::================================>>Third party<<=================================::
import { MdOutlineMenu } from "react-icons/md";
import PropTypes from "prop-types";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { SidebarContext } from "../../../context/SidebarContext";
import "./AreaTop.scss";
//::================================================================================::

const AreaTop = ({ pageName }) => {
  const { openSidebar } = useContext(SidebarContext);
  return (
    <section className="content-area-top">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <h2 className="area-top-title">{pageName}</h2>
      </div>
    </section>
  );
};

AreaTop.propTypes = {
  pageName: PropTypes.string.isRequired,
};

export default AreaTop;
