//::================================>>Core library<<================================::
//::================================================================================::

//::================================>>Third party<<=================================::
//::================================================================================::

//::===============================>>Custom library<<===============================::
//::================================================================================::
import { Link } from "react-router-dom";
import "./PageNotFound.scss";
const PageNotFound = () => {
  return (
    <div className="main-pnf">
      <h1 className="key-pnf">404</h1>
      <h1 className="text-pnf">Page not found!</h1>
      <Link to="/" className="btn-pnf">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default PageNotFound;
