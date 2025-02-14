package unit

import (
	"testing"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"team03/se67/entity"
)

func TestValidMenuItemOptionsInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid Menu Item Options input", func(t *testing.T) {
		menu_item_options := entity.MenuItemOptions{
			MenuID: 		1,
			MenuOptionID:   1,
		}

		ok, err := govalidator.ValidateStruct(menu_item_options)
		if !ok {
			t.Logf("Validation failed: %v", err)
		}
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestInvalidMenuItemOptionsInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing MenuID", func(t *testing.T) {
		menu_item_options := entity.MenuItemOptions{
			MenuID: 		0,
			MenuOptionID:   1,
		}

		ok, err := govalidator.ValidateStruct(menu_item_options)
		g.Expect(ok).To(BeFalse()) // คาดหวังว่า validation จะล้มเหลว
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("MenuID is required"))
	})

	t.Run("should fail validation for missing MenuOptionID", func(t *testing.T) {
		menu_item_options := entity.MenuItemOptions{
			MenuID: 		1,
			MenuOptionID:   0,
		}

		ok, err := govalidator.ValidateStruct(menu_item_options)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("MenuOptionID is required"))
	})
}
