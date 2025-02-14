package booking_activity

import (
	"log"
	"net/http"

	"team03/se67/config"
	"team03/se67/entity"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /activitys
func CreateBookActivity(c *gin.Context) {
    var bookActivity entity.BookActivity

    // Bind to activity variable
    if err := c.ShouldBindJSON(&bookActivity); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if _, err := govalidator.ValidateStruct(bookActivity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    // Log incoming request data
    log.Printf("Received data: %+v\n", bookActivity)

    db := config.DB()

    // Validate activity
    var activity entity.Activity
    db.First(&activity, bookActivity.ActivityID)
    if activity.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found"})
        return
    }
    

    // // Validate bookActivity
    var bookingTrip entity.BookingTrip
    db.First(&bookingTrip, bookActivity.BookingTripID)
    if bookingTrip.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "BookActivity not found"})
        return
    }

    // Validate customer
    var guest entity.Guest
    db.First(&guest, bookActivity.GuestID)
    if guest.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Guest not found"})
        return
    }
    
    
    // Create CruiseTrip
    a := entity.BookActivity{
		Date:           bookActivity.Date,
		Time:           bookActivity.Time,
		Particnum: bookActivity.Particnum,
		Comment:        bookActivity.Comment,
		PhoneNumber:   bookActivity.PhoneNumber,

		BookingTripID: bookActivity.BookingTripID,
		BookingTrip:   bookingTrip,

		GuestID: bookActivity.GuestID,
		Guest:   guest,

		ActivityID: bookActivity.ActivityID,
		Activity:   activity,
	}

    // Save to database
    if err := db.Create(&a).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": a})
}


// GET /BookActivity/:id
func GetBookActivity(c *gin.Context) {
	ID := c.Param("id")
	var bookActivity entity.BookActivity

	db := config.DB()
	results := db.Preload("Activity").Preload("BookingTrip").Preload("Guest").First(&bookActivity, ID)
	if results.Error != nil {
        if results.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "BookActivity not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }
	if bookActivity.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, bookActivity)
}

// GET /classes
func ListBookActivitys(c *gin.Context) {

	var bookActivitys []entity.BookActivity

	db := config.DB()
	results := db.Preload("Activity").Preload("BookingTrip").Preload("Guest").Find(&bookActivitys)
	if results.Error != nil {
        if results.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "BookActivity not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }
	c.JSON(http.StatusOK, bookActivitys)
}

func GetAllBookActivityByCustomerId(c *gin.Context) {

	var bookActivity []entity.BookActivity
    db := config.DB()
	id := c.Param("id")
	if err := db.Preload("BookingTrip").Preload("Guest").Preload("Activity").Raw("SELECT * FROM book_activities WHERE guest_id = ?", id).Find(&bookActivity).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bookActivity})
}

// DELETE /cruisetrips/:id
func DeleteBookActivity(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM guest_id WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /classes
func UpdateBookActivity(c *gin.Context) {
	var bookActivity entity.BookActivity

	UserID := c.Param("id")

	db := config.DB()
	result := db.First(&bookActivity, UserID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&bookActivity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

    if _, err := govalidator.ValidateStruct(bookActivity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result = db.Save(&bookActivity)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}