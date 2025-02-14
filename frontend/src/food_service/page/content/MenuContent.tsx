import PromoButton from "../../../promotion(gtwndtl)/pages/promobutton/promobutton";
import ReviewFoodShow from "../../../review(gtwndtl)/pages/reviewshow/food/ReviewFoodShow";
import MenuList from "../menu_list/MenuList";
import OrderList from "../order_list/OrderList";
import "./MenuContent.css";

interface MenuListProps {
  selectFoodCategory: string;
}

export default function MenuContent({ selectFoodCategory }: MenuListProps) {
  return (
    <section className="content-container" id="content-container">
      <h1>{selectFoodCategory} Menus</h1>
      <div className="menu-content">
        <MenuList selectFoodCategory={selectFoodCategory} />
        <OrderList />
      </div>
      <div className="promo-container">
        <PromoButton />
      </div>
      <div><ReviewFoodShow /></div>
    </section>
  );
}
