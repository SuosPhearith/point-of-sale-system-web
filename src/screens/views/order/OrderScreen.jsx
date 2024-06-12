/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import MainPage from "../../../components/page/MainPage";
import SpinLayout from "../../../components/general/spin/SpinLayout";
import "./OrderScreen.scss";
import burger from "../../../assets/images/burger.png";
import { BsCart3, BsDash, BsPlusLg, BsSearch, BsTrash3 } from "react-icons/bs";
import makeAPIRequest from "../../../services/makeAPIRequest";
import { Select, Spin, message } from "antd";
const imageUrl = import.meta.env.VITE_IMAGE_URL;

const OrderScreen = () => {
  //::=====================>>Screen state<<=====================::
  const [orderedItem, setOrderedItem] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentCash, setPaymentCash] = useState(0);
  const [moneyBack, setMoneyback] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(1);
  const [ordering, setOrdering] = useState(false);
  //::==========================================================::
  //::=====================>>Screen action<<====================::
  const getAllProducts = async () => {
    try {
      const data = await makeAPIRequest(
        "GET",
        `order/getAllProducts?&key=${search}`
      );
      setProducts(data);
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const getAllCustomers = async () => {
    try {
      const data = await makeAPIRequest("GET", `order/getAllCustomers`);
      setCustomers(data);
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const order = async () => {
    setOrdering(true);
    try {
      if (orderedItem.length <= 0) {
        return message.error("Please select product");
      }
      await makeAPIRequest("POST", `order`, {
        items: orderedItem,
        customerId: selectedCustomer,
      });
      setPaymentCash(0);
      setMoneyback(0);
      setOrderedItem([]);
      message.success("Orderd successfully");
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setOrdering(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    getAllProducts();
    setLoading(true);
    getAllCustomers();
  }, []);
  useEffect(() => {
    handleCalculateTotalPrice();
  }, [orderedItem]);
  useEffect(() => {
    handleMoneyBack();
  }, [paymentCash]);
  //::==========================================================::
  //::=====================>>Screen handle<<====================::
  const handleSearch = () => {
    getAllProducts();
  };
  const handleAddOrderedItem = (product) => {
    setOrderedItem((prevOrderedItems) => {
      // Check if the product is already in the orderedItem list
      const existingProduct = prevOrderedItems.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        // If the product exists, map through the list and increment the qty of the existing product
        return prevOrderedItems.map((item) =>
          item.id === product.id
            ? { ...item, qty: Math.min(item.qty + 1, product.stock) }
            : item
        );
      } else {
        // If the product does not exist, add it to the list with qty: 1
        return [...prevOrderedItems, { ...product, qty: 1 }];
      }
    });
  };

  const handleMinusQty = (id) => {
    setOrderedItem((prevOrderedItems) => {
      return prevOrderedItems
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0);
    });
  };

  const handleAddQty = (id, stock) => {
    setOrderedItem((prevOrderedItems) => {
      return prevOrderedItems.map((item) => {
        if (item.id === id) {
          // Increment the quantity only if it's less than the stock
          return { ...item, qty: Math.min(item.qty + 1, stock) };
        }
        return item;
      });
    });
  };

  const handleCalculateTotalPrice = () => {
    const totalPrice = orderedItem.reduce((accumulator, item) => {
      const itemFinalPrice = item.price * (1 - item.discount / 100);
      return accumulator + itemFinalPrice * item.qty;
    }, 0);

    setTotalPrice(totalPrice);
  };

  const handleSetPaymentCash = (value) => {
    setPaymentCash(paymentCash + value);
  };

  const handleMoneyBack = () => {
    setMoneyback(totalPrice - paymentCash);
  };

  const handleCustomerChange = (value) => {
    setSelectedCustomer(value);
  };

  //::==========================================================::
  return (
    <MainPage pageName={"Order"}>
      {loading ? (
        <SpinLayout />
      ) : (
        <>
          <div className="order-wrapper">
            <div className="order-container-1">
              <div className="order-search">
                <div className="order-search-btn">
                  <BsSearch color="white" />
                </div>
                <input
                  type="text"
                  className="order-search-input"
                  placeholder="Cari menu ..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onKeyDown={() => handleSearch()}
                />

                <Select
                  showSearch
                  defaultValue={selectedCustomer}
                  style={{
                    width: 200,
                    marginRight: 10,
                  }}
                  placeholder="Select Customer"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={handleCustomerChange}
                  options={customers}
                />
              </div>
              <div className="order-product-container">
                {/* ======================product list====================== */}
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="order-product"
                    onClick={() => handleAddOrderedItem(product)}
                  >
                    <img
                      src={
                        product.image ? `${imageUrl}${product.image}` : burger
                      }
                      alt="image"
                      className="order-image"
                    />
                    <div className="order-product-detail">
                      <div className="order-name">{product.name}</div>
                      {product.discount ? (
                        <div className="order-price">
                          <strike style={{ color: "red" }}>
                            ${product.price}
                          </strike>
                          ${product.finalPrice}
                        </div>
                      ) : (
                        <div className="order-price">${product.finalPrice}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-container-2">
              <div className="order-information">
                <div className="cart-icon">
                  <BsCart3 size={16} className="order-cart-icon" />
                  <span className="badge">{orderedItem.length}</span>
                </div>
                <div>
                  <BsTrash3
                    size={16}
                    color="red"
                    style={{ cursor: "pointer" }}
                    onClick={() => setOrderedItem([])}
                  />
                </div>
              </div>
              <div className="ordered-item-wrapper">
                {/* ======================ordered item====================== */}
                {orderedItem.map((product) => (
                  <div className="ordered-item" key={product.id}>
                    <div className="ordered-info">
                      <div className="ordered-info-image">
                        <img
                          src={
                            product.image
                              ? `${imageUrl}${product.image}`
                              : burger
                          }
                          alt="image"
                        />
                      </div>
                      <div className="ordered-info-content">
                        <div className="ordered-info-content-name">
                          {product.name}
                        </div>
                        <div className="ordered-info-content-price">
                          ${product.finalPrice}
                        </div>
                      </div>
                    </div>
                    <div className="ordered-qty">
                      <div
                        className="ordered-qty-minus"
                        onClick={() => handleMinusQty(product.id)}
                      >
                        <BsDash size={15} color="white" />
                      </div>
                      <div className="ordered-qty-number">{product.qty}</div>
                      <div
                        className="ordered-qty-plus"
                        onClick={() => handleAddQty(product.id, product.stock)}
                      >
                        <BsPlusLg size={15} color="white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ordered-total">
                <div className="ordered-total-text">TOTAL</div>
                <div>${totalPrice}</div>
              </div>
              <div className="ordered-final">
                <div className="ordered-cash">
                  <div>CASH</div>
                  <div className="ordered-cash-number">
                    <div>$</div>
                    <div className="ordered-cash-place">{paymentCash}</div>
                    <div>
                      <BsTrash3
                        size={16}
                        color="red"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() => setPaymentCash(0)}
                      />
                    </div>
                  </div>
                </div>
                <div className="ordered-cash-info">
                  <div className="ordered-cash-info-momey">
                    <button
                      className="ordered-number-cash"
                      onClick={() => handleSetPaymentCash(1)}
                    >
                      +1.000
                    </button>
                    <button
                      className="ordered-number-cash"
                      onClick={() => handleSetPaymentCash(5)}
                    >
                      +5.000
                    </button>
                    <button
                      className="ordered-number-cash"
                      onClick={() => handleSetPaymentCash(10)}
                    >
                      +10.000
                    </button>
                  </div>
                  <div className="ordered-cash-info-momey">
                    <button
                      className="ordered-number-cash"
                      onClick={() => handleSetPaymentCash(20)}
                    >
                      +20.000
                    </button>
                    <button
                      className="ordered-number-cash"
                      onClick={() => handleSetPaymentCash(50)}
                    >
                      +50.000
                    </button>
                    <button
                      className="ordered-number-cash"
                      onClick={() => handleSetPaymentCash(100)}
                    >
                      +100.000
                    </button>
                  </div>
                  <div className="ordered-cash-back">
                    <h3>$. {moneyBack}</h3>
                  </div>
                  <div className="ordered-submit" onClick={order}>
                    {ordering ? <Spin /> : <h3>Submit</h3>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MainPage>
  );
};

export default OrderScreen;
