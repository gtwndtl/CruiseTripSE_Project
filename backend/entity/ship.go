package entity

import (
	"gorm.io/gorm"
)

type Ship struct {
	gorm.Model
	Name       string       `gorm:"uniqueIndex"`
	CruiseTrip []CruiseTrip `gorm:"foreignKey:ShipID"`
	Employees  []Employees `gorm:"foreignKey:ShipID"`
}
