package customers

import (
	"errors"
	"fmt"

	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"team03/se67/config"
	"team03/se67/entity"
	"team03/se67/services"
)


type (

   Authen struct {

       Email    string `json:"email"`
       Password string `json:"password"`
   }


   signUp struct {
       
       FirstName string    `json:"first_name"`
       LastName  string    `json:"last_name"`
       Email     string    `json:"email"`
       Phone     string    `json:"phone"`
       Age       uint8     `json:"age"`
       BirthDay  time.Time `json:"birthday"`
       Password  string    `json:"password"`
       Picture   string    `json:"picture"`
       GenderID  uint      `json:"gender_id"`
       RoleID    uint      `json:"role_id"`
   }

)


func SignUp(c *gin.Context) {
	var payload signUp
	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
 
	}
 
	db := config.DB()
	var userCheck1 entity.Customers
	var userCheck2 entity.Employees
	// Check if the user with the provided email already exists
	result1 := db.Where("email = ?", payload.Email).First(&userCheck1)
	if result1.Error != nil && !errors.Is(result1.Error, gorm.ErrRecordNotFound) {
		// If there's a database error other than "record not found"
		c.JSON(http.StatusInternalServerError, gin.H{"error": result1.Error.Error()})
		return
 
	}

	result2 := db.Where("email = ?", payload.Email).First(&userCheck2)
	if result2.Error != nil && !errors.Is(result2.Error, gorm.ErrRecordNotFound) {
		// If there's a database error other than "record not found"
		c.JSON(http.StatusInternalServerError, gin.H{"error": result2.Error.Error()})
		return
 
	}
 
	if userCheck1.ID != 0 || userCheck2.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})
		return
 
	}


   // Hash the user's password

   hashedPassword, _ := config.HashPassword(payload.Password)


   // Create a new user

   user := entity.Customers{

       FirstName: payload.FirstName,
       LastName:  payload.LastName,
       Email:     payload.Email,
       Phone:     payload.Phone,
       Age:       payload.Age,
       BirthDay:  payload.BirthDay,
       Password:  hashedPassword,
       Picture:   payload.Picture,
       GenderID:  payload.GenderID,
       RoleID:    payload.RoleID,

   }


   // Save the user to the database

   if err := db.Create(&user).Error; err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

       return

   }


   c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})

}


func SignIn(c *gin.Context) {
    var payload Authen
    var customer entity.Customers
    var employee entity.Employees
    var role string
    var roleID uint
    var found bool = false

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    fmt.Println("Payload Email/Username:", payload.Email)

    db := config.DB()

    // ตรวจสอบในตาราง Customers
    if err := db.Where("email = ?", payload.Email, payload.Email).First(&customer).Error; err == nil {
        found = true
        roleID = customer.RoleID
    } else {
        fmt.Println("Customer ::", err)
    }

    if !found {
        if err := db.Where("email = ?", payload.Email, payload.Email).First(&employee).Error; err == nil {
            found = true
            roleID = employee.RoleID
        } else {
            fmt.Println("Employee ::", err)
        }
    }

    // หากไม่พบข้อมูลในทั้งสองตาราง
    if !found {
        c.JSON(http.StatusBadRequest, gin.H{"error": "email not found"})
        return
    }

    var hashedPassword string
    if customer.ID != 0 {
        hashedPassword = customer.Password
    } else {
        hashedPassword = employee.Password
    }

    err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(payload.Password))
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "password is incorrect"})
        return
    }


    var roleEntity entity.Roles
    if err := db.Where("id = ?", roleID).First(&roleEntity).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "role not found"})
        return
    }

    role = roleEntity.Role
    

    var email string
    var userID uint
    if employee.ID != 0 {
        email = employee.Email
        userID = employee.ID
    } else if customer.ID != 0 {
        email = customer.Email
        userID = customer.ID
    }
        // สร้าง JWT Token
        jwtWrapper := services.JwtWrapper{
            SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
            Issuer:          "AuthService",
            ExpirationHours: 24,
        }

        signedToken, err := jwtWrapper.GenerateToken(email, role)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
            return
        }

        fmt.Println("Role:", email)
        fmt.Println("Role:", role)
        fmt.Println("Generated Token:", signedToken)

        c.JSON(http.StatusOK, gin.H{
            "token_type": "Bearer",
            "token":      signedToken,
            "id":         userID,
            "role":       role,
        })
}


