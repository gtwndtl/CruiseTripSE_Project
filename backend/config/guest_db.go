package config

import (
	"team03/se67/entity"
	"time"
)

func SetupGuestDatabase() {
	db.AutoMigrate(
		&entity.Guest{},
	)
	
	// Create BookingTrip
	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")
	Guest := &entity.Guest{
		FirstName: "Software",
		LastName:  "Engineering",
		Email:     "se@gmail.com",
		Phone: "0999999999",
		BirthDay:  BirthDay,
		Address: "Thailand",
		Age: 36,
		GenderID:  1,
		BookingTripID: 1,
		RoleID: 4,
	}
	db.FirstOrCreate(Guest, &entity.Guest{
		Email: "se@gmail.com",
	})
}