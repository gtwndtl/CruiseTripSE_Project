package booking_cabin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"team03/se67/config"
	"team03/se67/entity"
)

// GET /cabintypes
func ListCabinTypes(c *gin.Context){
	var cabintypes []entity.CabinType

	db := config.DB()
	results := db.Find(&cabintypes)
	if results.Error != nil{
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, cabintypes)
}


// GET /cabintype/:id
func GetCabinTypeByID(c *gin.Context){
	ID := c.Param("id")
	var cabintype entity.CabinType

	db := config.DB()
	results := db.First(&cabintype, ID)
	if results.Error != nil{
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if cabintype.ID == 0{
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, cabintype)
}