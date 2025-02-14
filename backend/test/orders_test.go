package unit

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"team03/se67/entity"
)

func TestValidOrdersInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid Orders input", func(t *testing.T) {
		order := entity.Orders{
			OrderDate:   time.Now(),
			TotalAmount: 500.00,
			StatusID:      1,
			GuestID:  1,
		}

		ok, err := govalidator.ValidateStruct(order)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestInvalidOrdersInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing OrderDate", func(t *testing.T) {
		order := entity.Orders{
			OrderDate:   time.Time{},// ไม่มีค่าที่ถูกตั้ง
			TotalAmount: 500.00,
			StatusID:     1,
			GuestID:  1,
		}

		ok, err := govalidator.ValidateStruct(order)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("OrderDate is required"))
	})

	t.Run("should fail validation for missing TotalAmount", func(t *testing.T) {
		order := entity.Orders{
			OrderDate:   time.Now(),
			TotalAmount: 0.0,
			StatusID:      1,
			GuestID:  1,
		}

		ok, err := govalidator.ValidateStruct(order)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("TotalAmount is required"))
	})

	t.Run("should fail validation for missing GuestID", func(t *testing.T) {
		order := entity.Orders{
			OrderDate:   time.Now(),
			TotalAmount: 500.00,
			StatusID:      0,
			GuestID:  0,
		}

		ok, err := govalidator.ValidateStruct(order)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("GuestID is required"))
	})
}

func TestInvalidNegativeTotalAmount(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for negative TotalAmount", func(t *testing.T) {
		order := entity.Orders{
			OrderDate:   time.Now(),
			TotalAmount: -500.00,
			StatusID:    1,
			GuestID:  1,
		}

		ok, err := govalidator.ValidateStruct(order)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("TotalAmount must not be negative"))
	})
}
