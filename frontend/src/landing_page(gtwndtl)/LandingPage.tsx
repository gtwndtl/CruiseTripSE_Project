import { useState, useEffect } from 'react';
import './LandingPage.css';
import ReviewTripShow from '../review(gtwndtl)/pages/reviewshow/trip/ReviewTripShow';
import NavbarLandingPage from '../navbar(gtwndtl)/home_navbar/NavbarLandingPage';
import Home from './home/home';
import Loader from '../components/third-party/Loader';
import FooterLandingPage from './footer_landing_page/FooterLandingPage';

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // จำลองการโหลดข้อมูล เช่น การดึงข้อมูลจาก API
    const timer = setTimeout(() => {
      setIsLoading(false); // ปิดการโหลดเมื่อข้อมูลเสร็จสมบูรณ์
    }, 1000); // เวลาโหลดจำลอง 2 วินาที

    // Cleanup timer เมื่อ component ถูก unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {isLoading ? (
        // แสดง Loader ระหว่างการโหลด
        <Loader />
      ) : (
        <>
          <NavbarLandingPage />
          <div className="home">
            <Home />
          </div>
          <div className="review-trip-show">
            <ReviewTripShow />
          </div>
          <div><FooterLandingPage /></div>
        </>
      )}
    </div>
  );
};

export default LandingPage;
