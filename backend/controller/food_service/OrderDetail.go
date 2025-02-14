package food_service

import (
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"

	"github.com/gin-gonic/gin"
)

func GetAllOrderDetails(c *gin.Context) {
	var orderDetails []entity.OrderDetails
	db := config.DB()

	if err := db.Preload("Menu").Preload("Order").Find(&orderDetails).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orderDetails)
}

func GetOrderDetail(c *gin.Context) {
	ID := c.Param("id")
	var orderDetail entity.OrderDetails
	db := config.DB()

	if err := db.Preload("Menu").Preload("Order").First(&orderDetail, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orderDetail)
}

func CreateOrderDetail(c *gin.Context) {
	var orderDetail entity.OrderDetails
	db := config.DB()

	// Bind JSON request body to orderDetail struct
	if err := c.ShouldBindJSON(&orderDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// Save the new orderDetail to the database
	if err := db.Create(&orderDetail).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create OrderDetail"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "OrderDetail created successfully", "data": orderDetail})
}


func UpdateOrderDetail(c *gin.Context) {
	var orderDetail entity.OrderDetails
	db := config.DB()

	if err := db.First(&orderDetail, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&orderDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db.Save(&orderDetail)
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DeleteOrderDetail(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ลบข้อมูลจากตาราง OrderDetailMenuOption ที่มี OrderDetailID ตรงกับ id
	if err := db.Where("order_detail_id = ?", id).Delete(&entity.OrderDetailMenuOptions{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete related menu options"})
		return
	}

	// ลบข้อมูลจากตาราง OrderDetail
	if tx := db.Delete(&entity.OrderDetails{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
