import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Input, message, Modal, Rate, Row, Select, } from "antd";
import { CreateReview, GetAllCruiseTrip, GetBookingCabin, GetBookingTrip, GetCabinTypes, GetReviews, GetReviewTypes } from "../../../../../service/ReviewAPI";
import { ReviewInterface } from "../../../../../interface/Review";
import { DownOutlined, UploadOutlined, UpOutlined } from "@ant-design/icons";
import Upload from "antd/es/upload";
import { GetTripPayment } from "../../../../../../payment/service/https/TripPaymentAPI";
import "./not_reviewtrippage.css";
import SpinnerReview from "../../../reviewspinner/spinner_review";

const customerID = Number(localStorage.getItem('id'));
export default function NotReviewedTripPage() {
    const [notReviewedTripItems, setNotReviewedTripItems] = useState<ReviewInterface[]>([]);
    const [isNotReviewedLoaded, setIsNotReviewedLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedTripCabin, setExpandedTripCabin] = useState<number | null>(null);
    const [form] = Form.useForm();
    const [currentReviewTrip, setCurrentReviewTrip] = useState<ReviewInterface | null>(null);
    const [reviewTypes, setReviewTypes] = useState<Record<number, string>>({});
    const [base64CreateImages, setBase64CreateImages] = useState<string[]>([]);
    const [, setImageCount] = useState<number>(0); // เก็บจำนวนรูปที่อัปโหลด
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [filteredReviews, setFilteredReviews] = useState<ReviewInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true); // State for loader

    // Fetch Not Reviewed Items
    useEffect(() => {
        const fetchNotReviewedItems = async () => {
            if (!isNotReviewedLoaded) {
                try {
                    setIsLoading(true); // Show loader

                    const fetchData = new Promise<void>(async (resolve) => {
                        const reviewResponse = await GetReviews();
                        if (reviewResponse.status !== 200) throw new Error("Failed to fetch reviews.");
                        const allReviews = reviewResponse.data;
                        const allReviewsFood = allReviews.filter(
                            (review: { review_type_id: any }) => review.review_type_id === 1
                        );

                        // Get IDs of reviewed booking trips
                        const reviewedBookingTripIds = allReviewsFood.map(
                            (review: { booking_trip_id: any }) => review.booking_trip_id
                        );

                        const bookingTripResponse = await GetBookingTrip();
                        if (bookingTripResponse.status !== 200) throw new Error("Failed to fetch booking trips.");
                        const allBookingTrips = bookingTripResponse.data;

                        // Filter booking trips for the customer
                        const customerBookingTrips = allBookingTrips.filter(
                            (booking_trips: any) => booking_trips.CustomerID === customerID
                        );

                        const bookingTripIDs = customerBookingTrips.map((trip: any) => trip.ID);

                        const bookingCabinResponse = await GetBookingCabin();
                        if (bookingCabinResponse.status !== 200) throw new Error("Failed to fetch booking cabins.");
                        const allBookingCabins = bookingCabinResponse.data;

                        // Filter booking cabins related to customer booking trips
                        const relatedBookingCabins = allBookingCabins.filter((cabin: any) =>
                            bookingTripIDs.includes(cabin.BookingTripID)
                        );

                        const bookingCabinIDs = relatedBookingCabins.map((cabin: any) => cabin.ID);

                        const tripPaymentResponse = await GetTripPayment();
                        if (tripPaymentResponse.status !== 200) throw new Error("Failed to fetch trip payments.");
                        const allTripPayments = tripPaymentResponse.data;

                        // Filter trip payments related to booking cabins
                        const relatedTripPayments = allTripPayments.filter((payment: any) =>
                            bookingCabinIDs.includes(payment.BookingCabinID)
                        );

                        const cruiseTripResponse = await GetAllCruiseTrip();
                        if (cruiseTripResponse.status !== 200) throw new Error("Failed to fetch cruise trips.");
                        const allCruiseTrips = cruiseTripResponse.data;

                        const cabinTypeResponse = await GetCabinTypes();
                        if (cabinTypeResponse.status !== 200) throw new Error("Failed to fetch cabin types.");
                        const allCabinType = cabinTypeResponse.data;

                        // Prepare enriched data for display
                        const enrichedOrders = relatedTripPayments
                            .filter((tripPayment: any) => {
                                // Exclude reviewed items
                                const relatedBookingCabin = relatedBookingCabins.find(
                                    (cabin: any) => cabin.ID === tripPayment.BookingCabinID
                                );
                                const relatedBookingTrip = customerBookingTrips.find(
                                    (trip: any) => trip.ID === relatedBookingCabin?.BookingTripID
                                );
                                return !reviewedBookingTripIds.includes(relatedBookingTrip?.ID);
                            })
                            .map((tripPayment: any) => {
                                const relatedBookingCabin = relatedBookingCabins.find(
                                    (cabin: any) => cabin.ID === tripPayment.BookingCabinID
                                );
                                const relatedBookingTrip = customerBookingTrips.find(
                                    (trip: any) => trip.ID === relatedBookingCabin?.BookingTripID
                                );
                                const relatedCruiseTrip = allCruiseTrips.find(
                                    (cruiseTrip: any) => cruiseTrip.ID === relatedBookingTrip?.CruiseTripID
                                );
                                const relatedCabinType = allCabinType.find(
                                    (cabinType: any) => cabinType.ID === relatedBookingCabin?.Cabin.CabinTypeID
                                );
                                return {
                                    review_type_id: 1,
                                    tripPaymentId: tripPayment.ID,
                                    bookingTripId: relatedBookingTrip?.ID,
                                    bookingCabinId: relatedBookingCabin?.ID,
                                    cruiseTripId: relatedCruiseTrip?.ID,
                                    tripName: relatedCruiseTrip?.CruiseTripName,
                                    tripDays: relatedCruiseTrip?.Deets,
                                    tripStartDate: relatedCruiseTrip?.StartDate,
                                    tripEndDate: relatedCruiseTrip?.EndDate,
                                    tripImage: relatedCruiseTrip?.PlanImg,
                                    tripPrice: relatedCruiseTrip?.PlanPrice,
                                    bookingCabinPrice: relatedBookingCabin?.TotalPrice,
                                    bookingCabinStatus: relatedBookingCabin?.BookingStatus,
                                    cabinId: relatedBookingCabin?.CabinID,
                                    cabinNumber: relatedBookingCabin?.Cabin.CabinNumber,
                                    cabinCapacity: relatedBookingCabin?.Cabin.Capacity,
                                    cabinTypeId: relatedBookingCabin?.Cabin.CabinTypeID,
                                    cabinTypeName: relatedCabinType?.TypeName,
                                    cabinTypePrice: relatedCabinType?.CabinPrice,
                                    cabinTypeImage: relatedCabinType?.Image,
                                    cabinTypeSize: relatedCabinType?.Cabinsize,
                                    tripPaymentDate: tripPayment.PaymentDate,
                                    tripPaymentTotalPrice: tripPayment.TotalPrice,
                                    tripPaymentVat: tripPayment.VAT,
                                    tripPaymentStatus: tripPayment.PaymentStatus,
                                    tripPaymentMethod: tripPayment.PaymentMethod,
                                };
                            });

                        setNotReviewedTripItems(enrichedOrders);
                        setIsNotReviewedLoaded(true);
                        resolve(); // Mark fetching as complete
                    });

                    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 1000)); // Enforce 3-second delay

                    await Promise.all([fetchData, minimumDelay]); // Wait for both fetching and delay
                    setIsLoading(false); // Hide loader
                } catch (error) {
                    console.error("Error fetching not reviewed items:", error);
                    setIsLoading(false); // Hide loader even if there's an error
                }
            }
        };

        fetchNotReviewedItems();
    }, [isNotReviewedLoaded]);


    useEffect(() => {
        const getReviewTypes = async () => {
            const res = await GetReviewTypes();
            if (res.status === 200) {
                const reviewtypeMap = res.data.reduce(
                    (acc: Record<number, string>, review_types: { ID: number; review_type: string }) => {
                        acc[review_types.ID] = review_types.review_type;
                        return acc;
                    },
                    {}
                );
                setReviewTypes(reviewtypeMap);
            } else {
                message.error({
                    type: "error",
                    content: res.data.error || "ไม่สามารถโหลดประเภทรีวิวได้",
                });
            }
        };
        getReviewTypes();
    }, [customerID]);
    const handleAddReview = (tripcabin: ReviewInterface) => {
        setCurrentReviewTrip({
            ...tripcabin,
        });
        form.setFieldsValue({
            reviewtype: tripcabin.review_type_id !== undefined ? reviewTypes[tripcabin.review_type_id] : '',
            cruisetrip: tripcabin.tripName,
            cabinType: tripcabin.cabinTypeName,
        });
        setIsModalOpen(true);
    };
    const onFinish = async (values: any) => {
        if (currentReviewTrip) {
            const overallRating = (Number(values.service_rating) + Number(values.value_for_money_rating) + Number(values.cabin_rating)) / 3;
            const newTripReview = {
                ...values,
                review_date: new Date(),
                review_text: values.review_text,
                service_rating: values.service_rating,
                value_for_money_rating: values.value_for_money_rating,
                cabin_rating: values.cabin_rating,
                overall_rating: overallRating, // Dynamically calculate the overall rating
                review_type_id: 1,
                booking_trip_id: currentReviewTrip.bookingTripId,
                trip_payment_id: currentReviewTrip.tripPaymentId,
                customer_id: Number(customerID),
                pictures: base64CreateImages,
            };
            const res = await CreateReview(newTripReview);
            if (res.status === 201) {
                message.open({
                    type: "success",
                    content: "สร้างรีวิวสำเร็จ!",
                });
                setTimeout(() => {
                    window.location.href = "/customer/review";
                }, 2000);
            } else {
                message.open({
                    type: "error",
                    content: res.data.error || "ไม่สามารถสร้างรีวิวได้!",
                });
            }
            setNotReviewedTripItems(notReviewedTripItems.filter((item) => item.ID !== currentReviewTrip.ID));
            setIsModalOpen(false);
        }
    };
    const handleCreateImageUpload = (file: any) => {
        const readerCreate = new FileReader();
        readerCreate.onload = () => {
            setBase64CreateImages((prevCreateImages) => [...prevCreateImages, readerCreate.result as string]);
        };
        readerCreate.readAsDataURL(file);
        return false; // Prevent upload
    };
    // ฟังก์ชันเพื่อคำนวณจำนวนรูปที่อัปโหลด
    const getTotalValidImages = () => {
        const pictures = form.getFieldValue('pictures') || [];
        const validImages = pictures.filter((image: string) => image.startsWith('data:image'));
        return validImages.length;
    };
    useEffect(() => {
        // เช็คจำนวนรูปเริ่มต้นจากฟอร์ม (กรณีที่มีรูปเริ่มต้นอยู่)
        setImageCount(getTotalValidImages());
    }, []); // เมื่อคอมโพเนนต์โหลด, กำหนดค่าเริ่มต้น

    // Update filtered reviews when filters change
    useEffect(() => {
        let filtered = [...notReviewedTripItems];

        if (dateFilter === "asc") {
            filtered.sort((a, b) =>
                new Date(a.tripPaymentDate).getTime() - new Date(b.tripPaymentDate).getTime()
            );
        } else if (dateFilter === "desc") {
            filtered.sort((a, b) =>
                new Date(b.tripPaymentDate).getTime() - new Date(a.tripPaymentDate).getTime()
            );
        }

        setFilteredReviews(filtered);
    }, [dateFilter, notReviewedTripItems]);


    // Handle filter clearing
    const clearFilters = () => {
        setDateFilter(null);
        setFilteredReviews(notReviewedTripItems);
    };
    return (
        <section className="not-reviewed-trip-page" id="reviewed-trip-page">
            {isLoading ? (
                <SpinnerReview />
            ) : (
                <Card
                    style={{
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {/* Filter Controls */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "16px 20px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "12px",
                            marginBottom: "24px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>📅 Date:</span>
                            <Select
                                value={dateFilter}
                                onChange={setDateFilter}
                                style={{ width: 160, fontSize: "14px", borderRadius: "8px" }}
                                placeholder="All"
                            >
                                <Select.Option value="asc">Oldest First</Select.Option>
                                <Select.Option value="desc">Newest First</Select.Option>
                            </Select>
                        </div>
                        <Button onClick={clearFilters} type="link" style={{ fontSize: "14px", color: "#007AFF" }}>
                            Clear Filters
                        </Button>
                    </div>
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((tripcabin) => (
                            <Card
                                key={tripcabin.paymentid}
                                type="inner"
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        {/* ชิดซ้าย */}
                                        <span style={{ flex: 1, textAlign: 'left', fontFamily: "'Roboto', sans-serif", }}>
                                            {`Booking Trip ID #${tripcabin.bookingTripId}`}
                                        </span>
                                        {/* ตรงกลาง */}
                                        <span style={{ flex: 1, textAlign: 'center', fontSize: '14px', color: '#888', fontFamily: "'Roboto', sans-serif", }}>
                                            {`รหัสการชำระเงิน : ${tripcabin.tripPaymentId}, ${new Date(tripcabin.tripPaymentDate ?? '').toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}`}
                                        </span>
                                        {/* ชิดขวา */}
                                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                onClick={() =>
                                                    setExpandedTripCabin(
                                                        expandedTripCabin === tripcabin.paymentid ? null : tripcabin.paymentid
                                                    )
                                                }
                                                icon={expandedTripCabin === tripcabin.paymentid ? <UpOutlined /> : <DownOutlined />}
                                                style={{
                                                    borderRadius: '8px',
                                                    width: '120px', // กำหนดความกว้างเฉพาะ
                                                    height: '40px', // กำหนดความสูงของปุ่ม
                                                    padding: '0 16px', // ปรับ padding ภายในปุ่ม
                                                    fontSize: '14px', // ปรับขนาดข้อความ
                                                    fontFamily: "'Roboto', sans-serif",
                                                }}
                                            >
                                                {expandedTripCabin === tripcabin.paymentid ? 'Show Less' : 'Show More'}
                                            </Button>
                                        </div>
                                    </div>
                                }
                                style={{
                                    marginBottom: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    padding: '20px',
                                }}
                            >{expandedTripCabin === tripcabin.paymentid ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                            <img
                                                src={tripcabin.cabinTypeImage}
                                                alt={tripcabin.cabinTypeName}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    marginRight: '12px',
                                                }}
                                            />
                                            <div>
                                                <p><strong>Cruise Trip:</strong> {tripcabin.tripName} {tripcabin.tripDays}</p>
                                                <p><strong>Cabin Number:</strong> {tripcabin.cabinNumber}</p>
                                                <p><strong>Cabin Capacity:</strong> {tripcabin.cabinCapacity}</p>
                                                <p><strong>Cabin Type:</strong> {tripcabin.cabinTypeName}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p><strong>Subtotal:</strong> {(tripcabin.tripPrice + tripcabin.cabinTypePrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    <p><strong>VAT (7%):</strong>{" "}
                                        {((tripcabin.tripPrice + tripcabin.cabinTypePrice) * 0.07).toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                        )}
                                    </p>
                                    <p><strong>Total:</strong>{" "}
                                        {((tripcabin.tripPrice + tripcabin.cabinTypePrice) * 1.07).toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                        )}
                                    </p>
                                    <p><strong>Discount: -</strong> { }</p>
                                    <p><strong>Grand Total:</strong>{" "}
                                        {((tripcabin.tripPrice + tripcabin.cabinTypePrice) * 1.07).toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                        )}
                                    </p>
                                    <Button type="primary" onClick={() => handleAddReview(tripcabin)}
                                        style={{
                                            float: 'right',
                                            marginTop: '12px',
                                            backgroundColor: '#133e87',
                                            borderRadius: '10px',
                                            borderColor: '#133e87',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                        }}>Add Review</Button>
                                </>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                        <img
                                            src={tripcabin.cabinTypeImage}
                                            alt={tripcabin.cabinTypeName}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                marginRight: '12px',
                                            }}
                                        />
                                        <div>
                                            <p><strong>Cruise Trip:</strong> {tripcabin.tripName} {tripcabin.tripDays}</p>
                                            <p><strong>Cabin Number:</strong> {tripcabin.cabinNumber}</p>
                                            <p><strong>Cabin Capacity:</strong> {tripcabin.cabinCapacity}</p>
                                            <p><strong>Cabin Type:</strong> {tripcabin.cabinTypeName}</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="primary"
                                        onClick={() => handleAddReview(tripcabin)}
                                        style={{
                                            float: 'right',
                                            marginTop: '12px',
                                            backgroundColor: '#133e87',
                                            borderRadius: '10px',
                                            borderColor: '#133e87',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Add Review
                                    </Button>
                                </>
                            )}
                            </Card>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '16px' }}>
                            <p style={{ marginBottom: '16px' }}>You don't have any trips at the moment. Plan your next adventure now!</p>
                            <button
                                className="button_booking_trip"
                                onClick={() => window.location.href = '/trip-summary'} // Update with the actual trip planning page URL
                            >
                                <span className="button_booking_trip_lg">
                                    <span className="button_booking_trip_sl"></span>
                                    <span className="button_booking_trip_text">Booking Now</span>
                                </span>
                            </button>
                        </div>
                    )}
                </Card>
            )}
            <Modal
            className="add-review-trip"
                title={
                    <div style={{ textAlign: 'center', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold' }}>Add Review</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={800} // ปรับความกว้างของ Modal
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setIsModalOpen(false)}
                        style={{
                            borderRadius: '10px',
                            fontWeight: 'bold',
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                        style={{
                            backgroundColor: '#133e87',
                            borderRadius: '10px',
                            borderColor: '#133e87',
                            color: '#fff',
                            fontWeight: 'bold',
                        }}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="reviewtype" label={<span style={{ fontWeight: 'bold', color: '#555' }}>📖 Review Type</span>}>
                                <Input
                                    value={currentReviewTrip && currentReviewTrip.review_type_id !== undefined ? reviewTypes[currentReviewTrip.review_type_id] : ''}
                                    readOnly
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="cruisetrip" label={<span style={{ fontWeight: 'bold', color: '#555' }}>📝 Cruise Trip Names</span>}>
                                <Input readOnly />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="cabinType" label={<span style={{ fontWeight: 'bold', color: '#555' }}>🛏️ Cabin Type</span>}>
                                <Input readOnly />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="review_text"
                                label={<span style={{ fontWeight: 'bold', color: '#555' }}>💬 Review Text</span>}
                                rules={[{ required: true, message: 'Please enter a Review!' }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="service_rating"
                                label="⛴️ Service"
                                rules={[{ required: true, message: 'Please provide a Service Rating!' }]}
                            >
                                <Rate allowHalf style={{ fontSize: '18px', color: '#4CAF50' }} defaultValue={0} tooltips={['Very Bad', 'Bad', 'Average', 'Good', 'Excellent']} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="cabin_rating"
                                label="🛏️ Cabin"
                                rules={[{ required: true, message: 'Please provide a Cabin Rating!' }]}
                            >
                                <Rate allowHalf style={{ fontSize: '18px', color: '#FF5722' }} defaultValue={0} tooltips={['Very Bad', 'Bad', 'Average', 'Good', 'Excellent']} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="value_for_money_rating"
                                label="💵 Value for Money"
                                rules={[{ required: true, message: 'Please provide a Price Rating!' }]}
                            >
                                <Rate allowHalf style={{ fontSize: '18px', color: '#FFC107' }} defaultValue={0} tooltips={['Very Bad', 'Bad', 'Average', 'Good', 'Excellent']} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="images"
                                label="🖼️ Upload Images"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                            >
                                <Upload
                                    name="images"
                                    listType="picture"
                                    maxCount={3}
                                    multiple
                                    beforeUpload={handleCreateImageUpload}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload (Max: 3)</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </section>
    );
}
