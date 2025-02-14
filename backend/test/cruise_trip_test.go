package unit

import (
	"team03/se67/entity"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestMissingCruiseTripName(t *testing.T) {
	g := NewGomegaWithT(t)

	cruiseTrip := entity.CruiseTrip{
		Deets:     "Valid details",
		StartDate: time.Now().AddDate(0, 1, 0),
		EndDate:   time.Now().AddDate(0, 1, 10),
		PlanImg:   "example.png",
		PlanPrice: 2000000,
		ParticNum: 10,
		ShipID:    1,
		EmployeesID: 1,
		RoutesID:  1,
	}

	ok, err := govalidator.ValidateStruct(cruiseTrip)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("กรอกชื่อทริป"))
}


func TestInvalidStartDateAndEndDate(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูล StartDate และ EndDate ไม่ถูกต้อง
	cruiseTrip := entity.CruiseTrip{
		CruiseTripName: "Test Trip",
		Deets:          "Valid details",
		StartDate:      time.Now().AddDate(-1, 0, -1), // อดีต
		EndDate:        time.Now().AddDate(-1, 0, -1), // อดีต
		PlanImg:        "example.png",
		PlanPrice:      2000000,
		ParticNum:      10,
		ShipID:         1,
		EmployeesID:    1,
		RoutesID:       1,
	}

	ok, err := govalidator.ValidateStruct(cruiseTrip)

	// ตรวจสอบ
	g.Expect(ok).NotTo(BeTrue())
	g.Expect(err).NotTo(BeNil())
	g.Expect(err.Error()).To(ContainSubstring("StartDate ต้องเป็นวันที่ในอนาคต"))
	g.Expect(err.Error()).To(ContainSubstring("EndDate ต้องเป็นวันที่ในอนาคต"))
}



func TestInvalidPlanPrice(t *testing.T) {
	g := NewGomegaWithT(t)

	cruiseTrip := entity.CruiseTrip{
		CruiseTripName: "Test Trip",
		Deets:          "Valid details",
		StartDate:      time.Now().AddDate(0, 1, 0),
		EndDate:        time.Now().AddDate(0, 1, 10),
		PlanImg:        "example.png",
		PlanPrice:      50000000, // นอกช่วงที่กำหนด
		ParticNum:      10,
		ShipID:         1,
		EmployeesID:    1,
		RoutesID:       1,
	}

	ok, err := govalidator.ValidateStruct(cruiseTrip)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("กรอกราคาช่วง 1000000 - 1000000"))
}


func TestMissingPlanImg(t *testing.T) {
	g := NewGomegaWithT(t)

	cruiseTrip := entity.CruiseTrip{
		CruiseTripName: "Test Trip",
		Deets:          "Valid details",
		StartDate:      time.Now().AddDate(0, 1, 0),
		EndDate:        time.Now().AddDate(0, 1, 10),
		PlanImg:        "", // ไม่ใส่รูป
		PlanPrice:      2000000,
		ParticNum:      10,
		ShipID:         1,
		EmployeesID:    1,
		RoutesID:       1,
	}

	ok, err := govalidator.ValidateStruct(cruiseTrip)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("ใส่รูปภาพ"))
}


func TestMissingShipID(t *testing.T) {
	g := NewGomegaWithT(t)

	cruiseTrip := entity.CruiseTrip{
		CruiseTripName: "Test Trip",
		Deets:          "Valid details",
		StartDate:      time.Now().AddDate(0, 1, 0),
		EndDate:        time.Now().AddDate(0, 1, 10),
		PlanImg:        "example.png",
		PlanPrice:      2000000,
		ParticNum:      10,
		ShipID:         0, // ไม่ใส่เรือ
		EmployeesID:    1,
		RoutesID:       1,
	}

	ok, err := govalidator.ValidateStruct(cruiseTrip)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("กรอกชื่อเรือ"))
}


func TestMissingRouteID(t *testing.T) {
	g := NewGomegaWithT(t)

	cruiseTrip := entity.CruiseTrip{
		CruiseTripName: "Test Trip",
		Deets:          "Valid details",
		StartDate:      time.Now().AddDate(0, 1, 0),
		EndDate:        time.Now().AddDate(0, 1, 10),
		PlanImg:        "example.png",
		PlanPrice:      2000000,
		ParticNum:      10,
		ShipID:         1, // ไม่ใส่เรือ
		EmployeesID:    1,
		RoutesID:       0,
	}

	ok, err := govalidator.ValidateStruct(cruiseTrip)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("กรุณาเลือกเส้นทาง"))
}
