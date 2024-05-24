//::================================>>Core library<<================================::
import { useEffect, useState } from "react";
//::================================================================================::

//::================================>>Third party<<=================================::
import {
  RiHome4Line,
  RiArrowDropRightLine,
  RiAddCircleLine,
  RiSearchLine,
  RiToggleFill,
  RiEyeFill,
  RiEditFill,
  RiDeleteBinFill,
  RiToggleLine,
} from "react-icons/ri";
import { Input, Modal, Pagination, Select, Space, message } from "antd";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import MainPage from "../../../components/page/MainPage";
import { data } from "../../../utils/global/data";
import MyButton from "../../../components/general/button/MyButton";
import "./EmployeeScreen.scss";
import makeAPIRequest from "../../../services/makeAPIRequest";
//::================================================================================::

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
const UserScreen = () => {
  //::===============================>>Screen action<<================================::
  const getUsers = async () => {
    try {
      const data = await makeAPIRequest("GET", "employee");
      console.log(data);
    } catch (error) {
      message.error("Something error");
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  //::================================================================================::
  const users = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    gender: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  const handleFormCancel = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      gender: "",
    });
  };

  const handleChange = (value, key) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
    <MainPage pageName={"Employee"}>
      {/* start header section */}
      <section className="admin-user-header">
        <div className="admin-user-header-left">
          <RiHome4Line size={20} />
          <RiArrowDropRightLine size={32} />
          <span>Employee</span>
        </div>
        <div className="admin-user-header-right">
          <div className="admin-user-header-right-search">
            <input type="text" placeholder="Search" />
            <button className="search-btn">
              <RiSearchLine size={20} />
            </button>
          </div>
          <div
            className="admin-user-header-right-create"
            onClick={() => setIsModalOpen(true)}
          >
            <RiAddCircleLine size={29} className="create-btn-hover" />
          </div>
        </div>
      </section>
      {/* end header section */}
      {/* start table section */}
      <section className="admin-user-table">
        <div className="admin-user-table-header">
          <div className="name">Name</div>
          <div className="email">Email</div>
          <div className="active-emp">Active</div>
          <div className="avatar-emp">Avatar</div>
          <div className="gender-emp">Gender</div>
          <div className="action-emp">Action</div>
        </div>
        {users.map((user, index) => (
          <div className="admin-user-table-header-data" key={index}>
            <div className="name">{user.name}</div>
            <div className="email">{user.email}</div>
            <div className="active-emp">
              {user.active ? (
                <button className="search-btn">
                  <RiToggleFill size={30} />
                </button>
              ) : (
                <button className="search-btn">
                  <RiToggleLine size={30} />
                </button>
              )}
            </div>
            <div className="avatar-emp">
              <img src={user.avatar} alt="" />
            </div>
            <div className="gender-emp">{user.gender.toUpperCase()}</div>
            <div className="action-emp">
              <div className="action-inside">
                <button className="search-btn btn-action">
                  <RiEyeFill size={20} />
                </button>
                <button className="btn-action">
                  <RiEditFill size={20} color="blue" />
                </button>
                <button className="btn-action">
                  <RiDeleteBinFill size={20} color="red" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
      {/* end table section */}
      {/* start pagination section */}
      <section className="admin-user-pagination">
        <Pagination size="small" total={500} />
      </section>
      {/* end pagination section */}

      {/* start create modal */}
      <Modal
        title="Create User"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        <section className="my-form-section">
          <form onSubmit={handleFormSubmit}>
            <Space style={{ width: "100%" }} direction="vertical">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => handleChange(e.target.value, "name")}
              />
              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange(e.target.value, "email")}
              />
              <Input.Password
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleChange(e.target.value, "password")}
              />
              {/* <Select
                placeholder="Role"
                onChange={(value) => handleChange(value, "role")}
                style={{
                  width: "100%",
                }}
                options={role}
              /> */}
              <Select
                placeholder="Gender"
                onChange={(value) => handleChange(value, "gender")}
                style={{
                  width: "100%",
                }}
                options={gender}
              />
            </Space>
            <div className="btn-create-form">
              <Space>
                <MyButton
                  color="blue"
                  textColor="white"
                  onClick={handleFormCancel}
                >
                  Cancel
                </MyButton>
                <MyButton color="white" textColor="black" type="submit">
                  Create
                </MyButton>
              </Space>
            </div>
          </form>
        </section>
      </Modal>
      {/* end create modal */}
    </MainPage>
  );
};

export default UserScreen;
