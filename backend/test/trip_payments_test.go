package unit

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"team03/se67/entity"
)

func TestValidTripPaymentInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid TripPayment input", func(t *testing.T) {
		tripPayment := entity.TripPayment{
			PaymentDate:    time.Now(),
			TotalPrice:     1000.0,
			TotalVAT:            70.0, // Assuming 7% TotalVAT
			PaymentStatus:  "Completed",
			PaymentMethod:  "Credit Card",
			BookingCabinID:	1,
		}

		ok, err := govalidator.ValidateStruct(tripPayment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run("should pass validation when TotalPrice is 0", func(t *testing.T) {
		tripPayment := entity.TripPayment{
			PaymentDate:    time.Now(),
			TotalPrice:     0.0,
			TotalVAT:            70.0,
			PaymentStatus:  "Completed",
			PaymentMethod:  "Credit Card",
			BookingCabinID:	1,
		}

		ok, err := govalidator.ValidateStruct(tripPayment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestInvalidTripPaymentInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing PaymentDate", func(t *testing.T) {
		tripPayment := entity.TripPayment{
			PaymentDate:    time.Time{},
			TotalPrice:     1000.0,
			TotalVAT:       70.0, // Assuming 7% TotalVAT
			PaymentStatus:  "Completed",
			PaymentMethod:  "Credit Card",
			BookingCabinID:	1,
		}

		ok, err := govalidator.ValidateStruct(tripPayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PaymentDate is required"))
	})

	t.Run("should fail validation for missing PaymentStatus", func(t *testing.T) {
		tripPayment := entity.TripPayment{
			PaymentDate:    time.Now(),
			TotalPrice:     1000.0,
			TotalVAT:       70.0, // Assuming 7% VAT
			PaymentStatus:  "",
			PaymentMethod:  "Credit Card",
			BookingCabinID:	1,
		}

		ok, err := govalidator.ValidateStruct(tripPayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PaymentStatus is required"))
	})

	t.Run("should fail validation for missing PaymentMethod", func(t *testing.T) {
		tripPayment := entity.TripPayment{
			PaymentDate:    time.Now(),
			TotalPrice:     5000.50,
			TotalVAT:       70.0, // Assuming 7% VAT
			PaymentStatus:  "Completed",
			PaymentMethod:  "",
			BookingCabinID: 1,
		}

		ok, err := govalidator.ValidateStruct(tripPayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PaymentMethod is required"))
	})

	t.Run("should fail validation for missing BookingCabinID", func(t *testing.T) {
		tripPayment := entity.TripPayment{
			PaymentDate:    time.Now(),
			TotalPrice:     5000.50,
			TotalVAT:       70.0, // Assuming 7% VAT
			PaymentStatus:  "Completed",
			PaymentMethod:  "Credit Card",
			BookingCabinID: 0,
		}

		ok, err := govalidator.ValidateStruct(tripPayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("BookingCabinID is required"))
	})
}

func TestInvalidNegativeTotalPrice(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for negative TotalPrice", func(t *testing.T) {
		tripPayment := entity.TripPayment{
			PaymentDate:    time.Now(),
			TotalPrice:     -5000.50,
			TotalVAT:       70.0, // Assuming 7% VAT
			PaymentStatus:  "Completed",
			PaymentMethod:  "Credit Card",
			BookingCabinID: 1,
		}

		ok, err := govalidator.ValidateStruct(tripPayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("TotalPrice must not be negative"))
	})
}

func TestInvalidNegativeTotalVAT(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for negative TotalVAT", func(t *testing.T) {
		tripPayment := entity.TripPayment{
			PaymentDate:    time.Now(),
			TotalPrice:     5000.50,
			TotalVAT:       -70.0, // Assuming 7% VAT
			PaymentStatus:  "Completed",
			PaymentMethod:  "Credit Card",
			BookingCabinID: 1,
		}

		ok, err := govalidator.ValidateStruct(tripPayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("TotalVAT must not be negative"))
	})
}
