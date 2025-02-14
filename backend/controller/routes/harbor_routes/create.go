package harbor_routes

import (
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"
	"github.com/gin-gonic/gin"
)

type CreateHarborRoutesInput struct {
	RouteID  uint   `json:"route_id" binding:"required"`  // เส้นทางเดียวกัน
	Harbors  []uint `json:"harbors" binding:"required"`   // รายการ ID ของท่าเรือ
}

func CreateHarborRoute(c *gin.Context) {
	var payload CreateHarborRoutesInput

	// ตรวจสอบ Payload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ตรวจสอบว่ามีท่าเรือใน payload หรือไม่
	if len(payload.Harbors) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No harbors provided"})
		return
	}

	// สร้างรายการ Harbor_Route
	var harborRoutes []entity.Harbor_Route
	for i, harborID := range payload.Harbors {
		harborRoutes = append(harborRoutes, entity.Harbor_Route{
			RouteID:  payload.RouteID,
			HarborID: harborID,
			Level:    uint8(i + 1), // Level เริ่มจาก 1 และเรียงตามลำดับ
		})
	}

	// บันทึกข้อมูลลงฐานข้อมูล
	if err := db.Create(&harborRoutes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Harbor Routes"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Harbor Routes created successfully",
		"data":    harborRoutes,
	})
}
