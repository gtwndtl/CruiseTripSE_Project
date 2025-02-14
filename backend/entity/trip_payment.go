package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type TripPayment struct {
	gorm.Model
	PaymentDate    time.Time     `valid:"required~PaymentDate is required"`
	TotalPrice     float64       `valid:"totalPrice_positive~TotalPrice must not be negative"` 
	TotalVAT            float64  `valid:"total_vat_positive~TotalVAT must not be negative"`
	PaymentStatus  string        `valid:"required~PaymentStatus is required"`
	PaymentMethod  string        `valid:"required~PaymentMethod is required"`

	BookingCabinID uint          `valid:"required~BookingCabinID is required"`
	BookingCabin   *BookingCabin `gorm:"foreignKey:BookingCabinID;constraint:OnDelete:CASCADE;" valid:"-"`

	// PromotionID ทำหน้าที่เป็น FK
	PromotionID uint
	Promotion   *Promotion `gorm:"foreignKey:PromotionID;constraint:OnDelete:CASCADE;"`
}

func init() {
	// Custom validation for positive TotalPrice (Allow 0)
	govalidator.CustomTypeTagMap.Set("totalPrice_positive", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		if price, ok := i.(float64); ok {
			// Allow 0 as valid
			return price >= 0
		}
		return false
	}))

	// Custom validation for positive VAT
	govalidator.CustomTypeTagMap.Set("total_vat_positive", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		if vat, ok := i.(float64); ok {
			// VAT must be non-negative
			return vat >= 0
		}
		return false
	}))
}
