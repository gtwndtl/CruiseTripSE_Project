package entity

import (
	"gorm.io/gorm"
)

type OrderDetailMenuOptions struct {
	gorm.Model
	OrderDetailID    uint			`valid:"required~OrderDetailID is required"`
	OrderDetail      *OrderDetails 	`gorm:"foreignKey:OrderDetailID;constraint:OnDelete:CASCADE;" valid:"-"`

	MenuItemOptionID uint				`valid:"required~MenuItemOptionID is required"`
	MenuItemOption   *MenuItemOptions 	`gorm:"foreignKey:MenuItemOptionID;constraint:OnDelete:CASCADE;" valid:"-"`
}