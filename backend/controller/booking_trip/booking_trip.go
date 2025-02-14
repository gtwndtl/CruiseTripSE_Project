package booking_trip

import (
	"fmt"
	"net/http"
	"time"

	"team03/se67/config"
	"team03/se67/entity"

	"github.com/gin-gonic/gin"
)

// GET /bookingtrips
func ListBookingTrips(c *gin.Context) {
	var bookingtrips []entity.BookingTrip

	db := config.DB()
	results := db.Preload("Customer").Preload("CruiseTrip").Find(&bookingtrips)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, bookingtrips)
}

// GET /bookingtrip/:id
func GetBookingTripByID(c *gin.Context) {
	ID := c.Param("id")
	var bookingtrip entity.BookingTrip

	db := config.DB()
	results := db.Preload("Customer").Preload("CruiseTrip").First(&bookingtrip, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if bookingtrip.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, bookingtrip)
}

// // GET /bookingtrips/:id
// func GetBookingTripByGuestID(c *gin.Context) {
// 	ID := c.Param("id")
// 	var bookingtrips []entity.BookingTrip

// 	db := config.DB()
// 	results := db.Preload("Guest").Find(&bookingtrips, "guest_id=?", ID)
// 	if results.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, bookingtrips)
// }

// GET /bookingtrips/:id
func GetBookingTripByCustomerID(c *gin.Context) {
	ID := c.Param("id")
	var bookingtrips []entity.BookingTrip

	db := config.DB()
	results := db.Preload("Customer").Find(&bookingtrips, "customer_id=?", ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, bookingtrips)
}

// POST /bookingtrip
func CreateBookingTrip(c *gin.Context) {
	var bookingtrip entity.BookingTrip

	// Bind ข้อมูลจาก JSON
	if err := c.ShouldBindJSON(&bookingtrip); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	fmt.Println("BookingTrip Struct:", bookingtrip)


	// ค้นหาข้อมูลลูกค้าโดยใช้ GuestID
	// var guest entity.Guest
	// db.First(&guest, bookingtrip.GuestID)
	// if guest.ID == 0 {
	// 	c.JSON(http.StatusNotFound, gin.H{"error": "Guest not found"})
	// 	return
	// }

	//ค้นหาข้อมูลลูกค้าโดยใช้ CustomerID
	var customer entity.Customers
	db.First(&customer, bookingtrip.CustomerID)
	if customer.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	// ค้นหาข้อมูล CruiseTrip โดยใช้ CruiseTripID
	var cruisetrip entity.CruiseTrip
	db.First(&cruisetrip, bookingtrip.CruiseTripID)
	if cruisetrip.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cruise trip not found"})
		return
	}

	//ค้นหา bookingstatus ด้วย id
	var status entity.Stats
	db.First(&status, bookingtrip.StatusID)
	if status.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "status not found"})
		return
	}

	// ตั้งค่า BookingDate เป็นเวลาปัจจุบัน
	bookingtrip.BookingDate = time.Now()

	// สร้าง BookingTrip ใหม่
	bt := entity.BookingTrip{
		BookingDate:   time.Now(),
		NumberOfGuest: bookingtrip.NumberOfGuest,
		TotalPrice: bookingtrip.TotalPrice,
		CustomerID:    bookingtrip.CustomerID,
		CruiseTripID:  bookingtrip.CruiseTripID,
		StatusID: bookingtrip.StatusID,
	}

	// บันทึกข้อมูล BookingTrip
	if err := db.Create(&bt).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Create success", "data": bt})
}

// PATCH /bookingtrip/:id
func UpdateBookingTripByID(c *gin.Context) {
	var bookingtrip entity.BookingTrip

	BookingTripID := c.Param("id")

	db := config.DB()
	result := db.First(&bookingtrip, BookingTripID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	// Bind ข้อมูลจาก JSON เพื่ออัปเดต BookingTrip
	if err := c.ShouldBindJSON(&bookingtrip); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกข้อมูลการอัปเดต
	result = db.Save(&bookingtrip)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}
