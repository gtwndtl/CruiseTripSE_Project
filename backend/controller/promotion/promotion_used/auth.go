package promotion_used

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"
)

// addPromotionUsed represents the structure of the promotion used data in the request body
type addPromotionUsed struct {
	PromotionID          uint `json:"promotion_id"`
	CustomerID           uint `json:"customer_id"`
	GuestID              uint `json:"guest_id"`
	FoodServicePaymentID uint `json:"food_service_payment_id"`
	TripPaymentID        uint `json:"trip_payment_id"`
}

// AddPromotionUsed handles the addition of a new promotion used record
func AddPromotionUsed(c *gin.Context) {
	var payload addPromotionUsed

	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// Create new promotion used record
	newPromotionUsed := entity.Promotion_Used{
		PromotionID:          payload.PromotionID,
		GuestID:              payload.GuestID,
		CustomerID:           payload.CustomerID,
		FoodServicePaymentID: payload.FoodServicePaymentID,
		TripPaymentID:        payload.TripPaymentID,
	}

	// Save the promotion used record to the database
	if err := db.Create(&newPromotionUsed).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Return the promotion used ID in the response
	c.JSON(http.StatusCreated, gin.H{
		"status":            201,
		"message":           "Promotion used added successfully",
		"promotion_used_id": newPromotionUsed.ID,
	})
}
