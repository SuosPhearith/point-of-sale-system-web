import { useState } from "react";
import MainPage from "../../../components/page/MainPage";
import SpinLayout from "../../../components/general/spin/SpinLayout";
import "./OrderScreen.scss";
import burger from "../../../assets/images/burger.png";
import { BsCart3, BsDash, BsPlusLg, BsSearch, BsTrash3 } from "react-icons/bs";

const OrderScreen = () => {
  const products = [
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    // Add more products here if needed
  ];

  const ordered = [
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
    { name: "Beef Burger", price: "$2.00" },
  ];
  const [loading, setLoading] = useState(false);
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
                />
              </div>
              <div className="order-product-container">
                {products.map((product, index) => (
                  <div key={index} className="order-product">
                    <img src={burger} alt="image" className="order-image" />
                    <div className="order-product-detail">
                      <div className="order-name">{product.name}</div>
                      <div className="order-price">{product.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-container-2">
              <div className="order-information">
                <div className="cart-icon">
                  <BsCart3 size={16} className="order-cart-icon" />
                  <span className="badge">3</span>
                </div>
                <div>
                  <BsTrash3 size={16} />
                </div>
              </div>
              <div className="ordered-item-wrapper">
                {ordered.map((product, index) => (
                  <div className="ordered-item" key={index}>
                    <div className="ordered-info">
                      <div className="ordered-info-image">
                        <img src={burger} alt="image" />
                      </div>
                      <div className="ordered-info-content">
                        <div className="ordered-info-content-name">
                          Beef Burger
                        </div>
                        <div className="ordered-info-content-price">$2</div>
                      </div>
                    </div>
                    <div className="ordered-qty">
                      <div className="ordered-qty-minus">
                        <BsDash size={15} color="white" />
                      </div>
                      <div className="ordered-qty-number">3</div>
                      <div className="ordered-qty-plus">
                        <BsPlusLg size={15} color="white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ordered-total">
                <div className="ordered-total-text">TOTAL</div>
                <div>$10.00</div>
              </div>
              <div className="ordered-final">
                <div className="ordered-cash">
                  <div>CASH</div>
                  <div className="ordered-cash-number">
                    <div>$</div>
                    <div className="ordered-cash-place">12</div>
                  </div>
                </div>
                <div className="ordered-cash-info">
                  <div className="ordered-cash-info-momey">
                    <div className="ordered-number-cash">+1.000</div>
                    <div className="ordered-number-cash">+5.000</div>
                    <div className="ordered-number-cash">+10.000</div>
                  </div>
                  <div className="ordered-cash-info-momey">
                    <div className="ordered-number-cash">+20.000</div>
                    <div className="ordered-number-cash">+50.000</div>
                    <div className="ordered-number-cash">+100.000</div>
                  </div>
                  <div className="ordered-cash-back">
                    <h3>$. -2.2</h3>
                  </div>
                  <div className="ordered-submit">
                    <h3>Submit</h3>
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
