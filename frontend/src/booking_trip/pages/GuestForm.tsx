import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Input, Form, Col, Row, Select, message, DatePicker, InputNumber, Card, Divider } from 'antd';
import Header from '../components/Header';
import { GendersInterface } from '../../interfaces/Gender';
import { CreateBookingTrip, CreateGuest } from '../service/https';
import { GetGender } from '../../services/https';

function GuestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tripID, numberOfGuests, price, customerID } = location.state;
  console.log("Received numberOfGuests:", numberOfGuests);

  const [guestInfo, setGuestInfo] = useState(
    Array(numberOfGuests).fill({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      birthday: '',
      address: '',
      age: null,
      genderID: null,
      bookingtripID: null,
    })
  );
  const [genderOptions, setGenderOptions] = useState<GendersInterface[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const res = await GetGender();
        if (res.status) {
          setGenderOptions(res.data);
        }
      } catch (error) {
        console.error('Error fetching genders:', error);
      }
    };

    fetchGenders();

  }, []);

  const handleGuestChange = (index: number, field: string, value: string | number) => {
    const updatedGuestInfo = [...guestInfo];
    updatedGuestInfo[index] = { ...updatedGuestInfo[index], [field]: value };
    setGuestInfo(updatedGuestInfo);
  };

  const validateGuestInfo = () => {
    for (const guest of guestInfo) {
      if (!guest.firstname || !guest.lastname || !guest.email || !guest.phone || !guest.birthday || !guest.address || guest.age === null || guest.genderID === null) {
        return false;
      }
    }
    return true;
  };

  const saveBookingWithGuests = async () => {
    if (!validateGuestInfo()) {
      message.error('กรุณากรอกข้อมูลให้ครบทุกช่องก่อนทำการบันทึก');
      return;
    }

    setIsSubmitting(true);
    try {
      // หลังจากบันทึกข้อมูลผู้โดยสารเสร็จแล้ว
      const bookingData = {
        NumberOfGuest: numberOfGuests,
        BookingTripPrice: price * numberOfGuests,
        CustomerID: Number(customerID),
        StatusID: 4,
        CruiseTripID: tripID,
      };
      console.log("Booking Data:", bookingData)

      const bookingRes = await CreateBookingTrip(bookingData);  // ส่งข้อมูลการจองไปยัง API
      console.log(bookingRes.data.data.ID)
      if (bookingRes && bookingRes.status === 201) {
        for (const guest of guestInfo) {
          guest.birthday = new Date(guest.birthday).toISOString(); // แปลงวันเกิดให้เป็นรูปแบบที่ถูกต้อง
          guest.bookingtripID = bookingRes.data.data.ID
          const guestRes = await CreateGuest(guest);  // ส่งข้อมูลไปยัง API เพื่อบันทึกผู้โดยสาร
          if (!guestRes || guestRes.status !== 201) {
            message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้โดยสาร');
            setIsSubmitting(false);
            return;
          }
        }
        message.success('บันทึกข้อมูลการจองสำเร็จ');
            localStorage.setItem("booking-trip-id", bookingRes.data.data.ID);
            navigate('/cabintype');

      } else {
        message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลการจอง');
      }
      // บันทึกข้อมูลของผู้โดยสารแต่ละคน



    } catch (error) {
      console.error('Error during saving booking and guest details:', error);
      message.error('เกิดข้อผิดพลาดระหว่างการบันทึก');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Card style={{ width: '90%', maxWidth: '100%', marginTop: '5%', backgroundColor: '#f4f4f4' }}>
          <h2 style={{textAlign: 'center'}}>ข้อมูลผู้โดยสาร</h2>
          <Divider />
          {guestInfo.map((guest, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3>ผู้โดยสารคนที่ {index + 1}</h3>
              <Form layout="vertical">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="ชื่อ"
                      name="FirstName"
                      rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
                    >
                      <Input
                        value={guest.firstname}
                        onChange={(e) => handleGuestChange(index, 'firstname', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="นามสกุล"
                      name="LastName"
                      rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
                    >
                      <Input
                        value={guest.lastname}
                        onChange={(e) => handleGuestChange(index, 'lastname', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="อีเมล"
                      name="Email"
                      rules={[
                        { required: true, message: "กรุณากรอกอีเมล !" },
                        {
                          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "กรุณากรอกอีเมลที่ถูกต้อง!",
                        },
                      ]}
                    >
                      <Input
                        value={guest.email}
                        onChange={(e) => handleGuestChange(index, 'email', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="เบอร์โทร"
                      name="Phone"
                      rules={[
                        { required: true, message: "กรุณากรอกเบอร์ !" },
                        { pattern: /^0[0-9]{9}$/, message: "เบอร์โทรต้องขึ้นต้นด้วย 0 และมีความยาว 10 หลัก!" },
                      ]}
                    >
                      <Input
                        maxLength={10} // จำกัดความยาวเบอร์โทรไม่เกิน 10 ตัว
                        value={guest.phone}
                        onChange={(e) => handleGuestChange(index, 'phone', e.target.value)} // ยังคงกรอกค่าลง state
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="วัน/เดือน/ปีเกิด"
                      name="birthday"
                      rules={[
                        {
                          required: true,
                          message: "กรุณาเลือกวัน/เดือน/ปี เกิด !",
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        onChange={(date) => handleGuestChange(index, 'birthday', date?.toISOString() || '')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="อายุ"
                      name="Age"
                      rules={[{ required: true, message: "กรุณากรอกอายุ !" }]}
                    >
                      <InputNumber
                        min={0}
                        max={99}
                        style={{ width: '100%' }}
                        value={guest.age}
                        onChange={(value) => handleGuestChange(index, 'age', value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="ที่อยู่"
                      name="Address"
                      rules={[{ required: true, message: "กรุณากรอกที่อยู่ !" }]}
                    >
                      <Input.TextArea
                        value={guest.address}
                        onChange={(e) => handleGuestChange(index, 'address', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="เพศ"
                      name="GenderID"
                      rules={[{ required: true, message: "กรุณาเลือกเพศ !" }]}
                    >
                      <Select
                        value={guest.gender}
                        onChange={(value) => handleGuestChange(index, 'genderID', value)}
                      >
                        {genderOptions.map((gender) => (
                          <Select.Option key={gender.ID} value={gender.ID}>
                            {gender.gender}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          ))}
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              onClick={saveBookingWithGuests}
              loading={isSubmitting}
              style={{ backgroundColor: '#133e87' }}
            >
              ยืนยันการจอง
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default GuestForm;