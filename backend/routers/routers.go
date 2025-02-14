package routers

import (
	"net/http"
	"team03/se67/controller/booking_activity"
	"team03/se67/controller/booking_cabin"
	"team03/se67/controller/booking_trip"
	"team03/se67/controller/cruise_trip"
	"team03/se67/controller/customers"
	"team03/se67/controller/food_service"
	"team03/se67/controller/genders"
	"team03/se67/controller/payment"
	"team03/se67/controller/ship"

	"team03/se67/controller/employees/employee"
	"team03/se67/controller/employees/roles"
	"team03/se67/controller/employees/status"

	"team03/se67/controller/routes/harbor_routes"
	"team03/se67/controller/routes/harbors"
	"team03/se67/controller/routes/route"
	"team03/se67/controller/routes/weathers"

	"team03/se67/controller/promotion/discount_type"
	"team03/se67/controller/promotion/promotion"
	"team03/se67/controller/promotion/promotion_status"
	"team03/se67/controller/promotion/promotion_type"
	"team03/se67/controller/promotion/promotion_used"

	"team03/se67/controller/review/review"
	"team03/se67/controller/review/review_type"

	"team03/se67/middlewares"

	"github.com/gin-gonic/gin"
)

const PORT = "8000"

// SetupRouter initializes the router
func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(middlewares.CORSMiddleware())

	// Public Routes
	setupAuthRoutes(r)
	setupGuestAuthRoutes(r)

	// Private Routes (Require Authorization)
	private := r.Group("/")
	private.Use(middlewares.Authorizes())

	setupUserRoutes(private)
	setupPaymentRoutes(private)
	setupFoodServiceRoutes(private)
	setupBookingCabinRoutes(private)
	setupBookingTripRoutes(private)
	setupCabinTypeRoutes(private)
	setupGuestRoutes(private)
	
	setupCruiseTripRoute(private)
	setupShipRoute(private)

	setupRoutesRoutes(private)
	setupEmployeeRoutes(private)

	setupPromotionRoutes(private)
	setupReviewRoutes(private)

	setupBookActivityRoute(private)
	setupActivityRoute(private)


	// Public Route for Genders
	r.GET("/genders", genders.GetAll)

	// Root Route
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	return r
}

// Function to setup Authentication routes
func setupAuthRoutes(r *gin.Engine) {
	r.POST("/signup", customers.SignUp)
	r.POST("/signin", customers.SignIn)
	r.POST("/signupEm", employee.SignUpEmployee)
}

// Function to setup guest Authentication routes
func setupGuestAuthRoutes(r *gin.Engine) {
	r.POST("/guest-signin", booking_trip.GuestSignIn)
}

// Function to setup User routes
func setupUserRoutes(r *gin.RouterGroup) {
	r.GET("/users", customers.GetAll)
	r.GET("/user/:id", customers.Get)
	r.PUT("/user/:id", customers.Update)
	r.DELETE("/user/:id", customers.Delete)
}

func setupEmployeeRoutes(r *gin.RouterGroup) {
	r.PUT("/employee/:id", employee.Update)
	r.GET("/employees", employee.GetAll)
	r.GET("/employee/:id", employee.Get)
	r.DELETE("/employee/:id", employee.Delete)

	r.GET("/roles", roles.GetAll)
	r.GET("/stats", status.GetAll)
}
func setupRoutesRoutes(r *gin.RouterGroup) {
	r.POST("/routeCreate", route.CreateRoute)
	r.PUT("/route/:id", route.Update)
	r.GET("/routes", route.GetAll)
	r.GET("/route/:id", route.Get)
	r.DELETE("/route/:id", route.Delete)

	r.POST("/harborCreate", harbors.CreateHarbor)
	r.PUT("/harbor/:id", harbors.Update)
	r.GET("/harbors", harbors.GetAll)
	r.GET("/harbor/:id", harbors.Get)
	r.DELETE("/harbor/:id", harbors.Delete)

	r.POST("/harbor_rCreate", harbor_routes.CreateHarborRoute)
	r.PUT("/harbor_r/:id", harbor_routes.Update)
	r.GET("/harbor_rs", harbor_routes.GetAll)
	r.GET("/harbor_r/:id", harbor_routes.Get)
	r.DELETE("/harbor_r/:id", harbor_routes.Delete)

	r.GET("/weather", weathers.GetAll)
}

// Function to setup Payment routes
func setupPaymentRoutes(r *gin.RouterGroup) {
	r.GET("/food-service-payments", payment.GetAllFoodServicePayments)
	r.GET("/food-service-payment/:id", payment.GetFoodServicePayment)
	r.POST("/food-service-payment", payment.CreateFoodServicePayment)
	r.PUT("/food-service-payment/:id", payment.UpdateFoodServicePayment)
	r.DELETE("/food-service-payment/:id", payment.DeleteFoodServicePayment)

	r.GET("/trip-payments", payment.GetAllTripPayments)
	r.GET("/trip-payment/:id", payment.GetTripPayment)
	r.POST("/trip-payment", payment.CreateTripPayment)
	r.PUT("/trip-payment/:id", payment.UpdateTripPayment)
	r.DELETE("/trip-payment/:id", payment.DeleteTripPayment)

	r.GET("/trip-paymentID-for-food-payment/:id", payment.GetTripPaymentIDForFoodPayment)
}

// Function to setup Food Service routes
func setupFoodServiceRoutes(r *gin.RouterGroup) {
	r.GET("/food-categories", food_service.GetAllFoodCategories)
	r.GET("/food-category/:id", food_service.GetFoodCategory)
	r.POST("/food-category", food_service.CreateFoodCategory)
	r.PUT("/food-category/:id", food_service.UpdateFoodCategory)
	r.DELETE("/food-category/:id", food_service.DeleteFoodCategory)

	r.GET("/menus", food_service.GetAllMenus)
	r.GET("/menu/:id", food_service.GetMenu)
	r.POST("/menu", food_service.CreateMenu)
	r.PUT("/menu/:id", food_service.UpdateMenu)
	r.DELETE("/menu/:id", food_service.DeleteMenu)

	r.GET("/order-detail-menu-options", food_service.GetAllOrderDetailMenuOptions)
	r.GET("/order-detail-menu-option/:id", food_service.GetOrderDetailMenuOption)
	r.POST("/order-detail-menu-option", food_service.CreateOrderDetailMenuOption)
	r.PUT("/order-detail-menu-option/:id", food_service.UpdateOrderDetailMenuOption)
	r.DELETE("/order-detail-menu-option/:id", food_service.DeleteOrderDetailMenuOption)

	r.GET("/order-details", food_service.GetAllOrderDetails)
	r.GET("/order-detail/:id", food_service.GetOrderDetail)
	r.POST("/order-detail", food_service.CreateOrderDetail)
	r.PUT("/order-detail/:id", food_service.UpdateOrderDetail)
	r.DELETE("/order-detail/:id", food_service.DeleteOrderDetail)

	r.GET("/orders", food_service.GetAllOrders)
	r.GET("/order/:id", food_service.GetOrder)
	r.POST("/order", food_service.CreateOrder)
	r.PUT("/order/:id", food_service.UpdateOrder)
	r.DELETE("/order/:id", food_service.DeleteOrder)

	r.GET("/menu-item-options", food_service.GetAllMenuItemOptions)
	r.GET("/menu-item-option/:id", food_service.GetMenuItemOption)
	r.POST("/menu-item-option", food_service.CreateMenuItemOption)
	r.DELETE("/menu-item-option/:id", food_service.DeleteMenuItemOption)

	r.GET("/menu-options", food_service.GetAllMenuOptions)
	r.POST("/menu-options", food_service.CreateMenuOption)
	r.PUT("/menu-options/:id", food_service.UpdateMenuOption)

	r.GET("/orders/pending/:id", food_service.GetPendingOrderByGuestID)
	r.POST("/add-item-to-order", food_service.AddItemToOrder)
}

// Function to setup Booking Trip routes
func setupBookingTripRoutes(r *gin.RouterGroup) {
	r.GET("/bookingtrips", booking_trip.ListBookingTrips)
	r.GET("/bookingtrip/:id", booking_trip.GetBookingTripByID)
	r.GET("bookingtrips/:id", booking_trip.GetBookingTripByCustomerID)
	r.POST("/bookingtrip", booking_trip.CreateBookingTrip)
	r.PATCH("/bookingtrip/:id", booking_trip.UpdateBookingTripByID)
}

// Function to setup Guest Trip routes
func setupGuestRoutes(r *gin.RouterGroup) {
	r.GET("/guests", booking_trip.ListGuests)
	r.GET("/guest/:id", booking_trip.GetGuestByID)
	r.POST("/guests", booking_trip.CreateGuest)
	r.PATCH("/guest/:id", booking_trip.UpdateGuestByID)
}

// Function to set Booking Cabin routes
func setupBookingCabinRoutes(r *gin.RouterGroup) {
	r.GET("/bookngcabins", booking_cabin.ListBookingCabins)
	r.GET("/bookingcabin/:id", booking_cabin.GetBookingCabinByID)
	// r.GET("/bookingcabins/:id", booking_cabin.GetBookingCabinByCustomerID)
	r.POST("/bookingcabin", booking_cabin.CreateBookingCabin)
	r.PATCH("/bookingcabin/:id", booking_cabin.UpdateBookingCabinByID)
}

func setupCabinTypeRoutes(r *gin.RouterGroup) {
	r.GET("/cabintypes", booking_cabin.ListCabinTypes)
	r.GET("/cabintype/:id", booking_cabin.GetCabinTypeByID)
}

func setupCruiseTripRoute(r *gin.RouterGroup) {
	r.GET("/cruisetrips", cruise_trip.ListCruiseTrips)
	r.GET("/cruisetrip/:id", cruise_trip.GetCruiseTrip)
	r.POST("/cruisetrips", cruise_trip.CreateCruiseTrip)
	r.PATCH("/cruisetrips", cruise_trip.UpdateCruiseTrip)
	r.DELETE("/cruisetrips/:id", cruise_trip.DeleteCruiseTrip)
	r.GET("/allcruisetrips", cruise_trip.GetAll)
}

func setupShipRoute(r *gin.RouterGroup) {
	r.GET("/ships", ship.ListShips)
	r.GET("/ship/:id", ship.GetShip)
	r.POST("/ships", ship.CreateShip)
	r.PATCH("/ships", ship.UpdateShip)
	r.DELETE("/ships/:id", ship.DeleteShip)
}

func setupBookActivityRoute(r *gin.RouterGroup) {
	r.GET("/bookactivities", booking_activity.ListBookActivitys)
	r.GET("/bookactivity/:id", booking_activity.GetBookActivity)
	r.POST("/bookactivities", booking_activity.CreateBookActivity)
	r.PATCH("/bookactivities", booking_activity.UpdateBookActivity)
	r.DELETE("/bookactivities/:id", booking_activity.DeleteBookActivity)
	r.GET("/bookActivity/byCustomerId/:id", booking_activity.GetAllBookActivityByCustomerId)
}

func setupActivityRoute(r *gin.RouterGroup) {
	r.GET("/activities", booking_activity.ListActivitys)
	r.GET("/activity/:id", booking_activity.GetActivity)
	r.POST("/activities", booking_activity.CreateActivity)
	r.PATCH("/activities", booking_activity.UpdateActivity)
	r.DELETE("/activities/:id", booking_activity.DeleteActivity)
}


// Function to setup Promotion
func setupPromotionRoutes(r *gin.RouterGroup) {
	//Promotion
	r.POST("/promotion", promotion.AddPromotion)
	r.PUT("/promotion/:id", promotion.Update)
	r.GET("/promotions", promotion.GetAll)
	r.GET("/promotion/:id", promotion.Get)
	r.DELETE("/promotion/:id", promotion.Delete)

	//PromotionUsed
	r.POST("/promotionused", promotion_used.AddPromotionUsed)
	r.PUT("/promotionused/:id", promotion_used.Update)
	r.GET("/promotionuseds", promotion_used.GetAll)
	r.GET("/promotionused/:id", promotion_used.Get)
	r.DELETE("/promotionused/:id", promotion_used.Delete)

	//PromotionType
	r.GET("/types", promotion_type.GetAll)
	r.GET("/type/:id", promotion_type.Get)

	//PromotionStatus
	r.GET("/status", promotion_status.GetAll)

	//DiscountType
	r.GET("/discount_type", discount_type.GetAll)
	r.GET("/discount_type/:id", discount_type.Get)

}

// Function to setup Booking Trip routes
func setupReviewRoutes(r *gin.RouterGroup) {
	//Review
	r.POST("/review", review.AddReview)
	r.PUT("/review/:id", review.Update)
	r.GET("/reviews", review.GetAll)
	r.GET("/review/:id", review.Get)
	r.DELETE("/review/:id", review.Delete)


	//ReviewType
	r.GET("/reviewtypes", review_type.GetAll)
	r.GET("/reviewtype/:id", review_type.Get)
}
