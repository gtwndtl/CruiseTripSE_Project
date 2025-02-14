package config

import (
	"fmt"
	"team03/se67/entity"
	"time"
	// "gorm.io/gorm"
)

// SetupFoodServiceDatabase ตั้งค่าฐานข้อมูล Food Service
func SetupFoodServiceDatabase() {
	// Auto-migrate tables
	db.AutoMigrate(
		&entity.FoodCategories{},
		&entity.Menus{},
		&entity.MenuOptions{},
		&entity.MenuItemOptions{},
		&entity.Orders{},
		&entity.OrderDetails{},
		&entity.OrderDetailMenuOptions{},
	)

	foodCategories := []entity.FoodCategories{
		{FoodCategoryName: "Main Courses", FoodCategoryImage: "https://cdn-icons-png.flaticon.com/512/12735/12735825.png"},
		{FoodCategoryName: "Starters", FoodCategoryImage: "https://cdn-icons-png.flaticon.com/512/272/272186.png"},
		{FoodCategoryName: "Drinks", FoodCategoryImage: "https://cdn-icons-png.flaticon.com/512/712/712030.png"},
		{FoodCategoryName: "Desserts", FoodCategoryImage: "https://cdn-icons-png.flaticon.com/512/1145/1145410.png"},
		{FoodCategoryName: "Seafood", FoodCategoryImage: "https://cdn-icons-png.flaticon.com/512/877/877229.png"},
		{FoodCategoryName: "Vegetarian", FoodCategoryImage: "https://cdn-icons-png.flaticon.com/512/1880/1880223.png"},
		{FoodCategoryName: "Snacks", FoodCategoryImage: "https://cdn-icons-png.flaticon.com/512/6895/6895664.png"},
	}
	for i := range foodCategories {
		db.FirstOrCreate(&foodCategories[i], entity.FoodCategories{FoodCategoryName: foodCategories[i].FoodCategoryName})
	}
	
	menus := []entity.Menus{
		{MenuName: "Orange Juice", Price: 40.00, Description: "A refreshing drink made from the finest oranges, bursting with natural flavor and perfect for any time of the day.", ImageMenu: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-03/orange-juice-1-jp-240311-1e99ea.jpg", FoodCategoryID: foodCategories[2].ID}, //Drink
		{MenuName: "Steak", Price: 250.00, Description: "A classic dish featuring a grilled centerpiece served with a savory and satisfying flavor profile, perfect for any occasion.", ImageMenu: "https://natashaskitchen.com/wp-content/uploads/2020/03/Pan-Seared-Steak-4-728x1092.jpg", FoodCategoryID: foodCategories[0].ID}, //Main Courses
		{MenuName: "Fried Chicken Wings", Price: 120.00, Description: "Golden-fried and crispy, these wings are seasoned to perfection, offering a delightful crunch with every bite.", ImageMenu: "https://jesspryles.com/wp-content/uploads/2018/01/korean-fried-chicken-32.jpg", FoodCategoryID: foodCategories[1].ID}, //Starters
		{MenuName: "Caesar Salad", Price: 90.00, Description: "A classic salad with crisp greens, seasoned croutons, and a creamy dressing that balances flavor and freshness beautifully.", ImageMenu: "https://itsavegworldafterall.com/wp-content/uploads/2023/04/Avocado-Caesar-Salad-FI.jpg", FoodCategoryID: foodCategories[1].ID}, //Starters
		{MenuName: "Margherita Pizza", Price: 180.00, Description: "A timeless pizza with a light, crispy crust, topped with rich tomato sauce and creamy mozzarella for a perfect bite.", ImageMenu: "https://kristineskitchenblog.com/wp-content/uploads/2024/07/margherita-pizza-22-2.jpg", FoodCategoryID: foodCategories[0].ID}, //Main Courses
		{MenuName: "Spaghetti Carbonara", Price: 150.00, Description: "A creamy and indulgent pasta dish with a velvety sauce that coats every strand of spaghetti perfectly.", ImageMenu: "https://www.foodnetwork.com/content/dam/images/food/fullset/2009/6/12/2/FO1D41_23785_s4x3.jpg", FoodCategoryID: foodCategories[0].ID}, //Main Courses
		{MenuName: "Tom Yum Soup", Price: 120.00, Description: "A bold and flavorful soup that combines a perfect balance of spicy, sour, and aromatic ingredients.", ImageMenu: "https://evergreenkitchen.ca/wp-content/uploads/2021/10/Vegan-Tom-Yum-Soup-0-4X5.jpg", FoodCategoryID: foodCategories[0].ID}, //Main Courses
		{MenuName: "Mango Sticky Rice", Price: 80.00, Description: "A delightful dessert featuring tender rice paired with the natural sweetness of fresh fruit for a perfect finish.", ImageMenu: "https://www.vibrantplate.com/wp-content/uploads/2024/03/Thai-Mango-Sticky-Rice-05-735x1103.jpg", FoodCategoryID: foodCategories[1].ID}, //Starters
		{MenuName: "Green Tea Latte", Price: 70.00, Description: "A soothing beverage with the earthy flavor of green tea combined with the creamy texture of steamed milk.", ImageMenu: "https://munchingwithmariyah.com/wp-content/uploads/2020/06/IMG_0748.jpg", FoodCategoryID: foodCategories[2].ID}, //Drink
		{MenuName: "Chocolate Cake", Price: 100.00, Description: "A rich and decadent dessert made with layers of moist cake and velvety chocolate frosting.", ImageMenu: "https://sallysbakingaddiction.com/wp-content/uploads/2013/04/triple-chocolate-cake-4.jpg", FoodCategoryID: foodCategories[3].ID},
		{MenuName: "Sushi Set", Price: 220.00, Description: "A delightful assortment of fresh sushi, including a variety of fish, served with a side of spicy wasabi and rich soy sauce, creating the perfect balance of flavors for sushi enthusiasts.", ImageMenu: "https://img.freepik.com/premium-photo/sushi-set-served-with-traditional-soy-sauce-wasabi-ginger-japanese-cuisine-ai-generated_871188-1000.jpg", FoodCategoryID: foodCategories[0].ID}, //Main Courses
		{MenuName: "French Fries", Price: 50.00, Description: "Crispy and golden fries, perfectly seasoned, offering a satisfying crunch in every bite. These classic fries are ideal as a side dish or a quick snack for any time of the day.", ImageMenu: "https://sausagemaker.com/wp-content/uploads/Homemade-French-Fries_8.jpg", FoodCategoryID: foodCategories[1].ID}, //Starters
		{MenuName: "Latte", Price: 65.00, Description: "A smooth and velvety hot espresso blended with steamed milk, topped with a thin layer of foam. This comforting beverage is perfect for those who love a rich coffee flavor with a creamy finish.", ImageMenu: "https://img.freepik.com/photos-premium/creer-cafe-latte-art_908985-22032.jpg", FoodCategoryID: foodCategories[2].ID}, //Drink
		{MenuName: "Grilled Salmon", Price: 300.00, Description: "Tender and juicy salmon fillets, grilled to perfection with a crispy exterior while keeping the inside moist and flavorful. This dish is served with a light seasoning to enhance the natural taste of the fish, ideal for seafood lovers.", ImageMenu: "https://hips.hearstapps.com/hmg-prod/images/how-to-grill-salmon-recipe1-1655870645.jpg?crop=0.6666666666666667xw:1xh;center,top&resize=1200:*", FoodCategoryID: foodCategories[4].ID}, // Seafood
		{MenuName: "Vegetable Stir Fry", Price: 150.00, Description: "A colorful medley of fresh, crunchy vegetables stir-fried in a savory sauce. The dish is packed with nutrients and flavor, making it a healthy and satisfying choice for those craving a plant-based meal.", ImageMenu: "https://www.thesmalltownfoodie.com/wp-content/uploads/2018/05/Vegetable-Stir-Fry2.png", FoodCategoryID: foodCategories[5].ID}, // Vegetarian
		{MenuName: "Iced Coffee", Price: 50.00, Description: "A refreshing iced coffee made with chilled espresso and topped with milk, offering a cool and energizing pick-me-up. It's perfect for a hot day when you're in need of a smooth, caffeinated drink.", ImageMenu: "https://mns.sidechef.com/recipe/34d9bf7f-6bfb-4e60-8301-726e5ac6509c.jpg?d=1408x1120", FoodCategoryID: foodCategories[2].ID}, //Drink
		{MenuName: "BBQ Ribs", Price: 280.00, Description: "Tender pork ribs, slow-cooked and smothered in a rich, smoky barbecue sauce. The perfect combination of sweet, savory, and smoky flavors, these ribs are a true indulgence for meat lovers.", ImageMenu: "https://www.grillseeker.com/wp-content/uploads/2022/06/sauced-pork-ribs-on-a-baoking-sheet.jpg", FoodCategoryID: foodCategories[0].ID}, //Main Courses
		{MenuName: "Spring Rolls", Price: 70.00, Description: "Crispy and light vegetable spring rolls, filled with a flavorful mix of fresh vegetables and herbs, then fried to a perfect golden crisp. These make for a perfect appetizer or snack, paired with a tangy dipping sauce.", ImageMenu: "https://redhousespice.com/wp-content/uploads/2021/12/whole-spring-rolls-and-halved-ones-scaled.jpg", FoodCategoryID: foodCategories[1].ID}, //Starters
		{MenuName: "Chocolate Mousse", Price: 90.00, Description: "A rich and creamy chocolate mousse made with high-quality chocolate, whipped to perfection for a light yet indulgent texture. This dessert is the ultimate treat for chocolate lovers, offering a silky-smooth finish.", ImageMenu: "https://bakerbynature.com/wp-content/uploads/2023/08/Easy-Chocolate-Mousse-Baker-by-Nature-12617-1.jpg", FoodCategoryID: foodCategories[3].ID},
		{MenuName: "Lobster Tail", Price: 400.00, Description: "A succulent lobster tail, grilled to perfection, served with a side of melted butter for dipping. This luxurious dish offers a delicate and sweet flavor, perfect for those celebrating a special occasion or indulging in gourmet seafood.", ImageMenu: "https://www.wholesomeyum.com/wp-content/uploads/2023/12/wholesomeyum-Grilled-Lobster-Tail.jpg", FoodCategoryID: foodCategories[4].ID},
		{MenuName: "Vegan Burger", Price: 120.00, Description: "A hearty and satisfying plant-based burger, made with fresh vegetables, beans, and flavorful seasonings, all piled into a soft bun. It's a delicious and wholesome option for those seeking a vegan meal with all the satisfaction of a classic burger.", ImageMenu: "https://biancazapatka.com/wp-content/uploads/2021/10/rote-bete-burger.jpg", FoodCategoryID: foodCategories[5].ID},
		{MenuName: "Nachos", Price: 100.00, Description: "A mouthwatering dish of crispy corn chips topped with a generous amount of melted cheese, salsa, and optional toppings like sour cream, guacamole, or jalapeños. Perfect for sharing with friends or enjoying as a hearty snack.", ImageMenu: "https://www.babaganosh.org/wp-content/uploads/2021/01/skillet-beef-nachos-22.jpg", FoodCategoryID: foodCategories[6].ID},
	}
	for i := range menus {
		db.FirstOrCreate(&menus[i], entity.Menus{MenuName: menus[i].MenuName})
	}
	

	menuOptions := []entity.MenuOptions{
		{OptionName: "Size", OptionValue: "Small", ExtraPrice: 0},
		{OptionName: "Size", OptionValue: "Medium", ExtraPrice: 10},
		{OptionName: "Size", OptionValue: "Large", ExtraPrice: 20},
		{OptionName: "Protein", OptionValue: "Pork", ExtraPrice: 0},
		{OptionName: "Protein", OptionValue: "Chicken", ExtraPrice: 0},
		{OptionName: "Protein", OptionValue: "Beef", ExtraPrice: 20},
		{OptionName: "Protein", OptionValue: "Tofu", ExtraPrice: 0},
		{OptionName: "Spice Level", OptionValue: "Mild", ExtraPrice: 0},
		{OptionName: "Spice Level", OptionValue: "Medium", ExtraPrice: 5},
		{OptionName: "Spice Level", OptionValue: "Hot", ExtraPrice: 10},
		{OptionName: "Toppings", OptionValue: "Cheese", ExtraPrice: 15},
		{OptionName: "Toppings", OptionValue: "Bacon", ExtraPrice: 20},
		{OptionName: "Toppings", OptionValue: "Vegetables", ExtraPrice: 10},
		{OptionName: "Cooking Level", OptionValue: "Rare", ExtraPrice: 0},
		{OptionName: "Cooking Level", OptionValue: "Medium Rare", ExtraPrice: 0},
		{OptionName: "Cooking Level", OptionValue: "Medium", ExtraPrice: 0},
		{OptionName: "Cooking Level", OptionValue: "Medium Well", ExtraPrice: 0},
		{OptionName: "Cooking Level", OptionValue: "Well Done", ExtraPrice: 0},
	}
	for i := range menuOptions {
		db.FirstOrCreate(&menuOptions[i], entity.MenuOptions{OptionName: menuOptions[i].OptionName, OptionValue: menuOptions[i].OptionValue})
	}

	menuItemOptions := []entity.MenuItemOptions{
		{MenuID: menus[0].ID, MenuOptionID: menuOptions[0].ID},  // Orange Juice - Small
		{MenuID: menus[0].ID, MenuOptionID: menuOptions[1].ID},  // Orange Juice - Medium
		{MenuID: menus[1].ID, MenuOptionID: menuOptions[4].ID},  // Steak - Chicken
		{MenuID: menus[1].ID, MenuOptionID: menuOptions[5].ID},  // Steak - Beef
		{MenuID: menus[1].ID, MenuOptionID: menuOptions[13].ID},  // Steak - Rare
		{MenuID: menus[1].ID, MenuOptionID: menuOptions[14].ID},  // Steak - Medium Rare
		{MenuID: menus[1].ID, MenuOptionID: menuOptions[15].ID},  // Steak - Medium
		{MenuID: menus[1].ID, MenuOptionID: menuOptions[16].ID},  // Steak - Medium Well
		{MenuID: menus[1].ID, MenuOptionID: menuOptions[17].ID}, // Steak - Well Done
		{MenuID: menus[6].ID, MenuOptionID: menuOptions[7].ID},  // Tom Yum Soup - Mild
		{MenuID: menus[6].ID, MenuOptionID: menuOptions[8].ID},  // Tom Yum Soup - Mild
		{MenuID: menus[6].ID, MenuOptionID: menuOptions[9].ID},  // Tom Yum Soup - Hot
		{MenuID: menus[4].ID, MenuOptionID: menuOptions[10].ID},  // Margherita Pizza - Cheese Topping
		{MenuID: menus[4].ID, MenuOptionID: menuOptions[11].ID},  // Margherita Pizza - Cheese Bacon
		{MenuID: menus[16].ID, MenuOptionID: menuOptions[3].ID},  // BBQ Ribs - Pork
		{MenuID: menus[16].ID, MenuOptionID: menuOptions[4].ID},  // BBQ Ribs - Chicken
		{MenuID: menus[20].ID, MenuOptionID: menuOptions[6].ID},  // Vegan Burger - Tofu
		{MenuID: menus[17].ID, MenuOptionID: menuOptions[8].ID},  // Spring Rolls - Medium Spice
		{MenuID: menus[17].ID, MenuOptionID: menuOptions[9].ID},  // Spring Rolls - Hot Spice
	}
	for i := range menuItemOptions {
		db.FirstOrCreate(&menuItemOptions[i], entity.MenuItemOptions{MenuID: menuItemOptions[i].MenuID, MenuOptionID: menuItemOptions[i].MenuOptionID})
	}

	// สร้างตัวอย่าง Order
	order1 := entity.Orders{
		OrderDate:   time.Now(),
		TotalAmount: 540.00, // ตัวอย่างจำนวนเงินรวม
		StatusID: 4,
		GuestID:  1,      // ตัวอย่าง Customer ID
	}
	db.FirstOrCreate(&order1)
	
	// สร้างตัวอย่าง OrderDetail
	orderDetails := []entity.OrderDetails{
		{OrderID: order1.ID, MenuID: menus[0].ID, Quantity: 1, Amount: 40.00},  // Orange Juice
		{OrderID: order1.ID, MenuID: menus[1].ID, Quantity: 2, Amount: 500.00}, // Steak
	}
	for i := range orderDetails {
		db.FirstOrCreate(&orderDetails[i], entity.OrderDetails{OrderID: orderDetails[i].OrderID, MenuID: orderDetails[i].MenuID})
	}
	
	orderDetailsMenuOption := []entity.OrderDetailMenuOptions{
		{OrderDetailID: orderDetails[0].ID, MenuItemOptionID: menuItemOptions[0].ID}, 
		{OrderDetailID: orderDetails[1].ID, MenuItemOptionID: menuItemOptions[1].ID}, // Steak - Beef
		{OrderDetailID: orderDetails[1].ID, MenuItemOptionID: menuItemOptions[2].ID}, // Steak - Beef
	}
	for i := range orderDetailsMenuOption {
		db.FirstOrCreate(&orderDetailsMenuOption[i], entity.OrderDetailMenuOptions{
			OrderDetailID:   orderDetailsMenuOption[i].OrderDetailID,
			MenuItemOptionID: orderDetailsMenuOption[i].MenuItemOptionID,
		})
	}
	
	fmt.Println("FoodService data has been added to the database.")
}