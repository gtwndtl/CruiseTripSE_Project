package ship

import (
	"net/http"

	"team03/se67/entity"
	"team03/se67/config"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /ships
func ListShips(c *gin.Context) {
	var ships []entity.Ship

	db := config.DB()

	db.Find(&ships)

	c.JSON(http.StatusOK, &ships)

}

// POST /ship
func CreateShip(c *gin.Context) {
	var ship entity.Ship

	// bind เข้าตัวแปร ship
	if err := c.ShouldBindJSON(&ship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()


	// สร้าง Ship
	sh := entity.Ship{
		Name: ship.Name,
	}
	// บันทึก
	if err := db.Create(&sh).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": sh})
}

// GET /ship/:id
func GetShip(c *gin.Context) {
	ID := c.Param("id")
	var ship entity.Ship

	db := config.DB()
	results := db.First(&ship, ID)
	if results.Error != nil {
        if results.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Ship not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }
	if ship.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, ship)
}

// DELETE /ship/:id
func DeleteShip(c *gin.Context) {
	

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM ships WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /ships
func UpdateShip(c *gin.Context) {
	var ship entity.Ship

	ShipID := c.Param("id")

	db := config.DB()
	result := db.First(&ship, ShipID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&ship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&ship)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}