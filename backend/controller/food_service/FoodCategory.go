package food_service

import (
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"
	"github.com/gin-gonic/gin"
)

func GetAllFoodCategories(c *gin.Context) {
	var categories []entity.FoodCategories
	db := config.DB()

	if err := db.Find(&categories).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

func GetFoodCategory(c *gin.Context) {
	ID := c.Param("id")
	var category entity.FoodCategories
	db := config.DB()

	if err := db.First(&category, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, category)
}

func CreateFoodCategory(c *gin.Context) {
	var category entity.FoodCategories
	db := config.DB()

	// Bind JSON request body to category struct
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// Save the new category to the database
	if err := db.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create FoodCategory"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "FoodCategory created successfully", "data": category})
}


func UpdateFoodCategory(c *gin.Context) {
	var category entity.FoodCategories
	db := config.DB()

	if err := db.First(&category, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db.Save(&category)
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DeleteFoodCategory(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.FoodCategories{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
