//::================================>>Third party<<=================================::
import PropTypes from "prop-types";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import "./MyButton.scss";
//::================================================================================::
const MyButton = ({ children, color, textColor, onClick }) => {
  return (
    <button
      style={{ backgroundColor: `${color}` }}
      className="my-btn"
      onClick={onClick}
    >
      <div
        style={{
          color: `${textColor}`,
        }}
      >
        {children}
      </div>
    </button>
  );
};

MyButton.propTypes = {
  children: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default MyButton;
