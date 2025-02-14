import { useEffect, useState } from "react";
import { Spin } from "antd";
import "swiper/swiper-bundle.css";
import "./ReviewTripShow.css";
import { GetBookingTripById, GetCruiseTripById, GetReviews } from "../../../service/ReviewAPI";
import { GetUsersById } from "../../../../services/https";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import sea from "../../../../assets/sea.jpg";

export default function ReviewTripShow() {
  const [reviewedFoodItems, setReviewedFoodItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนเส้นทาง

  const handleSeeAllClick = () => {
    navigate("/reviews/trip"); // เปลี่ยนเส้นทางไปยัง "/reviews/trip"
  };

  const fetchData = async () => {
    try {
      const [reviews] = await Promise.all([GetReviews()]);
      const enrichedReviews = (
        await Promise.all(
          reviews.data
            .filter((review: { review_type_id: number }) => review.review_type_id === 1)
            .map(async (review: { customer_id: number; booking_trip_id: number }) => {
              const userResponse = await GetUsersById(review.customer_id);
              const bookingTripResponse = await GetBookingTripById(review.booking_trip_id);

              if (userResponse.status !== 200 || bookingTripResponse.status !== 200) {
                throw new Error("Failed to fetch user or booking trip details.");
              }

              const cruiseTripResponse = await GetCruiseTripById(
                bookingTripResponse.data.CruiseTripID
              );

              return {
                ...review,
                user: userResponse.data,
                bookingTrip: bookingTripResponse.data,
                cruiseTrip: cruiseTripResponse.status === 200 ? cruiseTripResponse.data : null,
              };
            })
        )
      ).slice(0, 10); // จำกัดจำนวนรีวิวที่แสดง 10 อัน
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

  const fakeCardData = [
    {
      cruiseTripName: "Caribbean Explorer",
      reviewText: "The Caribbean Explorer was a fantastic experience! The staff was friendly, the food was amazing, and the views were breathtaking.",
      author: "Sophia Smith",
      image: "https://travelbird-images.imgix.net/93/fe/93fedde2fbe77cc24edd0a52660ed8d4?auto=compress%2Cformat&crop=faces%2Cedges%2Ccenter&fit=crop&h=450&w=675",
    },
    {
      cruiseTripName: "Alaskan Adventure",
      reviewText: "A wonderful trip to Alaska! The glaciers were stunning, and the wildlife sightings were unforgettable. Highly recommended!",
      author: "Liam Johnson",
      image: "https://s3.amazonaws.com/a-us.storyblok.com/f/1005231/263ffee2c8/holland-america-line_alaska_18740428.jpg",
    },
    {
      cruiseTripName: "Mediterranean Delight",
      reviewText: "The Mediterranean cruise was the trip of a lifetime. The ancient sites and the local cuisines were beyond amazing.",
      author: "Olivia Brown",
      image: "https://assets.goaaa.com/image/upload/w_1600,h_1100,c_fill,q_auto:best,f_auto/legacy/files/c6e7abdc-f784-4dd5-9673-538e2385df93/cruises-hero-banner.jpg",
    },
    {
      cruiseTripName: "Pacific Paradise",
      reviewText: "Sailing through the Pacific was so relaxing. The crystal-clear waters and the island stops were pure magic.",
      author: "Noah Williams",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH9wCGEi3FN2y-8UmVv8qqDyNEREnBdggJNQ&s",
    },
    {
      cruiseTripName: "Scandinavian Fjords",
      reviewText: "This cruise was a dream come true. The fjords were absolutely stunning, and the ship's amenities were top-notch.",
      author: "Ava Jones",
      image: "https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2Fe2e06e85-e19f-4022-9f0e-bffd26a6f222.jpg?crop=2560%2C1567%2C0%2C0",
    },
    {
      cruiseTripName: "Great Barrier Reef Explorer",
      reviewText: "The underwater sights were incredible. The coral reefs and marine life made this trip unforgettable.",
      author: "Ethan Garcia",
      image: "https://cdn.getyourguide.com/img/tour/f9cae06fe9b8bebdd64abf9dee31154b231b1a680760e48d4ee7c402fe9210c0.jpg/99.jpg",
    },
    {
      cruiseTripName: "Baltic Treasures",
      reviewText: "Exploring the Baltic cities was a cultural delight. The mix of history and modern life was captivating.",
      author: "Emma Miller",
      image: "https://www.peregrinetraveladelaide.com.au/wp-content/uploads/2020/06/Main%20Image%20-%20BAHNC.jpg",
    },
    {
      cruiseTripName: "Amazon River Voyage",
      reviewText: "An incredible adventure! The lush greenery and wildlife along the Amazon were awe-inspiring.",
      author: "Mason Davis",
      image: "https://robbreport.com/wp-content/uploads/2020/03/4572_50033-1.jpg?w=1000",
    },
    {
      cruiseTripName: "Hawaiian Escape",
      reviewText: "The Hawaiian cruise was paradise on earth. The beaches, volcanoes, and sunsets were picture-perfect.",
      author: "Amelia Wilson",
      image: "https://content.api.news/v3/images/bin/b3602383db464cc910cf9eb8d2714d74",
    },
    {
      cruiseTripName: "Antarctic Expedition",
      reviewText: "A unique experience in the coldest place on Earth. The icebergs and penguins were absolutely amazing.",
      author: "Lucas Taylor",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxoQTUb4u3VQnQLH1B4r3Uhq3fWQLtLAYFXA&s",
    },
  ];



  return (
    <div className="review-trip-card-container" id="review-trip-card-section">
      <div className="top-section">
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "#000",
            marginBottom: "24px",
            lineHeight: "1.2",
            fontFamily: "'San Francisco', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            textAlign: "center",
          }}
        >
          Experiences That Inspire
        </h1>
        <p className="quote">"Real stories from real travelers about their unforgettable journeys"</p>
      </div>
      {isLoading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <Swiper
          grabCursor={true}
          loop={true}
          autoplay={{
            delay: 1000, // เลื่อนอัตโนมัติทุก 1 วินาที
            disableOnInteraction: false,
          }}
          speed={2000} // ความเร็วในการเลื่อน
          spaceBetween={20} // ระยะห่างระหว่างการ์ด
          slidesPerView="auto" // ขนาดการ์ดปรับอัตโนมัติ
          modules={[Autoplay]} // ใช้ Autoplay module
          className="review-trip-card-swiper"
        >
          {Array.from({ length: 10 }).map((_, index) => {
            const review = reviewedFoodItems[index] || fakeCardData[index - reviewedFoodItems.length]; // ใช้ข้อมูลจริงก่อน แล้วเติม Fake Card หากไม่มีข้อมูล

            return (
              <SwiperSlide
                key={index}
                style={{
                  flex: "0 0 20%", // ให้การ์ดมีความกว้าง 20% ของหน้าจอ
                  maxWidth: "20%", // จำกัดความกว้างสูงสุด
                }}
              >
                <div
                  className="review-trip-card"
                  style={{
                    backgroundImage: `url(${review?.image ||
                      (review.pictures && review.pictures.length > 0
                        ? review.pictures[0]
                        : sea)
                      })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "500px",
                    display: "flex",
                    flexDirection: "column",
                    padding: "15px",
                    color: "#fff",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      padding: "10px",
                      background: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "10px",
                    }}
                  >
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                      {review.cruiseTripName || review.cruiseTrip?.CruiseTripName || "Unknown Trip"}
                    </h3>
                    <p className="trip-review-text">
                      "{review.reviewText || review.review_text}"
                    </p>

                    <p style={{ fontSize: "12px", textAlign: "right", color: "#ccc" }}>
                      By {review.author || `${review.user?.first_name} ${review.user?.last_name}` || "Anonymous"}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="cta" onClick={handleSeeAllClick}>
          <span className="hover-underline-animation"> See all </span>
          <svg
            id="arrow-horizontal"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="10"
            viewBox="0 0 46 16"
          >
            <path
              id="Path_10"
              data-name="Path 10"
              d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
              transform="translate(30)"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
