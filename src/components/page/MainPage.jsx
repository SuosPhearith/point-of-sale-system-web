//::================================>>Core library<<================================::
//::================================================================================::

//::================================>>Third party<<=================================::
import PropTypes from "prop-types";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import AreaTop from "./header/AreaTop";
//::================================================================================::

const MainPage = ({ children, pageName }) => {
  return (
    <div className="content-area">
      <AreaTop pageName={pageName} />
      {children}
    </div>
  );
};

MainPage.propTypes = {
  pageName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default MainPage;
