import { useEffect, useState } from "react";
import { MenuInterface } from "../../interface/IMenu";
import { GetMenu } from "../../service/https/MenuAPI";
import { message } from "antd";
// import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useOrder } from "../../context/OrderContext";
import { Empty } from 'antd';
import "./MenuList.css";

interface MenuListProps {
  selectFoodCategory: string;
}
export default function MenuList({ selectFoodCategory }: MenuListProps) {
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { searchInput, formatPriceWithoutDecimals } = useOrder();
  // const location = useLocation();

  const getMenus = async () => {
    const res = await GetMenu();
    console.log("res",res)
    console.log("res.data",res.data)
    if (res.status === 200) {
      setMenu(res.data);
    } else {
      setMenu([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  // const formatPrice = (price: number | string) => {
  //   return new Intl.NumberFormat("en-US", {
  //     maximumFractionDigits: 0,
  //     minimumFractionDigits: 0,
  //   }).format(Number(price));
  // };

  useEffect(() => {
    getMenus();
  }, []);

  const filteredMenu = menu.filter((item) => {
    const matchesCategory =
      selectFoodCategory === "All" ||
      selectFoodCategory === item.FoodCategory?.FoodCategoryName;

    const matchesSearch =
      searchInput === "" ||
      item.MenuName.toLowerCase().includes(searchInput.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-list-container" id="menu-list-container">
      {contextHolder}
      {filteredMenu.length > 0 ? (
        filteredMenu.map((item) => (
          <Link
            key={item.ID}
            to={`${location.pathname}/menu-detail`}
            state={{ menuDetailSelect: item }}
            style={{
              textDecoration: "none",
              color: "black",
              width: "auto",
              height: "100%",
            }}
          >
            <div className="menu-item">
              <div className="menu-item-image-container">
                <img
                  src={item.ImageMenu}
                  alt={item.MenuName}
                  className="menu-item-image"
                />
              </div>
              <div className="menu-item-info">
                <div className="info">
                  <header>
                    <h1 className="menu-name">{item.MenuName}</h1>
                    <h1 className="menu-price">฿ {formatPriceWithoutDecimals(item.Price)}</h1>
                  </header>
                </div>
                {/* <div className="menu-item-footer">
                  <Flex gap="middle" vertical>
                    <Rate disabled defaultValue={4}/>
                  </Flex>
                    <div className="select-order">select</div>
                </div> */}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="no-data-container">
          <Empty className="no-data" description={`No Menu Found`}/>
        </div>
      )}
    </div>
  );
}