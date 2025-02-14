package booking_activity


import (
	"net/http"

	"team03/se67/config"
	"team03/se67/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /activitys
func ListActivitys(c *gin.Context) {
	var activitys []entity.Activity

	db := config.DB()

	db.Find(&activitys)

	c.JSON(http.StatusOK, &activitys)

}

// POST /activity
func CreateActivity(c *gin.Context) {
	var activity entity.Activity

	// bind เข้าตัวแปร ship
	if err := c.ShouldBindJSON(&activity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()


	// สร้าง Ship
	sh := entity.Activity{
		Name: activity.Name,
		ActivityImg: activity.ActivityImg,
	}
	// บันทึก
	if err := db.Create(&sh).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": sh})
}

// GET /activity/:id
func GetActivity(c *gin.Context) {
	ID := c.Param("id")
	var activity entity.Activity

	db := config.DB()
	results := db.First(&activity, ID)
	if results.Error != nil {
        if results.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }
	if activity.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, activity)
}

// DELETE /activity/:id
func DeleteActivity(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM activities WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /ships
func UpdateActivity(c *gin.Context) {
	var activity entity.Activity

	ActivityID := c.Param("id")

	db := config.DB()
	result := db.First(&activity, ActivityID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&activity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&activity)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}