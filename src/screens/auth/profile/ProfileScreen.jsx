import { Input, Modal, Select, message } from "antd";
import { BsFillInfoCircleFill } from "react-icons/bs";
import MainPage from "../../../components/page/MainPage";
import "./ProfileScreen.scss";
import { Link } from "react-router-dom";
import makeAPIRequest from "../../../services/makeAPIRequest";
import { useEffect, useState } from "react";
import MyButton from "../../../components/general/button/MyButton";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/female.png";
const imageUrl = import.meta.env.VITE_IMAGE_URL;
const gender = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
];
const ProfileScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState("");
  const [me, setMe] = useState({
    name: "",
    email: "",
    gender: "",
  });
  const showModal = (confirm) => {
    setConfirm(confirm);
    setIsModalOpen(true);
  };
  const handleRemoveAllLoginDevices = () => {
    logoutAllDevices();
    setConfirm("");
    setIsModalOpen(false);
  };
  const handleDelelteAccount = () => {
    deleteAccount();
    setConfirm("");
    setIsModalOpen(false);
  };
  const handleChangePassword = () => {
    changePassword();
    setConfirm("");
    setIsModalOpen(false);
  };
  const handelUpdateProfile = () => {
    updateProfile();
    setConfirm("");
    setIsModalOpen(false);
  };
  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadAvatar(file);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //::===============================>>Screen action<<================================::
  const logoutAllDevices = async () => {
    try {
      const feedback = await makeAPIRequest(
        "PATCH",
        "auth/account/logoutAllDevices"
      );
      if (feedback) {
        message.success("Remove successfully");
        getMe();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  const changePassword = async () => {
    try {
      const { currentPassword, newPassword, confirmPassword } = password;
      if (!currentPassword || !newPassword || !confirmPassword) {
        return message.info("Please input all fields!");
      }
      const feedback = await makeAPIRequest("PATCH", "auth/changePassword", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (feedback) {
        setPassword({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        getMe();
        message.success("Changed password successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  const updateProfile = async () => {
    try {
      const { name, email, gender } = me;
      if (!name || !email || !gender) {
        return message.info("Please input all fields!");
      }
      const feedback = await makeAPIRequest("PATCH", "auth/updateProfile", {
        name,
        email,
        gender,
      });
      if (feedback) {
        setMe({
          name: "",
          email: "",
          gender: "",
        });
        getMe();
        message.success("Changed successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const feedback = await makeAPIRequest(
        "POST",
        "auth/uploadAvatar",
        formData
      );
      if (feedback) {
        getMe();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  const getMe = async () => {
    try {
      const me = await makeAPIRequest("GET", "auth/me");
      if (me) {
        setMe({
          name: me.name,
          email: me.email,
          gender: me.gender,
        });
        setAvatar(me.avatar);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const deleteAccount = async () => {
    try {
      const me = await makeAPIRequest("DELETE", "auth/deleteAccount");
      if (me) {
        message.success("Deleted successfully");
        getMe();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  useEffect(() => {
    getMe();
  }, []);
  //::================================================================================::
  const confirmModal = () => {
    if (confirm === "RemoveAllLoginDevices") {
      return (
        <MyButton
          color="white"
          textColor="black"
          onClick={handleRemoveAllLoginDevices}
        >
          OK
        </MyButton>
      );
    } else if (confirm === "changePassword") {
      return (
        <MyButton
          color="white"
          textColor="black"
          onClick={handleChangePassword}
        >
          OK
        </MyButton>
      );
    } else if (confirm === "updateProfile") {
      return (
        <MyButton color="white" textColor="black" onClick={handelUpdateProfile}>
          OK
        </MyButton>
      );
    } else if (confirm === "deleteAccount") {
      return (
        <MyButton
          color="white"
          textColor="black"
          onClick={handleDelelteAccount}
        >
          OK
        </MyButton>
      );
    }
  };
  return (
    <MainPage pageName="Profile">
      <div className="profile-header">
        <Link
          to="/profile"
          className={`profile-btn ${
            location.pathname === "/profile" ? "profile-btn-active" : ""
          }`}
        >
          <p className="profile-p">Profile</p>
        </Link>
        <Link
          to="/profile/log"
          className={`profile-btn ${
            location.pathname === "/profile/log" ? "profile-btn-active" : ""
          }`}
        >
          <p className="profile-p">Log</p>
        </Link>
      </div>
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-information">Profile information</div>
          <img
            className="profile-image-me"
            src={
              avatar
                ? `${imageUrl}${avatar}`
                : me.gender === "male"
                ? male
                : female
            }
          />
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={(e) => handleUploadAvatar(e)}
          />
          <div className="profile-info">
            <p style={{ color: "grey" }}>
              Name <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              value={me.name}
              onChange={(e) => setMe({ ...me, name: e.target.value })}
              placeholder="Name"
            />
            <p style={{ color: "grey" }}>
              Email <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              value={me.email}
              onChange={(e) => setMe({ ...me, email: e.target.value })}
              placeholder="Email"
            />
            <p style={{ color: "grey" }}>
              Gender <span style={{ color: "red" }}>*</span>
            </p>
            <Select
              placeholder="Gender"
              value={me.gender}
              onChange={(value) => {
                setMe({ ...me, gender: value });
              }}
              style={{
                width: "100%",
              }}
              options={gender}
            />
          </div>
          <button
            className="profile-btn-save"
            onClick={() => showModal("updateProfile")}
          >
            <h3>Save Change</h3>
          </button>
        </div>
        <div className="profile-card">
          <div className="profile-information">Change password</div>
          <div className="profile-info">
            <p style={{ color: "grey" }}>
              Current password <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              type="password"
              placeholder="Current password"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword({ ...password, currentPassword: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              New password <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              type="password"
              placeholder="New password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Confirm password <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              type="password"
              value={password.confirmPassword}
              placeholder="Confirm password"
              onChange={(e) =>
                setPassword({ ...password, confirmPassword: e.target.value })
              }
            />
          </div>
          <button
            className="profile-btn-save"
            onClick={() => showModal("changePassword")}
          >
            <h3>Save Change</h3>
          </button>
          <div className="profile-information">Advance settings</div>
          <button
            className="profile-btn-save"
            onClick={() => showModal("RemoveAllLoginDevices")}
          >
            <h3>Remove All Login Devices</h3>
          </button>
          <button
            className="profile-btn-delete"
            onClick={() => showModal("deleteAccount")}
          >
            <h3>Delete Account</h3>
          </button>
        </div>
      </div>

      {/* start modal section */}
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleRemoveAllLoginDevices}
        onCancel={handleCancel}
        footer={
          <div className="profile-modal-footer">
            <div style={{ margin: "4px" }}>
              <MyButton color="white" textColor="black" onClick={handleCancel}>
                Cancel
              </MyButton>
            </div>
            <div style={{ margin: "4px" }}>{confirmModal()}</div>
          </div>
        }
      >
        <div className="profile-confirm-modal">
          <BsFillInfoCircleFill size={100} />
          <p>Are you sure?</p>
        </div>
      </Modal>
      {/* end modal section */}
    </MainPage>
  );
};

export default ProfileScreen;
