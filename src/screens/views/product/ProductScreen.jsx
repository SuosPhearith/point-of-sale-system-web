/* eslint-disable react-hooks/exhaustive-deps */
import {
  RiAddCircleLine,
  RiArrowDropRightLine,
  RiDeleteBinFill,
  RiEditFill,
  RiHome4Line,
  RiSearchLine,
  RiToggleFill,
  RiToggleLine,
} from "react-icons/ri";
import { FaLessThan } from "react-icons/fa";
import { MdAddCircleOutline, MdOutlineEdit } from "react-icons/md";
import MainPage from "../../../components/page/MainPage";
import { useEffect, useState } from "react";
import {
  Image,
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
import productImage from "../../../assets/images/category.png";
import MyButton from "../../../components/general/button/MyButton";
import FileUpload from "../../../components/general/FileUpload";
const imageUrl = import.meta.env.VITE_IMAGE_URL;

const ProductScreen = () => {
  //::=====================>>Screen state<<=====================::
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateImageModal, setUpdateImageModal] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [addStockModal, setAddStockModal] = useState(false);
  const [stock, setStock] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
  });
  const [formData, setFormData] = useState({
    name: "",
    price: null,
    stock: null,
    alert: 10,
    image: null,
    discount: 0,
    category: null,
  });
  //::==========================================================::
  //::=====================>>Screen action<<====================::
  const getProducts = async () => {
    try {
      const data = await makeAPIRequest(
        "GET",
        `product?page=${pagination.currentPage}&key=${search}`
      );
      setProducts(data.data);
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
  const udpateStock = async () => {
    try {
      if (!updateId) return message.info("Update ID not found");
      const feetback = await makeAPIRequest(
        "PATCH",
        `product/${updateId}/addStock`,
        {
          stock: stock,
        }
      );
      if (feetback) {
        getProducts();
        setAddStockModal(false);
        setUpdateId("");
        message.success("Added successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const data = await makeAPIRequest("GET", `product/getAll/getAllCategory`);
      const transformedData = data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCategories(transformedData);
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      if (!id) return message.info("Update ID not found");
      const feedback = await makeAPIRequest("DELETE", `product/${id}`);
      if (feedback) {
        message.success("Deleted successfully");
        getProducts();
        if (products.length === 1) {
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

  const updateProduct = async () => {
    try {
      if (!updateId) return message.info("Update ID not found");
      const { name, price, stock, alert, discount, category } = formData;
      if (
        !name ||
        (!price && price !== 0) ||
        (!category && category !== 0) ||
        (!stock && stock !== 0) ||
        (!alert && alert !== 0) ||
        (!discount && discount !== 0)
      )
        return message.info("Please input all fields");
      const feedback = await makeAPIRequest("PATCH", `product/${updateId}`, {
        name,
        price,
        stock,
        alert,
        discount,
        categoryId: category,
      });
      if (feedback) {
        getProducts();
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
      const product = await makeAPIRequest("GET", `product/${id}`);
      if (product) {
        setFormData({
          name: product.name,
          price: product.price,
          stock: product.stock,
          alert: product.alert,
          discount: product.discount,
          category: product.categoryId,
        });
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const toggleActiveProduct = async (id) => {
    try {
      if (!id) return message.info("Update ID not found");
      const feedback = await makeAPIRequest(
        "PATCH",
        `product/${id}/toggle-active`
      );
      if (feedback) {
        getProducts();
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
        `product/${updateId}/updateImage`,
        data
      );
      if (feedback) {
        getProducts();
        setUpdateId("");
        clearPreview();
        setUpdateImageModal(false);
        message.success("Updated successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const createProduct = async () => {
    try {
      const { name, price, stock, image, alert, discount, category } = formData;
      if (
        !name ||
        !image ||
        (!category && category !== 0) ||
        (!price && price !== 0) ||
        (!stock && stock !== 0) ||
        (!alert && alert !== 0) ||
        (!discount && discount !== 0)
      )
        return message.info("Please input all fields");
      const data = new FormData();
      data.append("name", name);
      data.append("price", price);
      data.append("stock", stock);
      data.append("alert", alert);
      data.append("file", image);
      data.append("discount", discount);
      data.append("categoryId", category);
      const feedback = await makeAPIRequest("POST", "product", data);
      if (feedback) {
        setCreateModal(false);
        setFormData({
          name: "",
          description: "",
          image: null,
        });
        message.success("Created successfully");
        getProducts();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    setLoading(true);
    getProducts();
    getCategories();
  }, []);
  useEffect(() => {
    getProducts();
  }, [pagination.currentPage]);
  //::==========================================================::
  //::=====================>>Screen handle<<====================::
  const paginationChange = (current) => {
    setPagination({ ...pagination, currentPage: current });
  };
  const handleSearch = () => {
    setPagination({ ...pagination, currentPage: 1 });
    getProducts();
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
    createProduct();
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
    <MainPage pageName="Product">
      {loading ? (
        <SpinLayout />
      ) : (
        <>
          {/* start header section */}
          <section className="admin-user-header">
            <div className="admin-user-header-left">
              <RiHome4Line size={20} />
              <RiArrowDropRightLine size={32} />
              <span>Product</span>
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
                    setFormData({
                      name: "",
                      price: null,
                      stock: null,
                      alert: 10,
                      image: null,
                      discount: 0,
                      category: null,
                    });
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
              <div className="active-emp">Price</div>
              <div className="active-emp">Stock</div>
              <div className="active-emp">Active</div>
              <div className="avatar-emp">Alert</div>
              <div className="avatar-emp">Discount</div>
              <div className="gender-emp">Image</div>
              <div className="action-emp">Action</div>
            </div>
            {products.map((product) => (
              <div className="admin-user-table-header-data" key={product.id}>
                <div className="name">{product.name}</div>
                <div className="active-emp">${product.price}</div>
                <div
                  className="active-emp"
                  style={{
                    color: product.stock < product.alert ? "red" : "blue",
                  }}
                >
                  {product.stock}
                </div>
                <div className="active-emp">
                  {product.status ? (
                    <button
                      className="search-btn"
                      onClick={() => toggleActiveProduct(product.id)}
                    >
                      <RiToggleFill size={30} />
                    </button>
                  ) : (
                    <button
                      className="search-btn"
                      onClick={() => toggleActiveProduct(product.id)}
                    >
                      <RiToggleLine size={30} />
                    </button>
                  )}
                </div>
                <div className="avatar-emp" style={{ color: "violet" }}>
                  <FaLessThan size={10} /> {product.alert}
                </div>
                <div className="avatar-emp" style={{ color: "purple" }}>
                  {product.discount} %
                </div>
                <div className="avatar-emp">
                  <Image
                    style={{ width: "40px", height: "40px" }}
                    src={
                      product.image
                        ? `${imageUrl}${product.image}`
                        : productImage
                    }
                    alt=""
                  />
                  <button
                    onClick={() => {
                      setUpdateImageModal(true);
                      clearPreview();
                      setUpdateId(product.id);
                    }}
                  >
                    <MdOutlineEdit size={17} />
                  </button>
                </div>
                <div className="action-emp">
                  <div className="action-inside">
                    <button
                      className="search-btn btn-action"
                      onClick={() => (
                        setAddStockModal(true), setUpdateId(product.id)
                      )}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => handleUpdateEmployee(product.id)}
                    >
                      <RiEditFill size={20} color="blue" />
                    </button>
                    <button className="btn-action">
                      <Popconfirm
                        title="Remove employee"
                        description="Are you sure to remove this employee?"
                        onConfirm={() => removeProduct(product.id)}
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
        title="Create Product"
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
              Price <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Stock <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Alert <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              placeholder="Alert"
              value={formData.alert}
              onChange={(e) =>
                setFormData({ ...formData, alert: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Discount <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              placeholder="Discount"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Category <span style={{ color: "red" }}>*</span>
            </p>
            <Select
              placeholder="Category"
              value={formData.category}
              onChange={(value) => {
                setFormData({ ...formData, category: value });
              }}
              style={{
                width: "100%",
              }}
              options={categories}
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
              Price <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Stock <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Alert <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              type="number"
              placeholder="Alert"
              value={formData.alert}
              onChange={(e) =>
                setFormData({ ...formData, alert: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Discount <span style={{ color: "red" }}>*</span>
            </p>
            <Input
              type="number"
              placeholder="Discount"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
            />
            <p style={{ color: "grey" }}>
              Category <span style={{ color: "red" }}>*</span>
            </p>
            <Select
              placeholder="Category"
              value={formData.category}
              onChange={(value) => {
                setFormData({ ...formData, category: value });
              }}
              style={{
                width: "100%",
              }}
              options={categories}
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
                onClick={() => updateProduct()}
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
      {/* start update image modal */}
      <Modal
        title="Add Stock"
        open={addStockModal}
        onOk={() => setAddStockModal(false)}
        onCancel={() => setAddStockModal(false)}
        footer={false}
      >
        <section className="my-form-section">
          <Space style={{ width: "100%" }} direction="vertical">
            <Input
              type="number"
              placeholder="Add Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </Space>
          <div className="btn-create-form">
            <Space>
              <MyButton
                color="whitesmoke"
                textColor="black"
                onClick={() => (setAddStockModal(false), setStock(null))}
              >
                Cancel
              </MyButton>
              <MyButton
                color="white"
                textColor="black"
                onClick={() => udpateStock()}
              >
                Add
              </MyButton>
            </Space>
          </div>
        </section>
      </Modal>
      {/* end update image modal */}
    </MainPage>
  );
};

export default ProductScreen;
