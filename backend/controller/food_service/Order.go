package food_service

import (
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"

	"github.com/gin-gonic/gin"
)

func GetAllOrders(c *gin.Context) {
	var orders []entity.Orders
	db := config.DB()

	if err := db.Preload("Guest").Find(&orders).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func GetOrder(c *gin.Context) {
	ID := c.Param("id")
	var order entity.Orders
	db := config.DB()

	if err := db.Preload("Guest").First(&order, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, order)
}

func CreateOrder(c *gin.Context) {
	var order entity.Orders
	db := config.DB()

	// Bind JSON request body to order struct
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// Save the new order to the database
	if err := db.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Order"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully", "data": order})
}


func UpdateOrder(c *gin.Context) {
	var order entity.Orders
	db := config.DB()

	if err := db.First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db.Save(&order)
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DeleteOrder(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.Orders{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
