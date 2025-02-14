package harbors

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"team03/se67/config"
	"team03/se67/entity"
)

type CreateHarborInput struct {
	HarborName string `json:"harbor_name" binding:"required"`
	Country    string `json:"country" binding:"required"`
}

 func CreateHarbor(c *gin.Context) {
	var input CreateHarborInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	harbor := entity.Harbors{
		HarborName: input.HarborName,
		Country:    input.Country,
	}

	if err := db.Create(&harbor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Harbor"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Harbor created successfully", "data": harbor})
}

