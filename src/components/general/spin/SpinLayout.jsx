//::================================>>Third party<<=================================::
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
//::================================================================================::

const SpinLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: "200px",
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 24,
            }}
            spin
          />
        }
      />
    </div>
  );
};

export default SpinLayout;
