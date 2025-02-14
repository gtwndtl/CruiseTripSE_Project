package food_service

import (
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"

	"github.com/gin-gonic/gin"
)

// GetAllOrderDetailMenuOptions retrieves all OrderDetailMenuOption entries
func GetAllOrderDetailMenuOptions(c *gin.Context) {
	var orderDetailMenuOptions []entity.OrderDetailMenuOptions
	db := config.DB()

	if err := db.Preload("OrderDetail").Preload("MenuItemOption").Find(&orderDetailMenuOptions).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orderDetailMenuOptions)
}

// GetOrderDetailMenuOption retrieves a specific OrderDetailMenuOption by ID
func GetOrderDetailMenuOption(c *gin.Context) {
	ID := c.Param("id")
	var orderDetailMenuOption entity.OrderDetailMenuOptions
	db := config.DB()

	if err := db.Preload("OrderDetail").Preload("MenuItemOption").First(&orderDetailMenuOption, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "OrderDetailMenuOption not found"})
		return
	}

	c.JSON(http.StatusOK, orderDetailMenuOption)
}

// CreateOrderDetailMenuOption creates a new OrderDetailMenuOption entry
func CreateOrderDetailMenuOption(c *gin.Context) {
	var orderDetailMenuOption entity.OrderDetailMenuOptions
	db := config.DB()

	if err := c.ShouldBindJSON(&orderDetailMenuOption); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	if err := db.Create(&orderDetailMenuOption).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create OrderDetailMenuOption"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "OrderDetailMenuOption created successfully", "data": orderDetailMenuOption})
}

// UpdateOrderDetailMenuOption updates an existing OrderDetailMenuOption entry
func UpdateOrderDetailMenuOption(c *gin.Context) {
	ID := c.Param("id")
	var orderDetailMenuOption entity.OrderDetailMenuOptions
	db := config.DB()

	if err := db.First(&orderDetailMenuOption, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "OrderDetailMenuOption not found"})
		return
	}

	if err := c.ShouldBindJSON(&orderDetailMenuOption); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	if err := db.Save(&orderDetailMenuOption).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update OrderDetailMenuOption"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OrderDetailMenuOption updated successfully"})
}

// DeleteOrderDetailMenuOption deletes an OrderDetailMenuOption entry
func DeleteOrderDetailMenuOption(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.OrderDetailMenuOptions{}, ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OrderDetailMenuOption not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OrderDetailMenuOption deleted successfully"})
}
