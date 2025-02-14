package booking_cabin

import (
	"net/http"

	"team03/se67/config"
	"team03/se67/entity"

	"github.com/gin-gonic/gin"
)

// GET /cabins
func ListCabins(c *gin.Context){
	var cabins []entity.Cabin

	db := config.DB()
	results := db.Preload("CabinType").Find(&cabins)
	if results.Error != nil{
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, cabins)
}

// GET /cabin/:id
func GetCabinByID(c *gin.Context){
	ID := c.Param("id")
	var cabin entity.Cabin

	db := config.DB()
	results := db.Preload("CabinType").First(&cabin, ID)
	if results.Error != nil{
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if cabin.ID == 0{
		c.JSON(http.StatusNoContent, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, cabin)
}

// GET /cabins/:id
func GetCabinByTypeID(c *gin.Context) {
	ID := c.Param("id")
	var cabins []entity.Cabin

	db := config.DB()
	results := db.Preload("CabinType").Where("cabin_type_id = ? AND cabin_status_id = ?", ID, 1).Find(&cabins)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, cabins)
}

// PATCH /cabin/:id
func UpdateCabinByID(c *gin.Context){
	var cabin entity.Cabin

	CabinID := c.Param("id")

	db := config.DB()
	result := db.First(&cabin, CabinID)
	if result.Error != nil{
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&cabin); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&cabin)
	if result.Error != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}