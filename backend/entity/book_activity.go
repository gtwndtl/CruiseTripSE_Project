package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type BookActivity struct {
	gorm.Model

	Date        time.Time `valid:"required~กรุณาเลือกวัน,after_yesterday~วันจะต้องเป็นตั้งแต่ปัจจุบัน"`
	Time        string    `valid:"required~กรุณาเลือกเวลา"`
	Particnum   int       `valid:"required~กรุณาระบุจำนวนคน,range(1|10)~จำนวนคนต้องอยู่ระหว่าง 1 ถึง 10 คน"`
	Comment     string
	PhoneNumber string `valid:"required~กรุณาใส่เบอร์โทรศัพท์, matches(^[0]\\d{9}$)~เบอร์โทรศัพท์ ต้องเริ่มต้นด้วยเลข 0 และให้มีความยาวทั้งหมด 10 หลัก"`

	BookingTripID uint
	BookingTrip   BookingTrip `gorm:"foreignKey:BookingTripID" valid:"-"`

	GuestID uint
	Guest   Guest `gorm:"foreignKey:GuestID" valid:"-"`

	ActivityID uint     `valid:"required~กรุณาเลือกกิจกรรม"`
	Activity   Activity `gorm:"foreignKey:ActivityID" valid:"-"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("after_yesterday", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		date, ok := i.(time.Time)
		if !ok {
			return false
		}
		// อนุญาตให้วันที่เท่ากับหรือหลังเวลาปัจจุบัน
		return !date.Before(time.Now())
	}))
}
