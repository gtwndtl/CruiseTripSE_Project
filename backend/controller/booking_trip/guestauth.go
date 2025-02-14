package booking_trip

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"team03/se67/config"
	"team03/se67/entity"
	"team03/se67/services"
)

type GuestAuth struct {
	Email    string `json:"email"`
	BirthDay string `json:"birthday"`// Expecting the date in YYYY-MM-DD format
    RoleID   string `json:"role_id"`
}

func GuestSignIn(c *gin.Context) {
    var payload GuestAuth
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    db := config.DB()
    var guest entity.Guest
    var role string
    var roleID uint
    var found bool = true

    // ตรวจสอบว่า Email มีอยู่ในฐานข้อมูลหรือไม่
    if err := db.Where("email = ?", payload.Email).First(&guest).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Email not found or incorrect"})
        return
    }

    // ตรวจสอบรูปแบบของ BirthDay
    providedBirthDay, err := time.Parse("2006-01-02", payload.BirthDay)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid BirthDay format. Use YYYY-MM-DD"})
        return
    }

    // ตรวจสอบว่า BirthDay ตรงกับข้อมูลในฐานข้อมูลหรือไม่
    if !guest.BirthDay.Equal(providedBirthDay) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Birth Day"})
        return
    }
    
    if found {
        roleID = guest.RoleID
    }

    var roleEntity entity.Roles
    if err := db.Where("id = ?", roleID).First(&roleEntity).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "role not found"})
        return
    }

    role = roleEntity.Role
    

    // สร้าง JWT Token
    jwtWrapper := services.JwtWrapper{
        SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
        Issuer:          "AuthService",
        ExpirationHours: 24,
    }

    signedToken, err := jwtWrapper.GenerateToken(guest.Email, role)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": guest.ID, "role": role})
}
