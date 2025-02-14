import React, { useState } from 'react';
import { Button, message, InputNumber } from 'antd';
import './PopupBookingTrip.css';
import { useNavigate } from 'react-router-dom';

interface PopupBookingTripProps {
  setPopup: (value: React.ReactNode) => void;
  tripID: number;
  planName: string;
  startDate: string;
  endDate: string;
  price: number;
  description: string;
  onBookingConfirmed: (numberOfGuests: number) => void;
}

function PopupBookingTrip({
  setPopup,
  tripID,
  planName,
  startDate,
  endDate,
  price,
  description,
}: PopupBookingTripProps) {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1); // Default to 1 guest

  // Function to close the popup
  function closePopup() {
    setPopup(null);
  }

  // Function to handle booking
  async function BookingTrip() {
    const customerID = localStorage.getItem('id');

    try {
      // setIsButtonDisabled(true); // Disable the button to prevent multiple submissions
      // console.log('Booking Data:', data);
      navigate('/guestform', {
        state: {
          tripID,
          numberOfGuests,
          customerID, 
          planName,
          startDate,
          endDate,
          price,
        },
      });
    } catch (error) {
      console.error('Error creating booking trip:', error);
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลการจองทริป');
    } finally {
        setIsButtonDisabled(false); // Enable the button after the request completes
    }
  }

  return (
    <div className="popup-container" onClick={closePopup}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <div className="detail-box">
          <h3>ยืนยันการจองทริป</h3>
          <table>
            <tbody>
              <tr>
                <td className="sub-t">ชื่อทริป</td>
                <td>{planName}</td>
              </tr>
              <tr>
                <td className="sub-t">วันเริ่มต้นการเดินทาง</td>
                <td>{new Date(startDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="sub-t">วันสิ้นสุดการเดินทาง</td>
                <td>{new Date(endDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="sub-t">ราคาเริ่มต้น</td>
                <td>{price?.toLocaleString('th-TH', { style: 'decimal', minimumFractionDigits: 0 })} บาท</td>
              </tr>
              <tr>
                <td className="sub-t">รายละเอียด</td>
                <td>{description}</td>
              </tr>
              <tr>
                <td className="sub-t">จำนวนผู้โดยสาร</td>
                <td>
                  <InputNumber
                    min={1}
                    max={4}
                    value={numberOfGuests}
                    onChange={(value) => setNumberOfGuests(value || 1)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="btn-box">
            <Button
              className="confirm-btn"
              type="primary"
              disabled={isButtonDisabled}
              onClick={BookingTrip}
            >
              ยืนยัน
            </Button>
            <Button className="cancel-btn" onClick={closePopup}>
              ยกเลิก
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupBookingTrip;