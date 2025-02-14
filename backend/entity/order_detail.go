package entity

import (
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

// OrderDetail
type OrderDetails struct {
	gorm.Model
	Quantity   int     `valid:"required~Quantity is required,quantity_positive~Quantity must not be negative"`
	Amount     float64 `valid:"required~Amount is required,amount_positive~Amount must not be negative"`

	MenuID     uint    `valid:"required~MenuID is required"`
	Menu       *Menus  `gorm:"foreignKey:MenuID" valid:"-"`

	OrderID    uint    `valid:"required~OrderID is required"`
	Order      *Orders `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE;" valid:"-"`
}

func init() {
	// Custom validation for positive Quantity
	govalidator.CustomTypeTagMap.Set("quantity_positive", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		if quantity, ok := i.(int); ok {
			return quantity >= 0
		}
		return false
	}))

	// Custom validation for positive Amount
	govalidator.CustomTypeTagMap.Set("amount_positive", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		if amount, ok := i.(float64); ok {
			return amount >= 0
		}
		return false
	}))
}
