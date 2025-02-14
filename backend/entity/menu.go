package entity

import (
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)
 
 type Menus struct {
	gorm.Model
	MenuName       string `valid:"required~MenuName is required,unique_menu_name~MenuName must be unique"`
	Price          float64 `valid:"required~Price is required,price_positive~Price must not be negative"`
	Description    string `valid:"required~Description is required"`
	ImageMenu      string `gorm:"type:longtext" valid:"required~ImageMenu is required"`


	FoodCategoryID uint `valid:"required~FoodCategoryID is required"`
	FoodCategory   *FoodCategories `gorm:"foreignKey:FoodCategoryID" valid:"-"`
}

func init() {
	// Custom validation for unique MenuName
	govalidator.CustomTypeTagMap.Set("unique_menu_name", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		// Mock database check (replace with actual DB check logic)
		existingNames := []string{"Pizza", "Burger", "Pasta"}
		if name, ok := i.(string); ok {
			for _, existing := range existingNames {
				if name == existing {
					return false
				}
			}
		}
		return true
	}))

	// Custom validation for positive Price
	govalidator.CustomTypeTagMap.Set("price_positive", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		if price, ok := i.(float64); ok {
			return price >= 0
		}
		return false
	}))
}
