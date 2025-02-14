package payment

import (
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAllTripPayments(c *gin.Context) {
	var tripPayments []entity.TripPayment
	db := config.DB()

	if err := db.Preload("BookingCabin").Preload("Promotion").Find(&tripPayments).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tripPayments)
}

func GetTripPayment(c *gin.Context) {
	ID := c.Param("id")
	var tripPayment entity.TripPayment
	db := config.DB()

	if err := db.Preload("BookingCabin").Preload("Promotion").First(&tripPayment, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tripPayment)
}

func CreateTripPayment(c *gin.Context) {
	var tripPayment entity.TripPayment
	if err := c.ShouldBindJSON(&tripPayment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db := config.DB()
	if err := db.Create(&tripPayment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, tripPayment)
}

func UpdateTripPayment(c *gin.Context) {
	var tripPayment entity.TripPayment
	db := config.DB()

	if err := db.First(&tripPayment, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&tripPayment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db.Save(&tripPayment)
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DeleteTripPayment(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.TripPayment{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

func GetTripPaymentIDForFoodPayment(c *gin.Context) {
	var tripPayment entity.TripPayment
	var bookingCabin entity.BookingCabin
	db := config.DB()

	guestID := c.Param("id")
	if guestID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Guest ID is required"})
		return
	}

	// Find BookingCabin related to the guest and within the trip duration
	if err := db.Joins("JOIN booking_trips ON booking_trips.id = booking_cabins.booking_trip_id").
		Joins("JOIN guests ON guests.booking_trip_id = booking_trips.id").
		Where("guests.id = ? AND booking_cabins.check_in <= ? AND booking_cabins.check_out >= ?",
			guestID, time.Now(), time.Now()).
		First(&bookingCabin).Error; err != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": "No active trip found for the guest"})
		return
	}

	// Find TripPayment related to the BookingCabin with payment status "Paid"
	if err := db.Where("booking_cabin_id = ? AND payment_status = ?", bookingCabin.ID, "succeeded").
		First(&tripPayment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No valid trip payment found for the guest's current trip"})
		return
	}

	c.JSON(http.StatusOK, tripPayment)
}
