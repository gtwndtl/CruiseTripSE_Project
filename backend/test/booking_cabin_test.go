package unit

import (
	"team03/se67/entity"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func init() {
	// ลงทะเบียน Validator สำหรับ greaterzeroF
	govalidator.CustomTypeTagMap.Set("greaterzeroF", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		value, ok := i.(float64)
		if !ok {
			return false
		}
		return value > 0
	}))
}

func TestCheckIn(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`CheckIn is required`, func(t *testing.T) {
		bookingCabin := entity.BookingCabin{
			CheckIn: time.Time{}, //ผิดตรงนี้
			CheckOut: time.Now(),
			Note: "-",
			BookingCabinPrice: 100000,
			TotalPrice: 150000,
			BookingTripID: 1,
			CabinID: 1,
			StatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(bookingCabin)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("CheckIn is required"))
	})
}

func TestCheckOut(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`CheckOut is required`, func(t *testing.T) {
		bookingCabin := entity.BookingCabin{
			CheckIn: time.Now(),
			CheckOut: time.Time{}, //ผิดตรงนี้
			Note: "-",
			BookingCabinPrice: 100000,
			TotalPrice: 150000,
			BookingTripID: 1,
			CabinID: 1,
			StatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(bookingCabin)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("CheckOut is required"))
	})
}

func TestNote(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Note is required`, func(t *testing.T) {
		bookingCabin := entity.BookingCabin{
			CheckIn: time.Now(),
			CheckOut: time.Now(),
			Note: "", //ผิดตรงนี้
			BookingCabinPrice: 100000,
			TotalPrice: 150000,
			BookingTripID: 1,
			CabinID: 1,
			StatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(bookingCabin)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Note is required"))
	})
}

func TestBookingCabinPrice(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`BookingCabinPrice is required`, func(t *testing.T) {
		bookingCabin := entity.BookingCabin{
			CheckIn: time.Now(),
			CheckOut: time.Now(),
			Note: "-",
			BookingCabinPrice: 0, //ผิดตรงนี้
			TotalPrice: 150000,
			BookingTripID: 1,
			CabinID: 1,
			StatusID: 1,
		}
	
		ok, err := govalidator.ValidateStruct(bookingCabin)
	
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
	
		g.Expect(err.Error()).To(Equal("BookingCabinPrice is required"))
	})

	t.Run(`BookingCabinPrice must be greater than 0`, func(t *testing.T) {
		bookingCabin := entity.BookingCabin{
			CheckIn: time.Now(),
			CheckOut: time.Now(),
			Note: "-",
			BookingCabinPrice: -100000, //ผิดตรงนี้
			TotalPrice: 150000,
			BookingTripID: 1,
			CabinID: 1,
			StatusID: 1,
		}
	
		ok, err := govalidator.ValidateStruct(bookingCabin)
	
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
	
		g.Expect(err.Error()).To(Equal("BookingCabinPrice must be greater than 0"))
	})
}

func TestTotalPrice(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`TotalPrice is required`, func(t *testing.T) {
		bookingCabin := entity.BookingCabin{
			CheckIn: time.Now(),
			CheckOut: time.Now(),
			Note: "-",
			BookingCabinPrice: 100000,
			TotalPrice: 0, //ผิดตรงนี้
			BookingTripID: 1,
			CabinID: 1,
			StatusID: 1,
		}
	
		ok, err := govalidator.ValidateStruct(bookingCabin)
	
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
	
		g.Expect(err.Error()).To(Equal("TotalPrice is required"))
	})

	t.Run(`TotalPrice must be greater than 0`, func(t *testing.T) {
		bookingCabin := entity.BookingCabin{
			CheckIn: time.Now(),
			CheckOut: time.Now(),
			Note: "-",
			BookingCabinPrice: 100000, //ผิดตรงนี้
			TotalPrice: -150000, //ผิดตรงนี้
			BookingTripID: 1,
			CabinID: 1,
			StatusID: 1,
		}
	
		ok, err := govalidator.ValidateStruct(bookingCabin)
	
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
	
		g.Expect(err.Error()).To(Equal("TotalPrice must be greater than 0"))
	})
}

func TestBookingCabinValid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`BookingCabin valid`, func(t *testing.T) {
		bookingCabin := entity.BookingCabin{
			CheckIn: time.Now(),
			CheckOut: time.Now(),
			Note: "-",
			BookingCabinPrice: 100000,
			TotalPrice: 150000,
			BookingTripID: 1,
			CabinID: 1,
			StatusID: 1,
		}
	
		ok, err := govalidator.ValidateStruct(bookingCabin)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}