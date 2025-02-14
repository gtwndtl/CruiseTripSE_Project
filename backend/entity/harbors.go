package entity


import "gorm.io/gorm"


type Harbors struct {

   gorm.Model
   HarborName string `json:"harbor_name"`
   Country    string `json:"country"`

}