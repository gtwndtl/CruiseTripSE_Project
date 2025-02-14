import { MdCancel } from "react-icons/md";
import { useOrder } from "../../context/OrderContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetMenuOptions } from "../../service/https/MenuOptionAPI";
import { MenuOptionInterface } from "../../interface/IMenuOption";
import { message } from "antd";
import "./OrderList.css";

const OrderList: React.FC = () => {
  const { filteredOrderDetails, filteredOrderDetailMenuOptions, removeItem, formatPriceWithoutDecimals } = useOrder(); // Access Context
  const [menuOption, setMenuOption] = useState<MenuOptionInterface[]>([]);
  const [messageApi] = message.useMessage();

  const getMenuOption = async () => {
    const res = await GetMenuOptions();
    if (res.status === 200) {
      setMenuOption(res.data);
    } else {
      setMenuOption([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  // ฟังก์ชันเพื่อคำนวณ Subtotal
  const subtotal = filteredOrderDetails
    .reduce((sum, item) => {
      const amount = item.Amount ?? 0;
      return sum + amount;
    }, 0)
    .toFixed(2);

  const handleRemoveItem = (menuID: number) => {
    removeItem(menuID); // ใช้ฟังก์ชันลบเมนู
  };

  useEffect(() => {
    getMenuOption();
  }, []);

  return (
    <aside className="order-list-container">
      <div className="my-order-container">
        <section>
          <h1 style={{ textAlign: "center", fontSize: "22px", margin:"16px" }}>My Order</h1>
          <hr />
          <div className="order-detail">

            <table className="table-order-detail">
              <tbody>
                {filteredOrderDetails.length > 0 ? (
                  filteredOrderDetails.map((item) => {
                    // ค้นหาตัวเลือกเมนูที่เกี่ยวข้องกับ OrderDetailID
                    const itemOptions = filteredOrderDetailMenuOptions.filter(
                      (option) => option.OrderDetailID === item.ID
                    );

                    return (
                      <tr key={item.ID}>
                        <td>
                          <MdCancel
                            className="cancel-icon"
                            color="aaa"
                            size={25}
                            onClick={() => handleRemoveItem(item.ID as number)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td className="quantity">x{formatPriceWithoutDecimals(item.Quantity ?? 0)}</td>
                        <td className="menu">
                          <div className="menu-detail">
                            <p className="menu-name">{item.Menu?.MenuName ?? "Unknown"}</p>
                            <div className="selected-options">
                              {itemOptions.length > 0 ? (
                                itemOptions.map((option) => {
                                  const matchedMenuOption = menuOption.find(
                                    (menuOption) => menuOption.ID === option.MenuItemOption?.MenuOptionID
                                  );
                                  return (
                                    <div key={option.ID} className="option-detail">
                                      <span> - {matchedMenuOption ? matchedMenuOption.OptionValue : "Unknown option"}</span>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="option-detail"></div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="amount">฿ {formatPriceWithoutDecimals(item.Amount ?? 0)}</td>
                      </tr>
                      // <div className="order-item" key={item.ID}>
                      //   <MdCancel
                      //     className="cancel-icon"
                      //     color="aaa"
                      //     size={25}
                      //     onClick={() => handleRemoveItem(item.ID as number)}
                      //     style={{ cursor: "pointer" }}
                      //   />
                      //   <span>x{item.Quantity}</span>
                      //   <div className="menu-detail">
                      //     <span className="menu-name">{item.Menu?.MenuName ?? "Unknown"}</span>
                      //     <div className="selected-options">
                      //       {itemOptions.length > 0 ? (
                      //         itemOptions.map((option) => {
                      //           const matchedMenuOption = menuOption.find(
                      //             (menuOption) => menuOption.ID === option.MenuItemOption?.MenuOptionID
                      //           );
                      //           return (
                      //             <div key={option.ID} className="option-detail">
                      //               <span> - {matchedMenuOption ? matchedMenuOption.OptionValue : "Unknown option"}</span>
                      //             </div>
                      //           );
                      //         })
                      //       ) : (
                      //         <div className="option-detail"></div>
                      //       )}
                      //     </div>
                      //   </div>
                      //   <span className="price">฿ {formatPrice(item.Amount ?? 0)}</span>
                      // </div>
                    );
                  })
                ) : (
                  <tr style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <td>
                      <p style={{fontWeight:"normal"}}>No items in the order.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="summary">
          <div className="total">
            <h1 style={{ margin: 0 }}>Total</h1>
            <h1 style={{ margin: 0 }}>฿ {formatPriceWithoutDecimals(subtotal)}</h1>
          </div>
          <Link to={`${location.pathname}/order-summary`}>
            <button className="confirm-order-button">View Order</button>
          </Link>
        </section>
      </div>
    </aside>
  );
};


export default OrderList;