package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type CruiseTrip struct {
	gorm.Model
	CruiseTripName string  `valid:"required~กรอกชื่อทริปเรือ"`
    ParticNum      int     ` valid:"required~กรุณาระบุจำนวนผู้เข้าร่วม"`
    PlanImg        string  ` valid:"required~กรุณาใส่รูปภาพ"`
	StartDate 		time.Time `valid:"required~เวลาห้ามเป็นอดีต, future~StartDate ต้องเป็นวันที่ในอนาคต"`
	EndDate   		time.Time `valid:"required~เวลาห้ามเป็นอดีต, future~EndDate ต้องเป็นวันที่ในอนาคต"`
	PlanPrice      float64 `valid:"required~กรอกราคาช่วง 10000 - 1000000, range(10000|10000000)~กรอกราคาช่วง 10000 - 1000000"`
	Deets      string `valid:"required~กรุณากรอกรายละเอียด"`
    
	ShipID uint `valid:"required~Ship is required"`
    Ship   Ship `gorm:"foreignKey:ShipID"`

    RoutesID uint `valid:"required~Route is required"`
    Routes   Routes `gorm:"foreignKey:RoutesID"`

	EmployeesID uint
	Employees   Employees `gorm:"foreignKey:EmployeesID"`

	BookingTrip []BookingTrip `gorm:"foreignKey:CruiseTripID"`
}




func init() {
	govalidator.CustomTypeTagMap.Set("future", func(i interface{}, context interface{}) bool {
		if t, ok := i.(time.Time); ok {
			return t.After(time.Now())
		}
		return false
	})
}