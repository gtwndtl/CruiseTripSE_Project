package food_service

import (
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"
	"github.com/gin-gonic/gin"
)

// GetAllMenuOptions - ดึงข้อมูล MenuOption ทั้งหมด
func GetAllMenuOptions(c *gin.Context) {
	var menuOptions []entity.MenuOptions
	db := config.DB()

	if err := db.Find(&menuOptions).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, menuOptions)
}

// CreateMenuOption - สร้าง MenuOption ใหม่
func CreateMenuOption(c *gin.Context) {
	var menuOption entity.MenuOptions
	if err := c.ShouldBindJSON(&menuOption); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db := config.DB()
	if err := db.Create(&menuOption).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, menuOption)
}

// UpdateMenuOption - อัปเดต MenuOption
func UpdateMenuOption(c *gin.Context) {
	var menuOption entity.MenuOptions
	db := config.DB()

	if err := db.First(&menuOption, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&menuOption); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db.Save(&menuOption)
	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}
