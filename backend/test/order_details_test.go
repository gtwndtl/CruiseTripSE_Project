package unit

import (
	"testing"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"team03/se67/entity"
)

func TestValidOrderDetailsInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid OrderDetails input", func(t *testing.T) {
		order_detail := entity.OrderDetails{
			Quantity:	2,
			Amount:     250.00,
			MenuID:    	1,
			OrderID:    1,
		}

		ok, err := govalidator.ValidateStruct(order_detail)
		if !ok {
			t.Logf("Validation failed: %v", err)
		}
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestInvalidOrderDetailsInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing Quantity", func(t *testing.T) {
		order_detail := entity.OrderDetails{
			Quantity:	0,
			Amount:     250.00,
			MenuID:    	1,
			OrderID:    1,
		}

		ok, err := govalidator.ValidateStruct(order_detail)
		g.Expect(ok).To(BeFalse()) // คาดหวังว่า validation จะล้มเหลว
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Quantity is required"))
	})

	t.Run("should fail validation for missing Amount", func(t *testing.T) {
		order_detail := entity.OrderDetails{
			Quantity:	2,
			Amount:     0,
			MenuID:    	1,
			OrderID:    1,
		}

		ok, err := govalidator.ValidateStruct(order_detail)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Amount is required"))
	})

	t.Run("should fail validation for missing MenuID", func(t *testing.T) {
		order_detail := entity.OrderDetails{
			Quantity:	2,
			Amount:     250.00,
			MenuID:    	0,
			OrderID:    1,
		}

		ok, err := govalidator.ValidateStruct(order_detail)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("MenuID is required"))
	})

	t.Run("should fail validation for missing OrderID", func(t *testing.T) {
		order_detail := entity.OrderDetails{
			Quantity:	2,
			Amount:     250.00,
			MenuID:    	1,
			OrderID:    0,
		}

		ok, err := govalidator.ValidateStruct(order_detail)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("OrderID is required"))
	})
}

func TestInvalidNegativeQuantityAndAmount(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for negative Quantity", func(t *testing.T) {
		order_detail := entity.OrderDetails{
			Quantity:   -1,
			Amount:     250.00,
			MenuID:     1,
			OrderID:    1,
		}

		ok, err := govalidator.ValidateStruct(order_detail)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Quantity must not be negative"))
	})

	t.Run("should fail validation for negative Amount", func(t *testing.T) {
		order_detail := entity.OrderDetails{
			Quantity:   2,
			Amount:     -100.00,
			MenuID:     1,
			OrderID:    1,
		}

		ok, err := govalidator.ValidateStruct(order_detail)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Amount must not be negative"))
	})
}
