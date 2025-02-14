package entity

import (
	"time"

	"gorm.io/gorm"
)

type BookingTrip struct {
	gorm.Model
	BookingDate   time.Time `json:"BookingDate"`
	NumberOfGuest int `json:"NumberOfGuest"`
	TotalPrice float64 `json:"TotalPrice"`

	BookingCabins []BookingCabin `gorm:"foreignKey:BookingTripID"`
	Guests []Guest `gorm:"foreignKey:BookingTripID"`

	CustomerID uint `json:"CustomerID"`
	Customer   Customers `gorm:"foreignKey:CustomerID"`

	CruiseTripID uint `json:"CruiseTripID"`
	CruiseTrip   CruiseTrip `gorm:"foreignKey:CruiseTripID"`

	StatusID uint `json:"StatusID"`
	Status   Stats `gorm:"foreignKey:StatusID"`
}
