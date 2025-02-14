package unit

import (
	"testing"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"team03/se67/entity"
)

func TestValidMenuOptionsInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid MenuOptions input with non-zero ExtraPrice", func(t *testing.T) {
		menuOption := entity.MenuOptions{
			OptionName:  "Extra Cheese",
			OptionValue: "Cheese",
			ExtraPrice:  20.00,
		}

		ok, err := govalidator.ValidateStruct(menuOption)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run("should pass validation for valid MenuOptions input with zero ExtraPrice", func(t *testing.T) {
		menuOption := entity.MenuOptions{
			OptionName:  "No Extra Cheese",
			OptionValue: "None",
			ExtraPrice:  0.00,
		}

		ok, err := govalidator.ValidateStruct(menuOption)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestInvalidMenuOptionsInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing OptionName", func(t *testing.T) {
		menuOption := entity.MenuOptions{
			OptionName:  "",
			OptionValue: "Cheese",
			ExtraPrice:  20.00,
		}

		ok, err := govalidator.ValidateStruct(menuOption)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("OptionName is required"))
	})

	t.Run("should fail validation for missing OptionValue", func(t *testing.T) {
		menuOption := entity.MenuOptions{
			OptionName:  "Extra Cheese",
			OptionValue: "",
			ExtraPrice:  20.00,
		}

		ok, err := govalidator.ValidateStruct(menuOption)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("OptionValue is required"))
	})
}

func TestInvalidNegativeExtraPriceInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for negative ExtraPrice", func(t *testing.T) {
		menuOption := entity.MenuOptions{
			OptionName:  "Extra Cheese",
			OptionValue: "Cheese",
			ExtraPrice:  -5.00,
		}

		ok, err := govalidator.ValidateStruct(menuOption)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("ExtraPrice must not be negative"))
	})
}