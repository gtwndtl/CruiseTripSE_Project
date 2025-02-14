package entity

import (
	"gorm.io/gorm"
	"time"
)

type Review struct {
	gorm.Model
	Review_date            time.Time `json:"review_date" valid:"required~Review_date is required"`
	Review_text            string    `gorm:"type:TEXT" json:"review_text" valid:"required~Review_text is required"`
	Service_rating         float32   `json:"service_rating" valid:"required~Service_rating is required"`
	Value_for_money_rating float32   `json:"value_for_money_rating" valid:"required~Value_for_money_rating is required"`
	Taste_rating           float32   `json:"taste_rating" valid:"required~Taste_rating is required"`
	Cabin_rating           float32   `json:"cabin_rating" valid:"required~Cabin_rating is required"`
	Overall_rating         float32   `json:"overall_rating" valid:"required~Overall_rating is required"`
	Pictures               []string  `gorm:"type:json;serializer:json" json:"pictures"` // ใช้ serializer
	Recommended_dishes     string    `json:"recommended_dishes" valid:"required~Recommended_dishes is required"`

	ReviewTypeID uint         `json:"review_type_id" valid:"required~ReviewTypeID is required"`
	ReviewType   *Review_type `gorm:"foreignKey: review_type_id" json:"review_type"`

	OrderID uint    `json:"order_id" valid:"required~OrderID is required"`
	Order   *Orders `gorm:"foreignKey: order_id" json:"order"`

	FoodServicePaymentID uint                `json:"food_service_payment_id" valid:"required~FoodServicePaymentID is required"`
	FoodServicePayment   *FoodServicePayment `gorm:"foreignKey:food_service_payment_id" json:"food_service_payment"` // Referencing 'FoodServicePayment' struct from 'entity' package

	BookingTripID uint         `json:"booking_trip_id" valid:"required~BookingTripID is required"`
	BookingTrip   *BookingTrip `gorm:"foreignKey:booking_trip_id" json:"booking_trip"`

	TripPaymentID uint         `json:"trip_payment_id" valid:"required~TripPaymentID is required"`
	TripPayment   *TripPayment `gorm:"foreignKey:trip_payment_id" json:"trip_payment"`

	GuestID uint   `json:"guest_id" valid:"required~GuestID is required"`
	Guest   *Guest `gorm:"foreignKey:guest_id" json:"guest"`

	CustomerID uint       `json:"customer_id" valid:"required~CustomerID is required"`
	Customer   *Customers `gorm:"foreignKey:customer_id" json:"customer"`
}
