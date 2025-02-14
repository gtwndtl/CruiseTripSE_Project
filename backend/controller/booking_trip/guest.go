package booking_trip

import (
	"net/http"

	"team03/se67/config"
	"team03/se67/entity"

	"github.com/gin-gonic/gin"

)

// GET /guests
func ListGuests(c *gin.Context){
	var guests []entity.Guest

	db := config.DB()
	results := db.Preload("Gender").Find(&guests)
	if results.Error != nil{
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, guests)
}

// GET /guest/:id
func GetGuestByID(c *gin.Context){
	ID := c.Param("id")
	var guest entity.Guest

	db := config.DB()
	results := db.Preload("Gender").First(&guest, ID)
	if results.Error != nil{
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if guest.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, guest)
}

func CreateGuest(c *gin.Context){
	var guest entity.Guest

	//bind เข้าตัวแปร bookingtrip
	if err := c.ShouldBindJSON(&guest); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"bind json error": err.Error()})
		return
	}

	db := config.DB()

	//ค้นหา gender ด้วย id
	var gender entity.Genders
	db.First(&gender, guest.GenderID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gender not found"})
		return
	}

	//ค้นหา bookingtrip ด้วย id
	var bookingtrip entity.BookingTrip
	db.First(&bookingtrip, guest.BookingTripID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "BookingTrip not found"})
		return
	}

	g := entity.Guest{
		FirstName: guest.FirstName,
		LastName: guest.LastName,
		Email: guest.Email,
		Phone: guest.Phone,
		BirthDay: guest.BirthDay,
		Address: guest.Address,
		Age: guest.Age,
		GenderID: guest.GenderID,
		BookingTripID: guest.BookingTripID,
		RoleID: guest.RoleID,
	}

	//บันทึก
	if err := db.Create(&g).Error; err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Create success", "data": g})
}




// PATCH /guest
func UpdateGuestByID(c *gin.Context) {
	var guest entity.Guest

	GuestID := c.Param("id")

	db := config.DB()
	result := db.First(&guest, GuestID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&guest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&guest)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

