package entity

import "gorm.io/gorm"

type CabinType struct {
	gorm.Model
	TypeName   string
	CabinPrice float64
	Image      string `gorm:"type: longtext"`
	Cabinsize  float64

	Cabins []Cabin `gorm:"foreignKey:CabinTypeID"`
}
