import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FoodCategoryInterface } from '../../interface/IFoodCategory'
import { GetFoodCategory } from '../../service/https/FoodCategoryAPI';
import { message } from 'antd';
// import { BiSolidDrink } from "react-icons/bi";
import "./MenuCategory.css"

// Define the type for the props
type MenuCategoryProps = {
    selectFoodCategory: string;
    setSelectFoodCategory: Dispatch<SetStateAction<string>>;
  };

export default function MenuCategory({selectFoodCategory, setSelectFoodCategory}: MenuCategoryProps) {
    const [foodCategory, setFoodCategory] = useState<FoodCategoryInterface[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const getFoodCategory = async () => {
        const res = await GetFoodCategory();
        if (res.status === 200) {
            setFoodCategory(res.data);
        } else {
            setFoodCategory([]);
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
    
    useEffect(() => {
        getFoodCategory();
      }, []);

  return (
      <section className="menu-category-container">
        {contextHolder}
        <h1>Explore Our Menu Category</h1>
        <div className="menu-category-list">
            {foodCategory.map((item) => {
                return (
                <div key={item.ID} className="menu-category-item-container" onClick={() => setSelectFoodCategory((prev: string)=>prev==item.FoodCategoryName?"All":item.FoodCategoryName || "All")}>
                    <div className={selectFoodCategory==item.FoodCategoryName?"menu-category-item-active":"menu-category-item"}>
                      <img src={item.FoodCategoryImage} alt={item.FoodCategoryName} />
                      <p>{item.FoodCategoryName}</p>
                    </div>
                </div>
                )
            })}
        </div>
        <hr />
    </section>

  )
}
