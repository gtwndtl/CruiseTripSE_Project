package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"team03/se67/entity"
)

func TestValidFoodCategoriesInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should pass validation for valid FoodCategories input with valid image URL", func(t *testing.T) {
		foodCategory := entity.FoodCategories{
			FoodCategoryName:  "Chinese Food",
			FoodCategoryImage: "http://example.com/image.png",
		}

		ok, err := govalidator.ValidateStruct(foodCategory)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestInvalidFoodCategoriesInput(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("should fail validation for missing FoodCategoryName", func(t *testing.T) {
		foodCategory := entity.FoodCategories{
			FoodCategoryName:  "",
			FoodCategoryImage: "http://example.com/image.png",
		}

		ok, err := govalidator.ValidateStruct(foodCategory)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("FoodCategoryName is required"))
	})

	t.Run("should fail validation for missing FoodCategoryImage", func(t *testing.T) {
		foodCategory := entity.FoodCategories{
			FoodCategoryName:  "Western Food",
			FoodCategoryImage: "",
		}

		ok, err := govalidator.ValidateStruct(foodCategory)
		g.Expect(ok).To(BeFalse())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("FoodCategoryImage is required"))
	})
}
