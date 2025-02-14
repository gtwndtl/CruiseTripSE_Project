package config

import (
	"fmt"
	"team03/se67/entity"
)

func SetupCabinDatabase() {
	// Auto-migrate tables
	db.AutoMigrate(
		&entity.Cabin{},
	)

	// Create sample TripPayment
	roomCapacities := []int{1, 2, 3, 4}
	roomsPerCapacity := 192

	startCabinNumber := 100

	for _, capacity := range roomCapacities {
		for i := 1; i <= roomsPerCapacity; i++ {

			cabin := entity.Cabin{
				CabinNumber: startCabinNumber + (i - 1) + (capacity-1)*roomsPerCapacity, // หมายเลขห้องที่เป็น 3 หลัก
				Capacity:    capacity,
				StatusID: 7,
				CabinTypeID: uint((i-1)%4 + 1), // กำหนดให้มีประเภทห้อง 4 ประเภท (1, 2, 3, 4) โดยเริ่มจาก 1
			}

			// ใช้ FirstOrCreate เพื่อค้นหาห้องตามหมายเลขห้อง (CabinNumber) หากไม่พบจะสร้างใหม่
			result := db.Where(entity.Cabin{CabinNumber: cabin.CabinNumber}).FirstOrCreate(&cabin)
			if result.Error != nil {
				fmt.Println("Error inserting or finding cabin:", result.Error)
			}
		}
	}
}
