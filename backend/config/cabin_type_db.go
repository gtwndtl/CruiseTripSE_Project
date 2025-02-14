package config

import (
	"team03/se67/entity"
)

func SetupCabinTypeDatabase() {
	db.AutoMigrate(
		&entity.CabinType{},
	)
	
	// Create CabinType
	cabinTypes := []*entity.CabinType{
		{
			TypeName: "Interior",
			CabinPrice: 29000,
			Cabinsize: 166,
			Image: "https://i.pinimg.com/736x/62/e2/53/62e253823ac09e1ae14b2c0a0b5da72b.jpg",
		},
		{
			TypeName: "Oceanview",
			CabinPrice: 33000,
			Cabinsize: 182,
			Image: "https://i.pinimg.com/736x/1a/02/c8/1a02c8fb8007244a53e70fc77170fa9e.jpg",
		},
		{
			TypeName: "Balcony",
			CabinPrice: 37000,
			Cabinsize: 198,
			Image: "https://i.pinimg.com/736x/cd/44/1f/cd441f77b3d8091e6a55749bea50de03.jpg",
		},
		{
			TypeName: "Suite",
			CabinPrice: 65000,
			Cabinsize: 276,
			Image: "https://i.pinimg.com/736x/0a/86/a1/0a86a1ac18185bc80d45c7eca8f6ed16.jpg",
		},
	}

	for _, cabinType := range cabinTypes {
		db.FirstOrCreate(cabinType, &entity.CabinType{
			TypeName: cabinType.TypeName,
		})
	}
}