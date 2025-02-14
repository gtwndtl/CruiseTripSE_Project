package payment

import (
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"
	// "team03/se67/entity/food_service"
	"github.com/gin-gonic/gin"
)

func GetAllFoodServicePayments(c *gin.Context) {
	var payments []entity.FoodServicePayment
	db := config.DB()

	if err := db.Preload("Order").Preload("TripPayment").Preload("Promotion").Find(&payments).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payments)
}

func GetFoodServicePayment(c *gin.Context) {
	ID := c.Param("id")
	var foodPayment entity.FoodServicePayment
	db := config.DB()

	if err := db.Preload("Order").Preload("TripPayment").Preload("Promotion").First(&foodPayment, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, foodPayment)
}

func CreateFoodServicePayment(c *gin.Context) {
	var foodPayment entity.FoodServicePayment
	if err := c.ShouldBindJSON(&foodPayment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db := config.DB()
	if err := db.Create(&foodPayment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, foodPayment)
}

func UpdateFoodServicePayment(c *gin.Context) {
	var foodPayment entity.FoodServicePayment
	db := config.DB()

	if err := db.First(&foodPayment, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&foodPayment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db.Save(&foodPayment)
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DeleteFoodServicePayment(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.FoodServicePayment{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
