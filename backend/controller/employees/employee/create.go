package employee


import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"team03/se67/config"
	"team03/se67/entity"
)

type (
 
	signUp struct {
		FirstName  string    `json:"first_name"`
		LastName   string    `json:"last_name"`
		Email      string    `json:"email"`
		Phone      string    `json:"phone"`
		Age        uint8     `json:"age"`
		Address    string    `json:"address"`
		Password   string    `json:"password"`
		BirthDay   time.Time `json:"birthday"`
		GenderID   uint      `json:"gender_id"`
		Salary     float32   `json:"salary"`
		Picture    string	 `json:"picture"`
		RoleID     uint      `json:"role_id"`
		StatID     uint      `json:"stat_id"`
		ShipID     uint      `json:"ship_id"`
	}
 )

 func SignUpEmployee(c *gin.Context) {
	var payload signUp
	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
 
	}
 
	db := config.DB()

	hashedPassword, _ := config.HashPassword(payload.Password)

	user := entity.Employees{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Email:     payload.Email,
		Phone:     payload.Phone,
		Age:       payload.Age,
		Address:   payload.Address,
		Password:  hashedPassword,
		BirthDay:  payload.BirthDay,
		GenderID:  payload.GenderID,
		Salary:    payload.Salary,
		Picture:   payload.Picture,
		RoleID:    payload.RoleID,
		StatID:    payload.StatID,
		ShipID:    payload.ShipID,
	}
 
 
	// Save the user to the database
 
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})
 }