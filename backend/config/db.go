package config

import (
	"fmt"
	// "project-se67/config/setup"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
   return db
}

func ConnectionDB() {
   database, err := gorm.Open(sqlite.Open("project-se67.db?cache=shared"), &gorm.Config{})
   if err != nil {
       panic("failed to connect databaase")
   }
   fmt.Println("connected database")
   db = database
}

func SetupDatabase() {
   SetupEmployeeDatabase()
   SetupRouteDatabase()

   SetupCruiseTripDatabase()
   SetupBookActivityDatabase()
   
   SetupGuestDatabase()

   SetupCabinTypeDatabase()
   SetupCabinDatabase()
   
   SetupBookingTripDatabase()
   SetupBookingCabinDatabase()
   
   SetupFoodServiceDatabase()
   SetupPaymentDatabase()
   
   SetupPromotionDatabase()
   SetupReviewDatabase()

   
	fmt.Println("Sample data has been added to the database.")
}