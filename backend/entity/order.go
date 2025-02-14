package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Orders struct {
	gorm.Model
	OrderDate   time.Time `valid:"required~OrderDate is required"`
	TotalAmount float64   `valid:"required~TotalAmount is required,total_amount_positive~TotalAmount must not be negative"`

	StatusID    uint      `valid:"required~Status is required"`
	Status      *Stats    `gorm:"foreignKey:StatusID" valid:"-"`

	GuestID uint        `valid:"required~GuestID is required"`
	Guest   *Customers  `gorm:"foreignKey:GuestID;constraint:OnDelete:CASCADE;" valid:"-"`

	OrderDetails []OrderDetails `gorm:"foreignKey:OrderID" valid:"-"`
}

func init() {
	// Custom validation for positive TotalAmount
	govalidator.CustomTypeTagMap.Set("total_amount_positive", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		if amount, ok := i.(float64); ok {
			return amount >= 0
		}
		return false
	}))
}
