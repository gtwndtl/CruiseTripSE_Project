import React, { createContext, useContext, useEffect, useState } from "react";
import { MenuItemOptionInterface } from "../interface/IMenuItemOption";
import { MenuInterface } from "../interface/IMenu";
import { OrderInterface } from "../interface/IOrder";
import { message } from "antd";
import { CreateOrder, UpdateOrderById } from "../service/https/OrderAPI";
import { OrderDetailInterface } from "../interface/IOrderDetail";
import { DeleteOrderDetailById, UpdateOrderDetailById } from "../service/https/OrderDetailAPI";
import { GetOrderDetailMenuOptions } from "../service/https/OrderDetailMenuOption";
import { OrderDetailMenuOptionInterface } from "../interface/IOrderDetailMenuOption";
import { AddItemToOrder, GetOrderByGustID } from "../service/https/OrderManageAPI";
import { GetTripPaymentIDForFoodPayment } from "../../payment/service/https/TripPaymentAPI";
import { TripPaymentInterface } from "../../payment/interface/ITripPayment";

// Updated Order interface
export interface Order {
  MenuDetail: MenuInterface;
  Quantity: number;
  SelectedOptions: Record<string, MenuItemOptionInterface>;
  Amount: number; // New field for total price
}

interface OrderContextType {
  filteredOrderDetails: OrderDetailInterface[];
  filteredOrderDetailMenuOptions: OrderDetailMenuOptionInterface[];
  totalAmount: number;
  orderID: number;
  GuestID: number;
  tripPayment?: TripPaymentInterface;
  searchInput: string;
  addItem: (order: Order) => void;
  removeItem: (MenuDetailID: number) => void;
  increaseQuantityItem: (OrderDetail: OrderDetailInterface,) => void;
  decreaseQuantityItem: (OrderDetail: OrderDetailInterface) => void;
  formatPriceWithoutDecimals: (price: number | string) => string;
  formatPriceWithTwoDecimals: (price: number | string) => string;
  setSearchInput: (value: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [filteredOrderDetails, setFilteredOrderDetails] = useState<OrderDetailInterface[]>([]);
  const [GuestID, setGuestID] = useState<number>(0);
  const [orderID, setOrderID] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [filteredOrderDetailMenuOptions, setFilteredOrderDetailMenuOptions] = useState<OrderDetailMenuOptionInterface[]>([]);
  const [tripPayment, SetTripPayment] = useState<TripPaymentInterface>();

  const [searchInput, setSearchInput] = useState("");
  // console.log("tripPayment", tripPayment)

  useEffect(() => {
    if (orderID && filteredOrderDetails.length > 0) {
      updateTotalAmount(filteredOrderDetails);
    } else {
      loadData(); // โหลดข้อมูลเมื่อ Component ถูก mount หรือเมื่อ `orderID` และ `filteredOrderDetails` เปลี่ยนแปลงไปยังสถานะว่าง
    }
  }, [orderID]);
  
  

  const updateTotalAmount = async (orderDetail: OrderDetailInterface[]) => {
    if (!orderID || orderID === 0 || !GuestID) {
      console.warn("OrderID or GuestID is not set yet.");
      return; // หยุดการทำงานถ้า orderID ยังไม่ถูกตั้งค่า
    }
  
    const totalAmount = orderDetail.reduce((sum, detail) => sum + (detail.Amount ?? 0), 0);
  
    try {
      const updatedOrder: OrderInterface = {
        TotalAmount: totalAmount,
        OrderDate: new Date(),
        StatusID: 4,
        GuestID: GuestID,
      };
  
      const res = await UpdateOrderById(orderID, updatedOrder);
      if (res.status === 200) {
        setTotalAmount(totalAmount);
        // message.success("Order total amount updated successfully.");
      } else {
        message.error("Failed to update order total amount.");
      }
    } catch (error) {
      console.error("Error updating total amount:", error);
    }
  };
  
  
  const loadData = async () => {
    const GuestDataString = localStorage.getItem("guest_id");
  
    if (GuestDataString) {
      const GuestData = JSON.parse(GuestDataString);
      setGuestID(GuestData);

      const resTripPayment = await GetTripPaymentIDForFoodPayment(GuestData)

      if (resTripPayment.status === 200) {
        SetTripPayment(resTripPayment.data)
        const res = await GetOrderByGustID(GuestData);

        if (res.status === 200) {
          setOrderID(res.data.ID);
          // console.log("res.data.OrderDetails", res.data.OrderDetails)
          const filteredOrderDetails: OrderDetailInterface[] = res.data.OrderDetails
          setFilteredOrderDetails(res.data.OrderDetails)
  
          const menuOptionRes = await GetOrderDetailMenuOptions();
            const filteredMenuOptions = menuOptionRes.data.filter(
              (menuOption: OrderDetailMenuOptionInterface) =>
                filteredOrderDetails.some((detail: OrderDetailInterface) => detail.ID === menuOption.OrderDetailID
              )
            );

          setFilteredOrderDetailMenuOptions(filteredMenuOptions);
          updateTotalAmount(filteredOrderDetails);
        } else {
          console.warn("Failed to fetch order by ID");
        }
      } else {
        console.error("Failed to fetch trip payment by ID");
      }
  
    }
  };
  
  const addItem = async (newOrder: Order) => {
    if (!GuestID) {
      message.error("Customer ID is missing. Please log in again.");
      return;
    }
    // console.log("order addItem", orderID)
    if (orderID == 0) {
      // ถ้าไม่มี orderID สำหรับ customer ให้สร้าง order ใหม่
      const newOrderData: OrderInterface = {
        OrderDate: new Date(),
        TotalAmount: 0, // ค่าเริ่มต้น
        StatusID: 4,
        GuestID: GuestID || 0,
      };
        
      const order = await CreateOrder(newOrderData);
      // console.log("order CreateOrder data", order)
      if (order.status === 201) {
        const resItem = await AddItemToOrder({
          order_id: order.data.data.ID,
          menu_id: newOrder.MenuDetail.ID,
          quantity: newOrder.Quantity,
          selected_options: Object.values(newOrder.SelectedOptions).map((option) => ({
            menu_option_id: option.ID,
          })),
        });
      
        if (resItem.status === 200) {
          setOrderID(order.data.data.ID)
          loadData();
          return;
        }else {
          message.error("Failed to create order.");
          return;
        }
      } else {
        message.error("Failed to create order.");
        return;
      }
    }else {
      const Item = await AddItemToOrder({
        order_id: orderID,
        menu_id: newOrder.MenuDetail.ID,
        quantity: newOrder.Quantity,
        selected_options: Object.values(newOrder.SelectedOptions).map((option) => ({
          menu_option_id: option.ID,
        })),
      });
      if (Item.status === 200) {
        loadData();
        return;
      }else {
        message.error("Failed to add item to order.");
        return;
      }
    }
    loadData();
  };
  
  const removeItem = async (orderDetailID: number) => {
    const res = await DeleteOrderDetailById(orderDetailID);
    if (res.status == 200) {
      // message.success("order delete");
      await loadData();
    } else {
      message.error("Failed to add order detail to the database.");
    }
  };

  const increaseQuantityItem = async (OrderDetail: OrderDetailInterface) => {
    if (!OrderDetail || !OrderDetail.Quantity || !OrderDetail.Amount) {
      message.error("OrderDetail is undefined");
      return;
    }
    
    const newQuantity = OrderDetail.Quantity + 1;
    const newAmount = OrderDetail.Amount + (OrderDetail.Amount/ OrderDetail.Quantity);
  
    const orderDetailData: OrderDetailInterface = {
      ...OrderDetail,
      Quantity: newQuantity,
      Amount: newAmount,
    };
  
    if (OrderDetail.ID !== undefined) {
      const res = await UpdateOrderDetailById(OrderDetail.ID, orderDetailData);

      if (res.status === 200) {
        // message.success("Quantity increased successfully");
        await loadData();
      } else {
        message.error("Failed to update order detail");
      }
    } else {
      console.error("OrderDetail.ID is undefined");
    }
  };
  
  const decreaseQuantityItem = async (OrderDetail: OrderDetailInterface) => {
    if (!OrderDetail || !OrderDetail.Quantity || !OrderDetail.Amount) {
      message.error("OrderDetail is undefined");
      return;
    }
    
    if (OrderDetail.Quantity > 1) {
      const newQuantity = OrderDetail.Quantity - 1;
      const newAmount = OrderDetail.Amount - (OrderDetail.Amount/ OrderDetail.Quantity);
  
      const orderDetailData: OrderDetailInterface = {
        ...OrderDetail,
        Quantity: newQuantity,
        Amount: newAmount,
      };
      if (OrderDetail.ID !== undefined) {
        const res = await UpdateOrderDetailById(OrderDetail.ID, orderDetailData);
  
        if (res.status === 200) {
          // message.success("Quantity decreased successfully");
          await loadData();
        } else {
          message.error("Failed to update order detail");
        }
      } else {
        console.error("OrderDetail.ID is undefined");
      }
      
      
    } else {
      if (OrderDetail.ID !== undefined) {
        removeItem(OrderDetail.ID)
      } else {
        console.error("OrderDetail.ID is undefined");
      }
    }
  };

  // ฟังก์ชันเพื่อจัดรูปแบบตัวเลขให้มีเครื่องหมายคอมมาและไม่มีจุดทศนิยม
  const formatPriceWithoutDecimals = (price: number | string): string => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const formatPriceWithTwoDecimals = (price: number | string): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
    }).format(Number(price));
  };

  return (
    <OrderContext.Provider
      value={{
        filteredOrderDetails,
        filteredOrderDetailMenuOptions,
        totalAmount,
        orderID,
        GuestID,
        tripPayment,
        searchInput,
        addItem,
        removeItem,
        increaseQuantityItem,
        decreaseQuantityItem,
        formatPriceWithoutDecimals,
        formatPriceWithTwoDecimals,
        setSearchInput,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
