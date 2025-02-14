package route

import (
	"net/http"
    
	"github.com/gin-gonic/gin"
	"team03/se67/config"
	"team03/se67/entity"
)

type CreateRouteInput struct {
	RouteName string `json:"route_name"`
	WeatherID uint   `json:"weather_id"`
}

func CreateRoute(c *gin.Context) {
	var payload CreateRouteInput
	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	route := entity.Routes{
		RouteName: payload.RouteName,
		WeatherID: payload.WeatherID,
	}

	// Save the route to the database

	if err := db.Create(&route).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Route"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Route created successfully", "data": route})
}
