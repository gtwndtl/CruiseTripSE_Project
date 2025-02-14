package unit

import (
	"testing"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"team03/se67/entity"
)

func TestValidMenuOrderDetailMenuOptionsInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid Menu Item Options input", func(t *testing.T) {
		order_detail_menu_options := entity.OrderDetailMenuOptions{
			OrderDetailID: 		1,
			MenuItemOptionID:   1,
		}

		ok, err := govalidator.ValidateStruct(order_detail_menu_options)
		if !ok {
			t.Logf("Validation failed: %v", err)
		}
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestInvalidMenuOrderDetailMenuOptionsInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing OrderDetailID", func(t *testing.T) {
		order_detail_menu_options := entity.OrderDetailMenuOptions{
			OrderDetailID: 		0,
			MenuItemOptionID:   1,
		}

		ok, err := govalidator.ValidateStruct(order_detail_menu_options)
		g.Expect(ok).To(BeFalse()) // คาดหวังว่า validation จะล้มเหลว
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("OrderDetailID is required"))
	})

	t.Run("should fail validation for missing MenuItemOptionID", func(t *testing.T) {
		order_detail_menu_options := entity.OrderDetailMenuOptions{
			OrderDetailID: 		1,
			MenuItemOptionID:   0,
		}

		ok, err := govalidator.ValidateStruct(order_detail_menu_options)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("MenuItemOptionID is required"))
	})
}
