package config

import (
	"fmt"
	"team03/se67/entity"
	"time"
)

func SetupBookingCabinDatabase() {
	db.AutoMigrate(
		&entity.BookingCabin{},
	)
	
	// Create BookingCabin
	// CheckIn, _ := time.Parse("2006-01-02","2024-11-11")
	// CheckOut, _ := time.Parse("2006-01-02","2024-11-18")
	// BookingCabin := []entity.BookingCabin{
	// 	{
	// 		CheckIn: CheckIn,
	// 		CheckOut: CheckOut,
	// 		BookingStatus: "รอชำระเงิน",
	// 		Note: "-",
	// 		TotalPrice: 150000,
	// 		BookingTripID: 1,
	// 	},
	// }

	// for _, bookingcabin := range BookingCabin {
	// 	db.FirstOrCreate(&bookingcabin, &entity.BookingCabin{BookingTripID: bookingcabin.BookingTripID})
	// }

	// อันด้านล่างนี้ทิวเพิ่มเอง เอาไว้เป็นตัวทดสอบของระบบบริการอาหาร
	CheckIn2 := time.Now()
	CheckOut2 := time.Now().Add(24 * time.Hour)
	BookingCabin2 := []entity.BookingCabin{
		{
			CheckIn: CheckIn2,
			CheckOut: CheckOut2,
			Note: "-",
			BookingCabinPrice: 100000,
			TotalPrice: 150000,
			CabinID: 1,
			BookingTripID: 1,
			StatusID: 4,
		},
	}

	for _, bookingcabin2 := range BookingCabin2 {
		db.FirstOrCreate(&bookingcabin2, &entity.BookingCabin{BookingTripID: bookingcabin2.BookingTripID})
	}


	fmt.Println("Booking cabin saved:", BookingCabin2)
}