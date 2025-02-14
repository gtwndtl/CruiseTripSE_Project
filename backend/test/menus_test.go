package unit

import (
	"testing"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"team03/se67/entity"
)

func TestValidMenusInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid Menus input", func(t *testing.T) {
		menu := entity.Menus{
			MenuName:       "Sushi",
			Price:          250.00,
			Description:    "Delicious Sushi",
			ImageMenu:      "http://example.com/image.png",
			FoodCategoryID: 1,
		}

		ok, err := govalidator.ValidateStruct(menu)
		if !ok {
			t.Logf("Validation failed: %v", err)
		}
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestInvalidMenusInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing MenuName", func(t *testing.T) {
		menu := entity.Menus{
			MenuName:       "",
			Price:          250.00,
			Description:    "Delicious Sushi",
			ImageMenu:      "http://example.com/image.png",
			FoodCategoryID: 1,
		}

		ok, err := govalidator.ValidateStruct(menu)
		g.Expect(ok).To(BeFalse()) // คาดหวังว่า validation จะล้มเหลว
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("MenuName is required"))
	})

	t.Run("should fail validation for missing Price", func(t *testing.T) {
		menu := entity.Menus{
			MenuName:       "Sushi",
			Price:          0,
			Description:    "Delicious Sushi",
			ImageMenu:      "http://example.com/image.png",
			FoodCategoryID: 1,
		}

		ok, err := govalidator.ValidateStruct(menu)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Price is required"))
	})

	t.Run("should fail validation for missing Description", func(t *testing.T) {
		menu := entity.Menus{
			MenuName:       "Sushi",
			Price:          250.00,
			Description:    "",
			ImageMenu:      "http://example.com/image.png",
			FoodCategoryID: 1,
		}

		ok, err := govalidator.ValidateStruct(menu)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Description is required"))
	})

	t.Run("should fail validation for missing ImageMenu", func(t *testing.T) {
		menu := entity.Menus{
			MenuName:       "Sushi",
			Price:          250.00,
			Description:    "Delicious Sushi",
			ImageMenu:      "",
			FoodCategoryID: 1,
		}

		ok, err := govalidator.ValidateStruct(menu)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("ImageMenu is required"))
	})

	t.Run("should fail validation for missing FoodCategoryID", func(t *testing.T) {
		menu := entity.Menus{
			MenuName:       "Sushi",
			Price:          250.00,
			Description:    "Delicious Sushi",
			ImageMenu:      "http://example.com/image.png",
			FoodCategoryID: 0,
		}

		ok, err := govalidator.ValidateStruct(menu)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("FoodCategoryID is required"))
	})
}

func TestMenuNameUnique(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for duplicate MenuName", func(t *testing.T) {
		menu := entity.Menus{
			MenuName:       "Pizza", // Duplicate MenuName
			Price:          250.00,
			Description:    "Delicious Sushi",
			ImageMenu:      "http://example.com/image.png",
			FoodCategoryID: 1,
		}

		ok, err := govalidator.ValidateStruct(menu)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("MenuName must be unique"))
	})
}

func TestPriceNegativePositive(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for negative Price", func(t *testing.T) {
		menu := entity.Menus{
			MenuName:       "New Dish",
			Price:          -50.00, // Negative Price
			Description:    "Test dish with negative price",
			ImageMenu:      "http://example.com/image.png",
			FoodCategoryID: 1,
		}

		ok, err := govalidator.ValidateStruct(menu)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Price must not be negative"))
	})
}
