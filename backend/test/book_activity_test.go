package unit

import (
	"team03/se67/entity"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestMissingDate(t *testing.T) {
	g := NewGomegaWithT(t)

	bookActivity := entity.BookActivity{
		Time:           "10:00 AM",
		Particnum: 5,
		PhoneNumber:    "0123456789",
		ActivityID:     1,
	}

	ok, err := govalidator.ValidateStruct(bookActivity)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("กรุณาเลือกวัน"))
}

func TestInvalidDate(t *testing.T) {
	g := NewGomegaWithT(t)

	bookActivity := entity.BookActivity{
		Date:           time.Now().AddDate(0, 0, -1), // วันที่เป็นอดีต
		Time:           "10:00 AM",
		Particnum: 5,
		PhoneNumber:    "0123456789",
		ActivityID:     1,
	}

	ok, err := govalidator.ValidateStruct(bookActivity)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("วันจะต้องเป็นตั้งแต่ปัจจุบัน"))
}

func TestInvalidParticnum(t *testing.T) {
	g := NewGomegaWithT(t)

	bookActivity := entity.BookActivity{
		Date:           time.Now().AddDate(0, 0, 1),
		Time:           "10:00 AM",
		Particnum: 15, // เกิน 10 คน
		PhoneNumber:    "0123456789",
		ActivityID:     1,
	}

	ok, err := govalidator.ValidateStruct(bookActivity)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("จำนวนคนต้องอยู่ระหว่าง 1 ถึง 10 คน"))
}

func TestInvalidPhoneNumber(t *testing.T) {
	g := NewGomegaWithT(t)

	bookActivity := entity.BookActivity{
		Date:           time.Now().AddDate(0, 0, 1),
		Time:           "10:00 AM",
		Particnum: 5,
		PhoneNumber:    "123456789", // ไม่ตรงรูปแบบ
		ActivityID:     1,
	}

	ok, err := govalidator.ValidateStruct(bookActivity)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("เบอร์โทรศัพท์ ต้องเริ่มต้นด้วยเลข 0 และให้มีความยาวทั้งหมด 10 หลัก"))
}

func TestMissingActivityID(t *testing.T) {
	g := NewGomegaWithT(t)

	bookActivity := entity.BookActivity{
		Date:           time.Now().AddDate(0, 0, 1),
		Time:           "10:00 AM",
		Particnum: 5,
		PhoneNumber:    "0123456789",
		ActivityID:     0, // ไม่ได้เลือกกิจกรรม
	}

	ok, err := govalidator.ValidateStruct(bookActivity)

	// ok ต้องไม่เป็นค่า true
	g.Expect(ok).NotTo(BeTrue())
	// err ต้องไม่เป็นค่า nil
	g.Expect(err).NotTo(BeNil())
	// err.Error ต้องมีข้อความแสดงข้อผิดพลาด
	g.Expect(err.Error()).To(ContainSubstring("กรุณาเลือกกิจกรรม"))
}
