import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GetMenuItemOptions } from "../../service/https/MenuItemOption";
import { message } from "antd";
import { MenuItemOptionInterface } from "../../interface/IMenuItemOption";
import { IoChevronBackSharp } from "react-icons/io5";
import { Order, useOrder } from "../../context/OrderContext";
// import { Flex, Rate } from 'antd';
import { MdError } from "react-icons/md";
import "./MenuDetail.css";

const MenuDetail: React.FC = () => {
  const { addItem, formatPriceWithoutDecimals } = useOrder();
  const navigate = useNavigate();
  const location = useLocation();
  const { menuDetailSelect } = location.state || {};

  const [quantity, setQuantity] = useState<number>(1);
  const [menuItemOptions, setMenuItemOptions] = useState<MenuItemOptionInterface[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, MenuItemOptionInterface>>({});
  const [optionErrors, setOptionErrors] = useState<Record<string, boolean>>({});
  const [messageApi, contextHolder] = message.useMessage();

  const getMenuItemOption = async () => {
    const res = await GetMenuItemOptions();
    if (res.status === 200) {
      setMenuItemOptions(res.data);
    } else {
      setMenuItemOptions([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const calculateTotalPrice = () => {
    const optionsPrice = Object.values(selectedOptions).reduce(
      (acc, option) => acc + (option.MenuOption?.ExtraPrice || 0) * quantity,
      0
    );
    const basePrice = (menuDetailSelect?.Price || 0) * quantity;
    return optionsPrice + basePrice;
  };

  const totalPrice = calculateTotalPrice();

  const filteredOptions = menuItemOptions.filter(
    (option) => option.MenuID === menuDetailSelect?.ID
  );

  const groupedOptions = filteredOptions.reduce((acc, item) => {
    const optionName = item.MenuOption?.OptionName;
    if (optionName) {
      if (!acc[optionName]) acc[optionName] = [];
      acc[optionName].push(item);
    }
    return acc;
  }, {} as Record<string, MenuItemOptionInterface[]>);

  const handleQuantityChange = (action: "increase" | "decrease") => {
    setQuantity((prevQuantity) =>
      action === "increase" ? prevQuantity + 1 : Math.max(prevQuantity - 1, 1)
    );
  };

  const handleOptionChange = (optionName: string, option: MenuItemOptionInterface) => {
    setSelectedOptions((prev) => {
      if (prev[optionName]?.ID === option.ID) {
        const updatedOptions = { ...prev };
        delete updatedOptions[optionName];
        return updatedOptions;
      }
      return { ...prev, [optionName]: option };
    });
  
    // Remove error for this option group if an option is selected
    setOptionErrors((prevErrors) => ({
      ...prevErrors,
      [optionName]: false,  // Set error for this group to false
    }));
  };
  

  const handleAddOrder = () => {
    if (!menuDetailSelect || quantity < 1) {
      return;
    }

    let hasError = false;
    const newOptionErrors: Record<string, boolean> = {};

    // Check if all option groups have selected options
    for (const optionName in groupedOptions) {
      if (!selectedOptions[optionName]) {
        hasError = true;
        newOptionErrors[optionName] = true;  // Mark the option group with an error
      } else {
        newOptionErrors[optionName] = false;
      }
    }

    if (hasError) {
      setOptionErrors(newOptionErrors);
      return;
    }

    let amount = menuDetailSelect.Price || 0;
    Object.values(selectedOptions).forEach(option => {
      amount += option.MenuOption?.ExtraPrice || 0;
    });

    const orderData: Order = {
      MenuDetail: menuDetailSelect,
      Quantity: quantity,
      SelectedOptions: selectedOptions,
      Amount: amount * quantity,
    };

    addItem(orderData);
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}`);
  };

  useEffect(() => {
    getMenuItemOption();
  }, []);

  useEffect(() => {
    if (menuItemOptions.length > 0) {
      const defaultSelectedOptions: Record<string, MenuItemOptionInterface> = {};
      for (const optionName in groupedOptions) {
        if (groupedOptions[optionName].length > 0) {
          defaultSelectedOptions[optionName] = groupedOptions[optionName][0];
        }
      }
      setSelectedOptions(defaultSelectedOptions);
    }
  }, [menuItemOptions]);

  // const isButtonDisabled = Object.keys(groupedOptions).some(
  //   (optionName) => !selectedOptions[optionName]
  // );
  return (
    <>
      {contextHolder}
      <div className="menu-detail-layout">
        <Link to={`${location.pathname.split('/').slice(0, -1).join('/')}`}>
          <IoChevronBackSharp size={30} className="back-to-menu" />
        </Link>
        <section className="menu-detail-container">
          <div className="menu-detail">
            <img src={menuDetailSelect?.ImageMenu} alt={menuDetailSelect.MenuName} />
            <div className="menu-detail-info">
              <h1 >Description</h1>
              <hr />
              <div>
                <p>{menuDetailSelect?.Description}</p>
              </div>
            </div>
          </div>

          <section className="menu-detail-content-container" onSubmit={(event) => event.preventDefault()}>
            <div className="menu-detail-content">
              <div className="header">
                <h1>{menuDetailSelect?.MenuName}</h1>
                {/* <Flex gap="middle" vertical>
                  <Rate disabled defaultValue={4} />
                </Flex> */}
              </div>

              <hr style={{ marginBottom: "16px" }} />

              <div className="menu-detail-option">
                {Object.keys(groupedOptions).map((optionName) => (
                  <div
                    key={optionName}
                    className={`option-group ${optionErrors[optionName] ? "error" : ""}`}
                  >
                    <header className="option-name">
                      <h1>{optionName}</h1>
                      {optionErrors[optionName] && (
                        <div className="error-message">
                          <MdError color="red" size={16}/>
                          <span>Required</span>
                        </div>
                      )}
                    </header>
                    <div className="option-group-content">
                      {groupedOptions[optionName].map((option, index) => (
                        <label key={option.ID} style={{ width: "auto" }}>
                          <div
                            className={`menu-option ${
                              selectedOptions[optionName]?.ID === option.ID ? "selected" : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name={optionName}
                              value={option.MenuOption?.OptionValue}
                              checked={selectedOptions[optionName]?.ID === option.ID}
                              onClick={() => handleOptionChange(optionName, option)}
                              style={{ display: "none" }}
                            />
                            <span className="option-value">
                              {option.MenuOption?.OptionValue}
                              {index === 0 && (
                                <span style={{ color: "var(--color-disable)", marginLeft: "4px" }}>(Default)</span>
                              )}
                            </span>
                            <span className="option-extra-price">
                              + {option.MenuOption?.ExtraPrice} ฿
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>

                  </div>
                ))}
              </div>

              <section className="menu-detail-footer">
                <div className="menu-detail-quantity-container">
                  <h1>Quantity</h1>
                  <div className="menu-detail-quantity-control">
                    <button className="menu-detail-minus-button" onClick={() => handleQuantityChange("decrease")}>
                      -
                    </button>
                    <input
                      className="menu-detail-quantity"
                      name="quantity"
                      value={formatPriceWithoutDecimals(quantity)}
                      readOnly
                    />
                    <button className="menu-detail-plus-button" onClick={() => handleQuantityChange("increase")}>
                      +
                    </button>
                  </div>
                </div>

                <div className="menu-detail-button-container">
                  <button className="menu-detail-add-order-button" onClick={handleAddOrder}>
                    <span className="menu-detail-total-price">
                      Add order ฿ {formatPriceWithoutDecimals(totalPrice)}
                    </span>
                  </button>
                </div>
              </section>
            </div>
          </section>
        </section>
      </div>
    </>
  );
};

export default MenuDetail;
