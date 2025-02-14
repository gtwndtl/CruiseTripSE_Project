package entity


import "gorm.io/gorm"


type Weathers struct {

   gorm.Model

   Weather string `json:"weather"`

}