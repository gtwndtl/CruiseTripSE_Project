package unit

import (
	"testing"
	"time"

	"team03/se67/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestValidFoodServicePaymentInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid FoodServicePayment input", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Now(),
			Price:         1000.0,
			VAT:           70.0, // Assuming 7% VAT
			PaymentStatus: "Completed",
			PaymentMethod: "Credit Card",
			OrderID:       1,
			TripPaymentID: 2,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run("should pass validation when Price is 0", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Now(),
			Price:         0,
			VAT:           70.0, // Assuming 7% VAT
			PaymentStatus: "Completed",
			PaymentMethod: "Credit Card",
			OrderID:       1,
			TripPaymentID: 2,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	t.Run("should pass validation when VAT is 0", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Now(),
			Price:         1000,
			VAT:           0, // Assuming 7% VAT
			PaymentStatus: "Completed",
			PaymentMethod: "Credit Card",
			OrderID:       1,
			TripPaymentID: 2,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestInvalidFoodServicePaymentInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing PaymentDate", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Time{},
			Price:         1000.0,
			VAT:           70.0,
			PaymentStatus: "Completed",
			PaymentMethod: "Credit Card",
			OrderID:       1,
			TripPaymentID: 2,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PaymentDate is required"))
	})

	t.Run("should fail validation for missing PaymentStatus", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Now(),
			Price:         1000.0,
			VAT:           70.0,
			PaymentStatus: "",
			PaymentMethod: "Credit Card",
			OrderID:       1,
			TripPaymentID: 2,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PaymentStatus is required"))
	})

	t.Run("should fail validation for missing PaymentMethod", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Now(),
			Price:         1000.0,
			VAT:           70.0,
			PaymentStatus: "Completed",
			PaymentMethod: "",
			OrderID:       1,
			TripPaymentID: 2,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PaymentMethod is required"))
	})

	t.Run("should fail validation for missing OrderID", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Now(),
			Price:         1000.0,
			VAT:           70.0,
			PaymentStatus: "Completed",
			PaymentMethod: "Credit Card",
			OrderID:       0,
			TripPaymentID: 2,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("OrderID is required"))
	})

	t.Run("should fail validation for missing TripPaymentID", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Now(),
			Price:         1000.0,
			VAT:           70.0,
			PaymentStatus: "Completed",
			PaymentMethod: "Credit Card",
			OrderID:       1,
			TripPaymentID: 0,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("TripPaymentID is required"))
	})
}

func TestInvalidNegativePrice(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for negative Price", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Now(),
			Price:         -1000.0, // Price ติดลบ
			VAT:           70.0,
			PaymentStatus: "Completed",
			PaymentMethod: "Credit Card",
			OrderID:       1,
			TripPaymentID: 2,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Price must not be negative"))
	})
}

func TestInvalidNegativeVAT(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for negative VAT", func(t *testing.T) {
		foodServicePayment := entity.FoodServicePayment{
			PaymentDate:   time.Now(),
			Price:         1000.0,
			VAT:           -10.0, // VAT ติดลบ
			PaymentStatus: "Completed",
			PaymentMethod: "Credit Card",
			OrderID:       1,
			TripPaymentID: 2,
		}

		ok, err := govalidator.ValidateStruct(foodServicePayment)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("VAT must not be negative"))
	})
}
