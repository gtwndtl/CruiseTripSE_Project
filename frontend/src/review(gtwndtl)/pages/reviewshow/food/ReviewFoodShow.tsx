import { useEffect, useState } from "react";
import { Avatar, Rate, Spin } from "antd";
import dayjs from "dayjs";
import "swiper/swiper-bundle.css"; // Swiper CSS
import "./ReviewFoodShow.css"; // External CSS
import { GetReviews } from "../../../service/ReviewAPI";
import { GetUsersById } from "../../../../services/https";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, Mousewheel, EffectCoverflow, Autoplay } from "swiper/modules"; // Import Autoplay
import { useNavigate } from "react-router-dom";
import no_profile from "../../../../assets/no_profile.png"

export default function ReviewFoodShow() {
  const [reviewedFoodItems, setReviewedFoodItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [reviews] = await Promise.all([GetReviews()]);
      if ([reviews].some((response) => response.status !== 200)) {
        throw new Error("Failed to fetch necessary data.");
      }
      const enrichedReviews = (
        await Promise.all(
          reviews.data
            .filter((review: { review_type_id: number }) => review.review_type_id === 2) // กรองเฉพาะ review_type_id === 2
            .map(async (review: { customer_id: number; order_id: any }) => {
              const userResponse = await GetUsersById(review.customer_id);
              if (userResponse.status !== 200) {
                throw new Error("Failed to fetch user details.");
              }
              return {
                ...review,
                user: userResponse.data,
              };
            })
        )
      ).slice(0, 10); // จำกัดการ fetch แค่ 10 รีวิว
      setReviewedFoodItems(enrichedReviews);
    } catch (error) {
      console.error("Error fetching reviewed items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate(); // ใช้ useNavigate เพื่อเปลี่ยนเส้นทาง
  const handleSeeAllButtonClick = () => {
    navigate("/reviews/food-service"); // กำหนดเส้นทางเมื่อกดปุ่ม
  };

  const fakeCardData = [
    {
      user: {
        first_name: "Sophia",
        last_name: "Smith",
      },
      review_text: "The Caesar Salad was crisp and flavorful, the Margherita Pizza had a thin, crispy crust with fragrant tomato sauce and melted cheese, and the Green Tea Latte was mildly sweet with a strong matcha aroma. A light and satisfying meal!",
      review_date: dayjs().subtract(1, "day").toISOString(),
      overall_rating: 5,
      pictures: [
        "https://kristineskitchenblog.com/wp-content/uploads/2024/07/margherita-pizza-22-2.jpg",
        "https://itsavegworldafterall.com/wp-content/uploads/2023/04/Avocado-Caesar-Salad-FI.jpg",
        "https://munchingwithmariyah.com/wp-content/uploads/2020/06/IMG_0748.jpg",
      ],
    },
    {
      user: {
        first_name: "Liam",
        last_name: "Johnson",
      },
      review_text: "The steak was juicy and perfectly cooked, paired with bold and tangy Tom Yum Soup. The Chocolate Cake was rich and indulgent. A fantastic combination of savory and sweet!",
      review_date: dayjs().subtract(2, "day").toISOString(),
      overall_rating: 4.5,
      pictures: [
        "https://sallysbakingaddiction.com/wp-content/uploads/2013/04/triple-chocolate-cake-4.jpg",
        "https://natashaskitchen.com/wp-content/uploads/2020/03/Pan-Seared-Steak-4-728x1092.jpg",
      ],
    },
    {
      user: {
        first_name: "Olivia",
        last_name: "Brown",
      },
      review_text: "Fried Chicken Wings were crispy and flavorful, French Fries were hot and crispy, and the Latte balanced the meal perfectly. A satisfying and budget-friendly set!",
      review_date: dayjs().subtract(3, "day").toISOString(),
      overall_rating: 5,
      pictures: [
        "https://jesspryles.com/wp-content/uploads/2018/01/korean-fried-chicken-32.jpg",],
    },
    {
      user: {
        first_name: "Noah",
        last_name: "Williams",
      },
      review_text: "The sushi was incredibly fresh with high-quality ingredients, paired wonderfully with the Green Tea Latte. A simple yet special meal!",
      review_date: dayjs().subtract(4, "day").toISOString(),
      overall_rating: 4,
      pictures: [
        "https://img.freepik.com/premium-photo/sushi-set-served-with-traditional-soy-sauce-wasabi-ginger-japanese-cuisine-ai-generated_871188-1000.jpg",
        "https://primulaproducts.com/cdn/shop/articles/jackieo_Youve_been_drinking_matcha_green_tea_latte_for_a_few_w_f5899c8d-f20b-4331-b1a8-d1eb1736d367_900x.png?v=1687789713",
      ],
    },
    {
      user: {
        first_name: "Ava",
        last_name: "Jones",
      },
      review_text: "The Spaghetti Carbonara was creamy and flavorful, the Grilled Salmon was tender and perfectly cooked, and the Latte provided a smooth finish. A highly impressive and worthwhile combination!",
      review_date: dayjs().subtract(5, "day").toISOString(),
      overall_rating: 5,
      pictures: [
        "https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg", "https://www.thecookierookie.com/wp-content/uploads/2023/05/featured-grilled-salmon-recipe.jpg"
      ],
    },
    {
      user: {
        first_name: "Ethan",
        last_name: "Garcia",
      },
      review_text: "The chicken wings were crispy and freshly cooked, the Orange Juice was refreshing, and the Chocolate Cake was rich and indulgent. A great mix of savory and sweet!",
      review_date: dayjs().subtract(6, "day").toISOString(),
      overall_rating: 4.5,
      pictures: [
        "https://www.foodandwine.com/thmb/NXUBQ0yUtxxf_jbUlhCMLXW9QD4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/FAW-recipes-crispy-chicken-wings-hero-02-6d627c282d3f4749a176e0ec34d2d6d7.jpg"
      ],
    },
    {
      user: {
        first_name: "Emma",
        last_name: "Miller",
      },
      review_text: "The stir-fried vegetables were fresh and well-seasoned, paired with a smooth Latte for a light and balanced meal. Perfect for a relaxing day!",
      review_date: dayjs().subtract(7, "day").toISOString(),
      overall_rating: 4.8,
      pictures: [
        "https://kristineskitchenblog.com/wp-content/uploads/2024/01/vegetable-stir-fry-22-3.jpg"
      ],
    },
    {
      user: {
        first_name: "Mason",
        last_name: "Davis",
      },
      review_text: "Margherita Pizza and authentic Tom Yum Soup made an excellent combination, while the Mango Sticky Rice offered a deliciously sweet ending. A great balance of flavors!",
      review_date: dayjs().subtract(8, "day").toISOString(),
      overall_rating: 5,
      pictures: [
        "https://www.acouplecooks.com/wp-content/uploads/2022/10/Margherita-Pizza-093.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqzYRF9mYxswj1BsFSHEBUBY1Eg5D042eZUw&s", "https://hot-thai-kitchen.com/wp-content/uploads/2014/02/rainbow-mango-sticky-rice-sq.jpg"
      ],
    },
    {
      user: {
        first_name: "Amelia",
        last_name: "Wilson",
      },
      review_text: "Grilled Salmon was perfectly cooked and flavorful, paired with a fresh Caesar Salad and refreshing Orange Juice. A healthy and satisfying meal!",
      review_date: dayjs().subtract(9, "day").toISOString(),
      overall_rating: 4.7,
      pictures: [
        "https://static.vecteezy.com/system/resources/previews/035/675/740/non_2x/ai-generated-grilled-salmon-free-png.png", "https://www.healthifyme.com/blog/wp-content/uploads/2022/01/cropped-Orange-Juice-1-1.jpg"
      ],
    },
    {
      user: {
        first_name: "Lucas",
        last_name: "Taylor",
      },
      review_text: "The sushi was incredibly fresh with high-quality ingredients, paired wonderfully with the Green Tea Latte. A simple yet special meal!",
      review_date: dayjs().subtract(10, "day").toISOString(),
      overall_rating: 4.9,
      pictures: [
        "https://img.freepik.com/premium-photo/sushi-set-served-with-traditional-soy-sauce-wasabi-ginger-japanese-cuisine-ai-generated_871188-1000.jpg", "https://primulaproducts.com/cdn/shop/articles/jackieo_Youve_been_drinking_matcha_green_tea_latte_for_a_few_w_f5899c8d-f20b-4331-b1a8-d1eb1736d367_900x.png?v=1687789713"
      ],
    },
  ];



  return (
    <div className="review-container" id="review-section">
      {/* Left Section */}
      <div className="left-section">
        <h1 className="title">Savor the Moments</h1>
        <p className="quote">"Great things never come from comfort zones"</p>
        <p className="subtitle">
          Discover what our customers say about their experience with our exquisite dishes.
        </p>
        <button className="new-button" onClick={handleSeeAllButtonClick}>
          <span className="new-button-content">See All Reviews</span>
        </button>
      </div>
      {/* Right Section */}
      <div className="right-section">
        {isLoading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true} // Enable infinite looping
            spaceBetween={30}
            autoplay={{
              delay: 3000, // Set the delay between transitions (in milliseconds)
              disableOnInteraction: false, // Ensure autoplay continues after user interaction
            }}
            pagination={{
              clickable: true, // Allow pagination dots to be clickable
            }}
            keyboard={{ enabled: true }}
            mousewheel={true}
            modules={[EffectCoverflow, Pagination, Keyboard, Mousewheel, Autoplay]} // Include Autoplay module
            coverflowEffect={{
              rotate: 10,
              stretch: 20,
              depth: 200,
              modifier: 1,
              slideShadows: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 3 }, // Show 3 slides at a time for larger screens
            }}
            className="review-swiper"
          >
            {Array.from({ length: 10 }).map((_, index) => {
              const review =
                reviewedFoodItems[index] || fakeCardData[index]; // ใช้ข้อมูลจริงก่อน ถ้าไม่มีใช้ Fake Card

              return (
                <SwiperSlide key={index}>
                  <div className="review-card">
                    <div className="review-header">
                      <Avatar
                        src={review.user.picture || no_profile}
                        size={60}
                        className="review-avatar"
                        alt={`${review.user.first_name} ${review.user.last_name}`}
                      />
                      <div className="review-info">
                        <h3 className="reviewer-name">{`${review.user.first_name} ${review.user.last_name}`}</h3>
                        <Rate
                          allowHalf
                          disabled
                          defaultValue={review.overall_rating}
                          className="review-rating"
                        />
                      </div>
                    </div>
                    <div className="review-content">
                      <p className="review-text">"{review.review_text}"</p>
                      <p className="review-date">
                        Reviewed on {dayjs(review.review_date).format("MMMM D, YYYY")}
                      </p>
                    </div>
                    {/* Pictures Section */}
                    <div
                      className={`review-pictures ${review.pictures?.length === 1
                        ? "one"
                        : review.pictures?.length === 2
                          ? "two"
                          : "three"
                        }`}
                    >
                      {review.pictures && review.pictures.length > 0 ? (
                        review.pictures.map((pic: string, idx: number) => (
                          <div key={idx} className="picture-wrapper">
                            <img
                              src={pic}
                              alt={`Review Pic ${idx + 1}`}
                              className="review-picture"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="no-pictures">No pictures available</p>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
}
