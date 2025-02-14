import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
// import { AiOutlineUser } from "react-icons/ai";
import { LuShoppingCart } from "react-icons/lu";
import CruiseShipLogo from "../../../assets/cruise_ship_logo.jpg";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { useOrder } from "../../context/OrderContext";
import { CustomerInterface } from "../../../interfaces/ICustomer";
import { GetUsersById } from "../../../services/https";
import { Button, message, Tooltip } from "antd";
import "./NavbarCruiseShip.css";
import UnauthorizedAccess from "../unauthorized_access/UnauthorizedAccess";

const NavbarCruiseShip: React.FC = () => {
  const navigate = useNavigate();
  const { filteredOrderDetails, tripPayment, searchInput, setSearchInput } =
    useOrder();
  const [user, setUser] = useState<CustomerInterface>();
  const [isLogin, setIsLogin] = useState<string>();
  const [messageApi, contextHolder] = message.useMessage();

  // ดึงค่าจาก localStorage หากไม่มีให้เริ่มต้นที่ "home" และ false
  const [menu, setMenu] = useState<string>(
    () => localStorage.getItem("menu") || "home"
  );
  const [showMenuFood, setShowMenuFood] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem("showMenuFood") || "false")
  );

  const handleChange = (value: string) => {
    setSearchInput(value);
  };

  const handleMenuClick = (menuName: string) => {
    setMenu(menuName);
    setShowMenuFood(menuName === "food-service");

    // บันทึกสถานะปัจจุบันลง localStorage
    localStorage.setItem("menu", menuName);
    localStorage.setItem(
      "showMenuFood",
      JSON.stringify(menuName === "food-service")
    );

    if (menuName === "home") {
      navigate(`/cruise-ship/login/home`);
    } else if (menuName === "activity") {
      navigate("/cruise-ship/login/home/activity");
    } else if (menuName === "food-service") {
      navigate("/cruise-ship/login/home/food-service");
    }
  };

  const getUser = async (id: number) => {
    const res = await GetUsersById(id);
    if (res.status === 200) {
      setUser(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("guest_id");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      getUser(parsedData);
    }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("isLogin");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setIsLogin(parsedData);
    }
  }, [tripPayment]);

  if (!tripPayment || isLogin === "false") {
    return <UnauthorizedAccess />;
  }

  const handleLogoClick = () => {
    localStorage.removeItem("menu");
    localStorage.removeItem("showMenuFood");
    location.href = "/cruise-ship/login/home";
  };

  return (
    <>
      {contextHolder}
      <div className="cruise-ship-container">
        <nav className="navbar">
          <div>
            <div onClick={() => handleLogoClick()}>
              <img src={CruiseShipLogo} className="cruise-ship-logo" />
            </div>
          </div>
          <ul className="menu">
            <li
              onClick={() => handleMenuClick("home")}
              className={menu === "home" ? "active" : ""}
            >
              Home
            </li>
            <li
              onClick={() => handleMenuClick("activity")}
              className={menu === "activity" ? "active" : ""}
            >
              Activity
            </li>
            <li
              onClick={() => handleMenuClick("food-service")}
              className={menu === "food-service" ? "active" : ""}
            >
              Food Service
            </li>
          </ul>
          <div className="menu-food">
            <div className="user-container">
              <Tooltip
                className="custom-tooltip"
                title={
                  <>
                    <Button
                      className="logout-button"
                      type="primary"
                      danger
                      onClick={() => {
                        localStorage.clear();
                        location.href = "/cruise-ship/login";
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        fontWeight: "bold",
                      }}
                    >
                      Log out
                    </Button>
                  </>
                }
                placement="bottom"
                // overlayStyle={{ width: "10%", gap: "12px" }}
              >
                <div>
                  {/* <AiOutlineUser size={30} /> */}
                  <span>
                    {user?.first_name?.charAt(0)}
                  </span>
                </div>
              </Tooltip>
            </div>
            {showMenuFood && (
              <>
                <div className="search-container">
                  <LuSearch className="search-icon" size={30} />
                  <input
                    placeholder="Search Menu"
                    value={searchInput}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                </div>
                <Link to={`/cruise-ship/login/home/food-service/order-summary`}>
                  <div className="cart-container">
                    <LuShoppingCart size={30} />
                    {filteredOrderDetails.length > 0 && (
                      <span>
                        {filteredOrderDetails.reduce(
                          (total, order) => total + (order.Quantity || 0),
                          0
                        )}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            )}
          </div>
        </nav>
        <div className="menu-container">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default NavbarCruiseShip;
