package food_service

import (
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"
	"github.com/gin-gonic/gin"
)

// GetAllMenuItemOptions - ดึงข้อมูล MenuItemOption ทั้งหมด
func GetAllMenuItemOptions(c *gin.Context) {
	var menuItemOptions []entity.MenuItemOptions
	db := config.DB()

	if err := db.Preload("Menu").Preload("MenuOption").Find(&menuItemOptions).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, menuItemOptions)
}

func GetMenuItemOption(c *gin.Context) {
	ID := c.Param("id")
	var menuItemOptions []entity.MenuItemOptions
	db := config.DB()

	if err := db.Preload("Menu").Preload("MenuOption").Find(&menuItemOptions, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, menuItemOptions)
}

// CreateMenuItemOption - สร้าง MenuItemOption ใหม่
func CreateMenuItemOption(c *gin.Context) {
	var menuItemOption entity.MenuItemOptions
	if err := c.ShouldBindJSON(&menuItemOption); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db := config.DB()
	if err := db.Create(&menuItemOption).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, menuItemOption)
}

// DeleteMenuItemOption - ลบ MenuItemOption
func DeleteMenuItemOption(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.MenuItemOptions{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
