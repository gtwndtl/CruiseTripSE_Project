package entity

import (
	"time"

	"gorm.io/gorm"
)

type BookingCabin struct {
	gorm.Model
	CheckIn   time.Time `valid:"required~CheckIn is required"`
	CheckOut time.Time `valid:"required~CheckOut is required"`
	Note string `valid:"required~Note is required"`
	BookingCabinPrice float64 `valid:"required~BookingCabinPrice is required, greaterzeroF~BookingCabinPrice must be greater than 0"`
	TotalPrice float64 `valid:"required~TotalPrice is required, greaterzeroF~TotalPrice must be greater than 0"`

	BookingTripID uint
	BookingTrip   BookingTrip `gorm:"foreignKey:BookingTripID" valid:"-"`

	CabinID uint
	Cabin   Cabin `gorm:"foreignKey:CabinID" valid:"-"`

	StatusID uint `json:"StatusID"`
	Status   Stats `gorm:"foreignKey:StatusID" valid:"-"`
}
