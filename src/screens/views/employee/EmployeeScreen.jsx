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
import {
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  message,
} from "antd";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import MainPage from "../../../components/page/MainPage";
import MyButton from "../../../components/general/button/MyButton";
import "./EmployeeScreen.scss";
import makeAPIRequest from "../../../services/makeAPIRequest";
import SpinLayout from "../../../components/general/spin/SpinLayout";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/female.png";
//::================================================================================::
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
const UserScreen = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [getOneModal, setGetOneModal] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });
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
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const findOne = async (id) => {
    try {
      const employee = await makeAPIRequest("GET", `employee/${id}`);
      if (employee) {
        setFormData({
          name: employee.name,
          email: employee.email,
          gender: employee.gender,
        });
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  const removeEmployee = async (id) => {
    try {
      if (!id) return message.info("Update ID not found");
      const feedback = await makeAPIRequest("DELETE", `employee/${id}`);
      if (feedback) {
        message.success("Deleted successfully");
        getUsers();
        if (users.length === 1) {
          if (pagination.currentPage > 1) {
            setPagination({
              ...pagination,
              currentPage: pagination.currentPage - 1,
            });
          }
        }
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  const toggleActiveEmployee = async (id) => {
    try {
      if (!id) return message.info("Update ID not found");
      const feedback = await makeAPIRequest(
        "PATCH",
        `employee/${id}/toggle-active`
      );
      if (feedback) {
        getUsers();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  const updateEmployee = async () => {
    try {
      if (!updateId) return message.info("Update ID not found");
      const { name, email, gender } = formData;
      if (!name || !email || !gender)
        return message.info("Please input all fields");
      const feedback = await makeAPIRequest("PATCH", `employee/${updateId}`, {
        name,
        email,
        gender,
      });
      if (feedback) {
        getUsers();
        setUpdateModal(false);
        setUpdateId("");
        message.success("Updated successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  const createEmployee = async () => {
    try {
      const { name, email, password, gender } = formData;
      if (!name || !email || !password || !gender)
        return message.info("Please input all fields");
      const feedback = await makeAPIRequest("POST", "employee", {
        name,
        email,
        password,
        gender,
      });
      if (feedback) {
        setCreateModal(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          gender: "",
        });
        message.success("Created successfully");
        getUsers();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  useEffect(() => {
    setLoading(true);
    getUsers();
  }, []);

  useEffect(() => {
    getUsers();
  }, [pagination.currentPage]);

  const paginationChange = (current, size) => {
    setPagination({ ...pagination, currentPage: current });
    console.log(`${current}, ${size}`);
  };
  //::================================================================================::
  const handleSearch = () => {
    setPagination({ ...pagination, currentPage: 1 });
    getUsers();
  };
  const handleFormSubmit = () => {
    createEmployee();
  };
  const handleFormCancel = () => {
    setCreateModal(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      gender: "",
    });
  };
  const handleUpdate = (id) => {
    findOne(id);
    setUpdateModal(true);
    setUpdateId(id);
  };

  return (
    <MainPage pageName={"Employee"}>
      {loading && !search ? (
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
                  onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
                />
                <button className="search-btn" onClick={getUsers}>
                  <RiSearchLine size={20} />
                </button>
              </div>
              <div
                className="admin-user-header-right-create"
                onClick={() => setCreateModal(true)}
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
            {users.map((user) => (
              <div className="admin-user-table-header-data" key={user.id}>
                <div className="name">{user.name}</div>
                <div className="email">{user.email}</div>
                <div className="active-emp">
                  {user.status ? (
                    <button
                      className="search-btn"
                      onClick={() => toggleActiveEmployee(user.id)}
                    >
                      <RiToggleFill size={30} />
                    </button>
                  ) : (
                    <button
                      className="search-btn"
                      onClick={() => toggleActiveEmployee(user.id)}
                    >
                      <RiToggleLine size={30} />
                    </button>
                  )}
                </div>
                <div className="avatar-emp">
                  <img
                    src={
                      user.avatar
                        ? `${imageUrl}${user.avatar}`
                        : user.gender === "male"
                        ? male
                        : female
                    }
                    alt=""
                  />
                </div>
                <div className="gender-emp">
                  {user.gender === "male" ? (
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                      src={male}
                      alt="male"
                    />
                  ) : (
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                      src={female}
                      alt="female"
                    />
                  )}
                </div>
                <div className="action-emp">
                  <div className="action-inside">
                    <button
                      className="search-btn btn-action"
                      onClick={() => (setGetOneModal(true), findOne(user.id))}
                    >
                      <RiEyeFill size={20} />
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => handleUpdate(user.id)}
                    >
                      <RiEditFill size={20} color="blue" />
                    </button>
                    <button className="btn-action">
                      <Popconfirm
                        title="Remove employee"
                        description="Are you sure to remove this employee?"
                        onConfirm={() => removeEmployee(user.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button className="btn-action">
                          <RiDeleteBinFill size={20} color="red" />
                        </button>
                      </Popconfirm>
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
            title="Create Employee"
            open={createModal}
            onOk={() => setCreateModal(false)}
            onCancel={() => setCreateModal(false)}
            footer={false}
          >
            <section className="my-form-section">
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
                  value={formData.gender}
                  onChange={(value) => {
                    setFormData({ ...formData, gender: value });
                  }}
                  style={{
                    width: "100%",
                  }}
                  options={gender}
                />
              </Space>
              <div className="btn-create-form">
                <Space>
                  <MyButton
                    color="whitesmoke"
                    textColor="black"
                    onClick={handleFormCancel}
                  >
                    Cancel
                  </MyButton>
                  <MyButton
                    color="white"
                    textColor="black"
                    onClick={handleFormSubmit}
                  >
                    Create
                  </MyButton>
                </Space>
              </div>
            </section>
          </Modal>
          {/* end create modal */}
          {/* start update modal */}
          <Modal
            title="Update Employee"
            open={updateModal}
            onOk={() => setUpdateModal(false)}
            onCancel={() => setUpdateModal(false)}
            footer={false}
          >
            <section className="my-form-section">
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
                  Gender <span style={{ color: "red" }}>*</span>
                </p>
                <Select
                  placeholder="Gender"
                  value={formData.gender}
                  onChange={(value) => {
                    setFormData({ ...formData, gender: value });
                  }}
                  style={{
                    width: "100%",
                  }}
                  options={gender}
                />
              </Space>
              <div className="btn-create-form">
                <Space>
                  <MyButton
                    color="whitesmoke"
                    textColor="black"
                    onClick={() => (
                      setUpdateModal(false),
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        gender: "",
                      })
                    )}
                  >
                    Cancel
                  </MyButton>
                  <MyButton
                    color="white"
                    textColor="black"
                    onClick={() => updateEmployee()}
                  >
                    Update
                  </MyButton>
                </Space>
              </div>
            </section>
          </Modal>
          {/* end create modal */}
          {/* start get one modal */}
          <Modal
            title="Employee"
            open={getOneModal}
            onOk={() => setGetOneModal(false)}
            onCancel={() => setGetOneModal(false)}
            footer={false}
          >
            <section className="my-form-section">
              <Space style={{ width: "100%" }} direction="vertical">
                <p style={{ color: "grey" }}>
                  Name <span style={{ color: "red" }}>*</span>
                </p>
                <Input placeholder="Name" value={formData.name} />
                <p style={{ color: "grey" }}>
                  Email <span style={{ color: "red" }}>*</span>
                </p>
                <Input placeholder="Email" value={formData.email} />
                <p style={{ color: "grey" }}>
                  Gender <span style={{ color: "red" }}>*</span>
                </p>
                <Input placeholder="Email" value={formData.gender} />
              </Space>
            </section>
          </Modal>
          {/* end create modal */}
        </>
      )}
    </MainPage>
  );
};

export default UserScreen;
