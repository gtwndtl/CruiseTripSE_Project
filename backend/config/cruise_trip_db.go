package config

import (
	"team03/se67/entity"
	"time"
	// "gorm.io/gorm"
)

func SetupCruiseTripDatabase() {
	db.AutoMigrate(
		&entity.Ship{},
		&entity.CruiseTrip{},
	)

	ShipArvia := entity.Ship{Name: "Arvia"}
	ShipCarnival := entity.Ship{Name: "Carnival Celebration"}

	db.FirstOrCreate(&ShipArvia, &entity.Ship{Name: "Arvia"})
	db.FirstOrCreate(&ShipCarnival, &entity.Ship{Name: "Carnival Celebration"})

	StartDate, _ := time.Parse("2006-01-02 15:04:05", "2024-08-31 14:30:00")
	EndDate, _ := time.Parse("2006-01-02 15:04:05", "2024-09-30 14:30:00")

	CruiseTrip := &entity.CruiseTrip{
		CruiseTripName: "Vietnam & Thailand Cruise",
		Deets:          "40 คืน",
		StartDate:      StartDate,
		EndDate:        EndDate,
		PlanPrice:      50000,
		ShipID:         1,
		RoutesID:       1,
		PlanImg:        "https://example.com/cruise_image.jpg",
		EmployeesID:    1,
		ParticNum:      40,
	}

	db.FirstOrCreate(CruiseTrip, &entity.CruiseTrip{
		CruiseTripName: "Vietnam & Thailand Cruise",
	})
}