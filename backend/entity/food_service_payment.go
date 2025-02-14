package entity

import (
	"time"
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type FoodServicePayment struct {
	gorm.Model
	PaymentDate 	time.Time 		`valid:"required~PaymentDate is required"`
	Price 			float64			`valid:"price_positive~Price must not be negative"`
	VAT             float64        	`valid:"vat_positive~VAT must not be negative"`
	PaymentStatus	string			`valid:"required~PaymentStatus is required"`
	PaymentMethod	string			`valid:"required~PaymentMethod is required"`
	
	// OrderID ทำหน้าที่เป็น FK
	OrderID 		uint			`valid:"required~OrderID is required"`
	Order   		*Orders 		`gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE;"`

	// TripPaymentID ทำหน้าที่เป็น FK
	TripPaymentID 	uint			`valid:"required~TripPaymentID is required"`
	TripPayment   	*TripPayment 	`gorm:"foreignKey:TripPaymentID;constraint:OnDelete:CASCADE;"`

	// PromotionID ทำหน้าที่เป็น FK
	PromotionID uint
	Promotion   *Promotion `gorm:"foreignKey:PromotionID;constraint:OnDelete:CASCADE;"`
}


func init() {
	// Custom validation for positive Price (Allow 0)
	govalidator.CustomTypeTagMap.Set("price_positive", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		if price, ok := i.(float64); ok {
			// Allow 0 as valid
			return price >= 0
		}
		return false
	}))

	// Custom validation for positive VAT
	govalidator.CustomTypeTagMap.Set("vat_positive", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		if vat, ok := i.(float64); ok {
			// VAT must be non-negative
			return vat >= 0
		}
		return false
	}))
}

