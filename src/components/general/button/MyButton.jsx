//::================================>>Third party<<=================================::
import PropTypes from "prop-types";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import "./MyButton.scss";
//::================================================================================::
const MyButton = ({ children, color, textColor }) => {
  return (
    <button style={{ backgroundColor: `${color}` }} className="my-btn">
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
};

export default MyButton;
