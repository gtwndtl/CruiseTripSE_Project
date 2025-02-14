package entity

import (
	"time"

	"gorm.io/gorm"
)

type Guest struct {
	gorm.Model
	FirstName string `json:"FirstName" valid:"required~FirstName is required"`
	LastName  string `json:"LastName" valid:"required~LastName is required"`
	Email     string `json:"Email" valid:"required~Email is required, email~Email is invalid"`
	Phone     string `json:"Phone" valid:"required~Phone is required, stringlength(10|10)"`
	BirthDay  time.Time `json:"Birthday" valid:"required~Birthday is required"`
	Address   string `json:"Address" valid:"required~Address is required"`
	Age       int `json:"Age" valid:"-"`

	GenderID uint `json:"GenderID"`
	Gender   Genders `gorm:"foreignKey:GenderID" valid:"-"`

	BookingTripID uint `json:"BookingTripID"`
	BookingTrip   BookingTrip `gorm:"foreignKey:BookingTripID" valid:"-"`

	RoleID    uint      `json:"role_id"`
    Role    *Roles  `gorm:"foreignKey: role_id" json:"role" valid:"-"`

	BookActivity []BookActivity `gorm:"foreignKey:GuestID" valid:"-"`


}
