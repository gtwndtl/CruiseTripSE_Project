package entity

import (
	"gorm.io/gorm"
)

type MenuItemOptions struct {
	gorm.Model
	MenuID     		uint			`valid:"required~MenuID is required"`
	Menu      		*Menus      	`gorm:"foreignKey:MenuID" valid:"-"`

	MenuOptionID 	uint			`valid:"required~MenuOptionID is required"`
	MenuOption   	*MenuOptions 	`gorm:"foreignKey:MenuOptionID" valid:"-"`
}
