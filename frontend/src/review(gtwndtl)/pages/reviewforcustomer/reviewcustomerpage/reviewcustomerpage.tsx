import UserInfo from "../userinfo/userinfo";
import './reviewcustomerpage.css';
import NavBarReview from "../navbarreview/navbarreview";
import { useEffect, useState } from "react";
import NavbarLandingPage from "../../../../navbar(gtwndtl)/home_navbar/NavbarLandingPage";
import NotLoggedInPage from "../../../../unauthorized_access(gtwndtl)/NotLoggedInPage";
import Loader from "../../../../components/third-party/Loader"; // นำเข้า Loader

export default function ReviewForCustomerPage() {
  // ตรวจสอบสถานะการล็อกอินจาก localStorage
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(
    localStorage.getItem("isCustomerLogin") === "true"
  );

  // สถานะสำหรับควบคุมการแสดง Loader
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // ตรวจสอบและอัปเดตสถานะเมื่อ localStorage เปลี่ยน
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isCustomerLogin") === "true";
      setIsCustomerLoggedIn(loginStatus);
    };

    // เพิ่ม event listener เพื่อจับการเปลี่ยนแปลงของ localStorage
    window.addEventListener("storage", checkLoginStatus);

    // Cleanup event listener เมื่อ component ถูก unmount
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // รีเฟรชหน้าทุกครั้งที่เข้าหน้านี้
  useEffect(() => {
    const refreshed = localStorage.getItem("refreshed_review");

    if (refreshed !== "false") {
      setIsRefreshing(true); // แสดง Loader ก่อนรีเฟรช
      localStorage.setItem("refreshed_review", "true");

      setTimeout(() => {
        window.location.reload(); // บังคับรีเฟรชหน้า
      }, 500); // ตั้งเวลารีเฟรชหลังจากแสดง Loader สักครู่
    }

    // เคลียร์สถานะรีเฟรชเมื่อผู้ใช้ออกจากหน้านี้
    return () => {
      localStorage.setItem("refreshed_review", "false");
    };
  }, []);

  // หากกำลังรีเฟรช แสดง Loader
  if (isRefreshing) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  return (
    <section className="reviewforcustomercontent" id="reviewforcustomercontent">
      {isCustomerLoggedIn ? (
        <>
          <NavbarLandingPage />
          <div className="left-content">
            <UserInfo />
            <div className="right-content">
              <NavBarReview />
            </div>
          </div>
        </>
      ) : (
        <NotLoggedInPage />
      )}
    </section>
  );
}
