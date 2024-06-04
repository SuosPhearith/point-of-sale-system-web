/* eslint-disable react-hooks/exhaustive-deps */
import {
  RiAddCircleLine,
  RiArrowDropRightLine,
  RiDeleteBinFill,
  RiEditFill,
  RiEyeFill,
  RiHome4Line,
  RiSearchLine,
  RiToggleFill,
  RiToggleLine,
} from "react-icons/ri";
import MainPage from "../../../components/page/MainPage";
import { useEffect, useState } from "react";
import {
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  message,
} from "antd";
import makeAPIRequest from "../../../services/makeAPIRequest";
import SpinLayout from "../../../components/general/spin/SpinLayout";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/female.png";
import MyButton from "../../../components/general/button/MyButton";
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

const CustomerScreen = () => {
  //::=====================>>Screen state<<=====================::
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
  });
  //::==========================================================::
  //::=====================>>Screen action<<====================::
  const getCustomers = async () => {
    try {
      const data = await makeAPIRequest(
        "GET",
        `customer?page=${pagination.currentPage}&key=${search}`
      );
      setCustomers(data.data);
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

  const removeCustomer = async (id) => {
    try {
      if (!id) return message.info("Update ID not found");
      const feedback = await makeAPIRequest("DELETE", `customer/${id}`);
      if (feedback) {
        message.success("Deleted successfully");
        getCustomers();
        if (customers.length === 1) {
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

  const updateEmployee = async () => {
    try {
      if (!updateId) return message.info("Update ID not found");
      const { name, email, gender } = formData;
      if (!name || !email || !gender)
        return message.info("Please input all fields");
      const feedback = await makeAPIRequest("PATCH", `customer/${updateId}`, {
        name,
        email,
        gender,
      });
      if (feedback) {
        getCustomers();
        setUpdateModal(false);
        setUpdateId("");
        message.success("Updated successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const findOne = async (id) => {
    try {
      const customer = await makeAPIRequest("GET", `customer/${id}`);
      if (customer) {
        setFormData({
          name: customer.name,
          email: customer.email,
          gender: customer.gender,
        });
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const toggleActiveCustomer = async (id) => {
    try {
      if (!id) return message.info("Update ID not found");
      const feedback = await makeAPIRequest(
        "PATCH",
        `customer/${id}/toggle-active`
      );
      if (feedback) {
        getCustomers();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const createCustomer = async () => {
    try {
      const { name, email, gender } = formData;
      if (!name || !email || !gender)
        return message.info("Please input all fields");
      const feedback = await makeAPIRequest("POST", "customer", {
        name,
        email,
        gender,
      });
      if (feedback) {
        setCreateModal(false);
        setFormData({
          name: "",
          email: "",
          gender: "",
        });
        message.success("Created successfully");
        getCustomers();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    setLoading(true);
    getCustomers();
  }, []);
  useEffect(() => {
    getCustomers();
  }, [pagination.currentPage]);
  //::==========================================================::
  //::=====================>>Screen handle<<====================::
  const paginationChange = (current) => {
    setPagination({ ...pagination, currentPage: current });
  };
  const handleSearch = () => {
    setPagination({ ...pagination, currentPage: 1 });
    getCustomers();
  };
  const handleFormCancel = () => {
    setCreateModal(false);
    setFormData({
      name: "",
      email: "",
      gender: "",
    });
  };
  const handleFormSubmit = () => {
    createCustomer();
  };
  const handleUpdateEmployee = (id) => {
    setUpdateId(id);
    findOne(id);
    setUpdateModal(true);
  };
  //::==========================================================::
  return (
    <MainPage pageName="Customer">
      {loading ? (
        <SpinLayout />
      ) : (
        <>
          {/* start header section */}
          <section className="admin-user-header">
            <div className="admin-user-header-left">
              <RiHome4Line size={20} />
              <RiArrowDropRightLine size={32} />
              <span>Customer</span>
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
                <button className="search-btn" onClick={handleSearch}>
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
          <section className="admin-user-table">
            <div className="admin-user-table-header">
              <div className="name">Name</div>
              <div className="email">Email</div>
              <div className="active-emp">Active</div>
              <div className="avatar-emp">Point</div>
              <div className="gender-emp">Gender</div>
              <div className="action-emp">Action</div>
            </div>
            {customers.map((customer) => (
              <div className="admin-user-table-header-data" key={customer.id}>
                <div className="name">{customer.name}</div>
                <div className="email">{customer.email}</div>
                <div className="active-emp">
                  {customer.status ? (
                    <button
                      className="search-btn"
                      onClick={() => toggleActiveCustomer(customer.id)}
                    >
                      <RiToggleFill size={30} />
                    </button>
                  ) : (
                    <button
                      className="search-btn"
                      onClick={() => toggleActiveCustomer(customer.id)}
                    >
                      <RiToggleLine size={30} />
                    </button>
                  )}
                </div>
                <div className="avatar-emp">{customer.point}</div>
                <div className="gender-emp">
                  {customer.gender === "male" ? (
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
                      //   onClick={() => (setGetOneModal(true), findOne(user.id))}
                    >
                      <RiEyeFill size={20} />
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => handleUpdateEmployee(customer.id)}
                    >
                      <RiEditFill size={20} color="blue" />
                    </button>
                    <button className="btn-action">
                      <Popconfirm
                        title="Remove employee"
                        description="Are you sure to remove this employee?"
                        onConfirm={() => removeCustomer(customer.id)}
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
        </>
      )}

      {/* start create modal */}
      <Modal
        title="Create Customer"
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
        title="Update Customer"
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
                  setFormData({ name: "", email: "", gender: "" })
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
    </MainPage>
  );
};

export default CustomerScreen;
