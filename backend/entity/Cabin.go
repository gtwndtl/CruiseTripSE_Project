package entity

import "gorm.io/gorm"

type Cabin struct {
	gorm.Model
	CabinNumber int
	Capacity    int

	BookingCabins []BookingCabin `gorm:"foreignKey:CabinID"`

	CabinTypeID uint
	CabinType   CabinType `gorm:"foreignKey:CabinTypeID"`

	StatusID uint `json:"StatusID"`
	Status   Stats `gorm:"foreignKey:StatusID"`
}
