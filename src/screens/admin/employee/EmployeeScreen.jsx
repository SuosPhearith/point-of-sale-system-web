/* eslint-disable react-hooks/exhaustive-deps */
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
import MyButton from "../../../components/general/button/MyButton";
import "./EmployeeScreen.scss";
import makeAPIRequest from "../../../services/makeAPIRequest";
import SpinLayout from "../../../components/general/spin/SpinLayout";
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
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  //::===============================>>Screen action<<================================::
  const getUsers = async () => {
    try {
      const data = await makeAPIRequest(
        "GET",
        `employee?page=${pagination.currentPage}&key=${search}`
      );
      setUsers(data.data);
      setPagination({
        currentPage: data.currentPage,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
      });
    } catch (error) {
      message.error("Something error");
    }
  };
  useEffect(() => {
    getUsers();
  }, [pagination.currentPage]);
  const paginationChange = (current, size) => {
    setPagination({ ...pagination, currentPage: current });
    console.log(`${current}, ${size}`);
  };
  //::================================================================================::
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

  return (
    <MainPage pageName={"Employee"}>
      {users.lenght <= 0 ? (
        <SpinLayout />
      ) : (
        <>
          {/* start header section */}
          <section className="admin-user-header">
            <div className="admin-user-header-left">
              <RiHome4Line size={20} />
              <RiArrowDropRightLine size={32} />
              <span>Employee</span>
            </div>
            <div className="admin-user-header-right">
              <div className="admin-user-header-right-search">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onKeyDown={getUsers}
                  onKeyUp={getUsers}
                />
                <button className="search-btn" onClick={getUsers}>
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
                      <RiToggleLine size={30} />
                    </button>
                  ) : (
                    <button className="search-btn">
                      <RiToggleFill size={30} />
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
            <Pagination
              size="small"
              onChange={(current, size) => paginationChange(current, size)}
              current={pagination.currentPage}
              pageSize={pagination.pageSize}
              total={pagination.totalCount}
            />
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
                  <p style={{ color: "grey" }}>
                    Name <span style={{ color: "red" }}>*</span>
                  </p>
                  <Input
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <p style={{ color: "grey" }}>
                    Email <span style={{ color: "red" }}>*</span>
                  </p>
                  <Input
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <p style={{ color: "grey" }}>
                    Password <span style={{ color: "red" }}>*</span>
                  </p>
                  <Input.Password
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <p style={{ color: "grey" }}>
                    Gender <span style={{ color: "red" }}>*</span>
                  </p>
                  <Select
                    placeholder="Gender"
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
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
        </>
      )}
    </MainPage>
  );
};

export default UserScreen;
