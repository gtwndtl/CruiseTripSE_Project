package unit

import (
	"team03/se67/entity"
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestFirstName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`FirstName is required`, func(t *testing.T) {
		guest := entity.Guest{
			FirstName: "", //ผิดตรงนี้
			LastName: "Test",
			Email: "test@gmail.com",
			Phone: "0999999999",
			BirthDay: time.Now(),
			Address: "Thailand",
			Age: 20,
			GenderID: 1,
			BookingTripID: 1,
			RoleID: 4,
		}

		ok, err := govalidator.ValidateStruct(guest)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("FirstName is required"))
	})
}

func TestLastName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`LastName is required`, func(t *testing.T) {
		guest := entity.Guest{
			FirstName: "Unit",
			LastName: "", //ผิดตรงนี้
			Email: "test@gmail.com",
			Phone: "0999999999",
			BirthDay: time.Now(),
			Address: "Thailand",
			Age: 20,
			GenderID: 1,
			BookingTripID: 1,
			RoleID: 4,
		}

		ok, err := govalidator.ValidateStruct(guest)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("LastName is required"))
	})
}

func TestEmail(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Email is required`, func(t *testing.T) {
		guest := entity.Guest{
			FirstName: "Unit",
			LastName: "Test",
			Email: "", //ผิดตรงนี้
			Phone: "0999999999",
			BirthDay: time.Now(),
			Address: "Thailand",
			Age: 20,
			GenderID: 1,
			BookingTripID: 1,
			RoleID: 4,
		}

		ok, err := govalidator.ValidateStruct(guest)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Email is required"))
	})

	t.Run(`Email is invalid`, func(t *testing.T) {
		guest := entity.Guest{
			FirstName: "Unit",
			LastName: "Test",
			Email: "test", //ผิดตรงนี้
			Phone: "0999999999",
			BirthDay: time.Now(),
			Address: "Thailand",
			Age: 20,
			GenderID: 1,
			BookingTripID: 1,
			RoleID: 4,
		}

		ok, err := govalidator.ValidateStruct(guest)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Email is invalid"))
	})
}

func TestPhoneNumber(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Phone is required`, func(t *testing.T) {
		guest := entity.Guest{
			FirstName: "Unit",
			LastName: "Test",
			Email: "test@gmail.com",
			Phone: "", //ผิดตรงนี้
			BirthDay: time.Now(),
			Address: "Thailand",
			Age: 20,
			GenderID: 1,
			BookingTripID: 1,
			RoleID: 4,
		}
	
		ok, err := govalidator.ValidateStruct(guest)
	
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
	
		g.Expect(err.Error()).To(Equal("Phone is required"))
	})

	t.Run(`Phone check 10 digit`, func(t *testing.T) {
		guest := entity.Guest{
			FirstName: "Unit",
			LastName: "Test",
			Email: "test@gmail.com",
			Phone: "09999999999", // ผิดตรงนี้ มี 11 ตัว
			BirthDay: time.Now(),
			Address: "Thailand",
			Age: 20,
			GenderID: 1,
			BookingTripID: 1,
			RoleID: 4,
		}

		ok, err := govalidator.ValidateStruct(guest)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal(fmt.Sprintf("Phone: %s does not validate as stringlength(10|10)", guest.Phone)))
	})
}

func TestBithday(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Birthday is required`, func(t *testing.T) {
		guest := entity.Guest{
			FirstName: "Unit",
			LastName: "Test",
			Email: "test@gmail.com",
			Phone: "0999999999",
			BirthDay: time.Time{},//ผิดตรงนี้
			Address: "Thailand",
			Age: 20,
			GenderID: 1,
			BookingTripID: 1,
			RoleID: 4,
		}

		ok, err := govalidator.ValidateStruct(guest)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Birthday is required"))
	})
}

func TestAddress(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Address is required`, func(t *testing.T) {
		guest := entity.Guest{
			FirstName: "Unit",
			LastName: "Test",
			Email: "test@gmail.com",
			Phone: "0999999999",
			BirthDay: time.Now(),
			Address: "", // ผิดตรงนี้
			Age: 20,
			GenderID: 1,
			BookingTripID: 1,
			RoleID: 4,
		}

		ok, err := govalidator.ValidateStruct(guest)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Address is required"))
	})
}

func TestValid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`valid`, func(t *testing.T) {
		guest := entity.Guest{
			FirstName: "Unit",
			LastName: "Test",
			Email: "test@gmail.com",
			Phone: "0999999999",
			BirthDay: time.Now(),
			Address: "Thailand",
			Age: 20,
			GenderID: 1,
			BookingTripID: 1,
			RoleID: 4,
		}

		ok, err := govalidator.ValidateStruct(guest)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}