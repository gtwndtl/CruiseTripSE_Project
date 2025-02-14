package unit

import (
	"testing"
	"time"

	"team03/se67/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestValidReview(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run(`Valid`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			CustomerID:             1,
			GuestID:                1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestReviewRequired(t *testing.T) {
	g := NewGomegaWithT(t)
	date, _ := time.Parse("2006-01-02", "2024-01-01")
	t.Run(`Review_date is required`, func(t *testing.T) {
		review := entity.Review{
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			CustomerID:             1,
			GuestID:                1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Review_date is required"))
	})
	t.Run(`Review_text is required`, func(t *testing.T) {
		review := entity.Review{
			Review_date:            date,
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			GuestID:                1,
			CustomerID:             1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Review_text is required"))
	})
	t.Run(`Service_rating is required`, func(t *testing.T) {
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			CustomerID:             1,
			GuestID:                1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Service_rating is required"))
	})
	t.Run(`Value_for_money_rating is required`, func(t *testing.T) {
		review := entity.Review{
			Review_date:          date,
			Review_text:          "อร่อย",
			Service_rating:       5.0,
			Taste_rating:         5.0,
			Cabin_rating:         5.0,
			Overall_rating:       5.0,
			Recommended_dishes:   "Steak",
			ReviewTypeID:         1,
			OrderID:              1,
			FoodServicePaymentID: 1,
			BookingTripID:        1,
			TripPaymentID:        1,
			GuestID:                1,
			CustomerID:           1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Value_for_money_rating is required"))
	})
	t.Run(`Taste_rating is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			GuestID:                1,
			CustomerID:             1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Taste_rating is required"))
	})
	t.Run(`Cabin_rating is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			GuestID:                1,
			CustomerID:             1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Cabin_rating is required"))
	})
	t.Run(`Overall_rating is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			CustomerID:             1,
			GuestID:                1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Overall_rating is required"))
	})
	t.Run(`Recommended_dishes is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			GuestID:                1,
			CustomerID:             1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Recommended_dishes is required"))
	})
	t.Run(`ReviewTypeID is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			GuestID:                1,
			CustomerID:             1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("ReviewTypeID is required"))
	})
	t.Run(`OrderID is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			GuestID:                1,
			TripPaymentID:          1,
			CustomerID:             1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("OrderID is required"))
	})
	t.Run(`FoodServicePaymentID is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			BookingTripID:          1,
			TripPaymentID:          1,
			CustomerID:             1,
			GuestID:                1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("FoodServicePaymentID is required"))
	})
	t.Run(`BookingTripID is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			TripPaymentID:          1,
			CustomerID:             1,
			GuestID:                1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("BookingTripID is required"))
	})
	t.Run(`TripPaymentID is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			CustomerID:             1,
			GuestID:                1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("TripPaymentID is required"))
	})
	t.Run(`CustomerID is required`, func(t *testing.T) {
		date, _ := time.Parse("2006-01-02", "2024-01-01")
		review := entity.Review{
			Review_date:            date,
			Review_text:            "อร่อย",
			Service_rating:         5.0,
			Value_for_money_rating: 5.0,
			Taste_rating:           5.0,
			Cabin_rating:           5.0,
			Overall_rating:         5.0,
			Recommended_dishes:     "Steak",
			ReviewTypeID:           1,
			OrderID:                1,
			FoodServicePaymentID:   1,
			BookingTripID:          1,
			TripPaymentID:          1,
			GuestID:                1,
		}
		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("CustomerID is required"))
	})
}
