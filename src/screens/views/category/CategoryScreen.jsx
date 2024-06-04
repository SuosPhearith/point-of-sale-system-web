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
import { MdOutlineEdit } from "react-icons/md";
import MainPage from "../../../components/page/MainPage";
import { useEffect, useState } from "react";
import {
  Image,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  message,
} from "antd";
import makeAPIRequest from "../../../services/makeAPIRequest";
import SpinLayout from "../../../components/general/spin/SpinLayout";
import categoryImage from "../../../assets/images/category.png";
import MyButton from "../../../components/general/button/MyButton";
import FileUpload from "../../../components/general/FileUpload";
const imageUrl = import.meta.env.VITE_IMAGE_URL;

const CategoryScreen = () => {
  //::=====================>>Screen state<<=====================::
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateImageModal, setUpdateImageModal] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  //::==========================================================::
  //::=====================>>Screen action<<====================::
  const getCategories = async () => {
    try {
      const data = await makeAPIRequest(
        "GET",
        `category?page=${pagination.currentPage}&key=${search}`
      );
      setCategories(data.data);
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

  const removeCategory = async (id) => {
    try {
      if (!id) return message.info("Update ID not found");
      const feedback = await makeAPIRequest("DELETE", `category/${id}`);
      if (feedback) {
        message.success("Deleted successfully");
        getCategories();
        if (categories.length === 1) {
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

  const updateCategory = async () => {
    try {
      if (!updateId) return message.info("Update ID not found");
      const { name, description } = formData;
      if (!name || !description) return message.info("Please input all fields");
      const feedback = await makeAPIRequest("PATCH", `category/${updateId}`, {
        name,
        description,
      });
      if (feedback) {
        getCategories();
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
      const category = await makeAPIRequest("GET", `category/${id}`);
      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
          gender: category.gender,
        });
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const toggleActiveCategory = async (id) => {
    try {
      if (!id) return message.info("Update ID not found");
      const feedback = await makeAPIRequest(
        "PATCH",
        `category/${id}/toggle-active`
      );
      if (feedback) {
        getCategories();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const updateImage = async () => {
    try {
      const data = new FormData();
      data.append("file", file);
      const feedback = await makeAPIRequest(
        "PATCH",
        `category/${updateId}/updateImage`,
        data
      );
      if (feedback) {
        getCategories();
        setUpdateId("");
        clearPreview();
        setUpdateImageModal(false);
        message.success("Updated successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const createCategory = async () => {
    try {
      const { name, description, image } = formData;
      if (!name || !description || !image)
        return message.info("Please input all fields");
      const data = new FormData();
      data.append("name", name);
      data.append("description", description);
      data.append("file", image);
      const feedback = await makeAPIRequest("POST", "category", data);
      if (feedback) {
        setCreateModal(false);
        setFormData({
          name: "",
          description: "",
          image: null,
        });
        message.success("Created successfully");
        getCategories();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    setLoading(true);
    getCategories();
  }, []);
  useEffect(() => {
    getCategories();
  }, [pagination.currentPage]);
  //::==========================================================::
  //::=====================>>Screen handle<<====================::
  const paginationChange = (current) => {
    setPagination({ ...pagination, currentPage: current });
  };
  const handleSearch = () => {
    setPagination({ ...pagination, currentPage: 1 });
    getCategories();
  };
  const handleFormCancel = () => {
    setCreateModal(false);
    setFormData({
      name: "",
      description: "",
      gender: "",
    });
  };
  const handleFormSubmit = () => {
    createCategory();
  };
  const handleUpdateEmployee = (id) => {
    setUpdateId(id);
    findOne(id);
    setUpdateModal(true);
  };
  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const clearPreview = () => {
    setFile(null);
  };
  const formatFileSize = (sizeInBytes) => {
    return (sizeInBytes / (1024 * 1024)).toFixed(2);
  };
  //::==========================================================::
  return (
    <MainPage pageName="Category">
      {loading ? (
        <SpinLayout />
      ) : (
        <>
          {/* start header section */}
          <section className="admin-user-header">
            <div className="admin-user-header-left">
              <RiHome4Line size={20} />
              <RiArrowDropRightLine size={32} />
              <span>Category</span>
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
                onClick={() => {
                  setCreateModal(true),
                    setFormData({ name: "", description: "", image: null });
                }}
              >
                <RiAddCircleLine size={29} className="create-btn-hover" />
              </div>
            </div>
          </section>
          {/* end header section */}
          <section className="admin-user-table">
            <div className="admin-user-table-header">
              <div className="name">Name</div>
              <div className="email">Description</div>
              <div className="active-emp">Active</div>
              <div className="avatar-emp">Product</div>
              <div className="gender-emp">Image</div>
              <div className="action-emp">Action</div>
            </div>
            {categories.map((category) => (
              <div className="admin-user-table-header-data" key={category.id}>
                <div className="name">{category.name}</div>
                <div className="email">{category.description}</div>
                <div className="active-emp">
                  {category.status ? (
                    <button
                      className="search-btn"
                      onClick={() => toggleActiveCategory(category.id)}
                    >
                      <RiToggleFill size={30} />
                    </button>
                  ) : (
                    <button
                      className="search-btn"
                      onClick={() => toggleActiveCategory(category.id)}
                    >
                      <RiToggleLine size={30} />
                    </button>
                  )}
                </div>
                <div className="avatar-emp">{category._count.Product}</div>
                <div className="avatar-emp">
                  <Image
                    style={{ width: "40px", height: "40px" }}
                    src={
                      category.image
                        ? `${imageUrl}${category.image}`
                        : categoryImage
                    }
                    alt=""
                  />
                  <button
                    onClick={() => {
                      setUpdateImageModal(true);
                      clearPreview();
                      setUpdateId(category.id);
                    }}
                  >
                    <MdOutlineEdit size={17} />
                  </button>
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
                      onClick={() => handleUpdateEmployee(category.id)}
                    >
                      <RiEditFill size={20} color="blue" />
                    </button>
                    <button className="btn-action">
                      <Popconfirm
                        title="Remove employee"
                        description="Are you sure to remove this employee?"
                        onConfirm={() => removeCategory(category.id)}
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
        title="Create Category"
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
              Description <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Image <span style={{ color: "red" }}>*</span>
            </p>
            <input
              onChange={(e) => handleUploadAvatar(e)}
              type="file"
              name="image"
              id="image"
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
        title="Update Category"
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
              Description <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Space>
          <div className="btn-create-form">
            <Space>
              <MyButton
                color="whitesmoke"
                textColor="black"
                onClick={() => (
                  setUpdateModal(false),
                  setFormData({ name: "", description: "", gender: "" })
                )}
              >
                Cancel
              </MyButton>
              <MyButton
                color="white"
                textColor="black"
                onClick={() => updateCategory()}
              >
                Update
              </MyButton>
            </Space>
          </div>
        </section>
      </Modal>
      {/* end update modal */}
      {/* start update image modal */}
      <Modal
        title="Update Image Category"
        open={updateImageModal}
        onOk={() => setUpdateImageModal(false)}
        onCancel={() => setUpdateImageModal(false)}
        footer={false}
      >
        <section className="my-form-section">
          <Space style={{ width: "100%" }} direction="vertical">
            <FileUpload
              onFileSelect={handleFileSelect}
              clearPreview={clearPreview}
            />
            {file && (
              <div>
                <h2>Selected File Information:</h2>
                <p>File Name: {file.name}</p>
                <p>File Type: {file.type}</p>
                <p>File Size: {formatFileSize(file.size)} MB</p>
              </div>
            )}
          </Space>
          <div className="btn-create-form">
            <Space>
              <MyButton
                color="whitesmoke"
                textColor="black"
                onClick={() => {
                  setUpdateImageModal(false);
                  clearPreview();
                }}
              >
                Cancel
              </MyButton>
              <MyButton
                color="white"
                textColor="black"
                onClick={() => updateImage()}
              >
                Update
              </MyButton>
            </Space>
          </div>
        </section>
      </Modal>
      {/* end update image modal */}
    </MainPage>
  );
};

export default CategoryScreen;
