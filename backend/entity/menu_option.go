package entity

import (
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)
 
type MenuOptions struct {
    gorm.Model
    OptionName  string  `valid:"required~OptionName is required"`
    OptionValue string  `valid:"required~OptionValue is required"`
    ExtraPrice  float64 `valid:"extra_price_check~ExtraPrice must not be negative"`
}

func init() {
    govalidator.CustomTypeTagMap.Set("extra_price_check", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
        if price, ok := i.(float64); ok {
            return price >= 0
        }
        return false
    }))
}
