package config

import (
	"team03/se67/entity"
	"time"
	// "gorm.io/gorm"
)

func SetupBookActivityDatabase() {
	db.AutoMigrate(
		&entity.Activity{},
		&entity.BookActivity{},
	)

	ShipArvia := entity.Activity{
		Name: "Arvia",
		ActivityImg: "example.png",
}
	Badminton := entity.Activity{
		Name: "Swimming",
		ActivityImg: "example.png",
	}

	db.FirstOrCreate(&ShipArvia, &entity.Activity{Name: "Arvia"})
	db.FirstOrCreate(&Badminton, &entity.Activity{Name: "Swimming"})


	B := entity.BookActivity{
		Date:        time.Date(2025, time.January, 1, 0, 0, 0, 0, time.UTC), // ตัวอย่างวันที่
		Time:        "10:00 AM", // ตัวอย่างเวลา
		Particnum:   5,          // ตัวอย่างจำนวนคน
		Comment:     "Example comment",
		PhoneNumber: "0812345678", // ตัวอย่างเบอร์โทร
	
		BookingTripID: 1, // ใส่ค่า ID ที่สัมพันธ์กับ BookingTrip ในระบบ
		GuestID:   1, // ใส่ค่า ID ของลูกค้าที่เกี่ยวข้อง
		ActivityID:    4, // ใส่ค่า ID ของกิจกรรมที่เลือก
	}
	db.FirstOrCreate(&B, entity.BookActivity{
		PhoneNumber: "0812345678",
	})
}