import React, { useEffect, useState } from 'react';
import './CruiseTrip.css';
import Header from '../../components/Header';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import PopupBookingTrip from '../popup_booking_trip/PopupBookingTrip';
import { CruiseTripInterface } from '../../../booking_activity/interfaces/ICruiseTrip';
import { GetCruiseTrips } from '../../../booking_activity/service/https/cruiseTrip';

function CruiseTrip() {
  const [cruisetrips, setCruiseTrips] = useState<CruiseTripInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [popup, setPopup] = useState<React.ReactNode>(null);
  const navigate = useNavigate();

  // Fetch cruise trips from the API
  async function getCruiseTrips() {
    const res = await GetCruiseTrips();
    if (res && res.status === 200) {
      setCruiseTrips(res.data);
    } else {
      messageApi.open({
        type: 'error',
        content: 'Failed to fetch cruise trips.',
      });
    }
  }

  // Handle booking confirmation (navigate to the guest form page)
  const handleBookingConfirmed = (numberOfGuests: number, tripID: number) => {
    navigate('/guestform', { state: { numberOfGuests, tripID } });
  };

  // Show the booking popup when a trip is selected
  function showPopup(trip: CruiseTripInterface) {
    setPopup(
      <PopupBookingTrip
        setPopup={setPopup}
        tripID={Number(trip.ID)}
        planName={trip.CruiseTripName || ''}
        // startDate={trip.StartDate || ''}
        // endDate={trip.EndDate || ''}
        startDate={trip.StartDate instanceof Date ? trip.StartDate.toISOString() : trip.StartDate || ''}
        endDate={trip.EndDate instanceof Date ? trip.EndDate.toISOString() : trip.EndDate || ''}
        price={Number(trip.PlanPrice)}
        description={trip.Deets || ''}
        onBookingConfirmed={(numberOfGuests) =>
        handleBookingConfirmed(numberOfGuests, Number(trip.ID))
        }
      />
    );
  }

  // Render the list of cruise trips
  const cruisetripElements = cruisetrips.map((trip, index) => (
    <div className="cruisetrip-container" key={index}>
      {contextHolder}
      <div className="img-trip">
        <img src={trip.PlanImg} alt="" />
      </div>
      <div className="detail-trip">
        <div className="trip-name">
          <h2>{trip.CruiseTripName}</h2>
        </div>
        <div className="description">{trip.Deets}</div>
        {/* <div className="departure-time">เวลาออกเดินทาง {trip.DepartureTime}</div> */}
        <div className="plan-price">
          <h4>ราคาเริ่มต้น <h1 style={{color: '#133e87'}}>฿{trip.PlanPrice?.toLocaleString() || '0'}</h1></h4>
        </div>
        <Button
          className="trip-btn"
          type="primary"
          onClick={() => showPopup(trip)}
        >
          จอง
        </Button>
      </div>
    </div>
  ));

  // Fetch cruise trips when the component mounts
  useEffect(() => {
    getCruiseTrips();
  }, []);

  return (
    <div className="container-cruisetrip">
      <Header />
      {popup}
      <div className="grid-container-trip">{cruisetripElements}</div>
    </div>
  );
}

export default CruiseTrip;