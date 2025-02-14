import { useEffect, useState } from "react";
import { Button, Card, Dropdown, Form, Input, Menu, message, Modal, Rate, Select, } from "antd";
import { DeleteReviewById, GetAllCruiseTrip, GetBookingTrip, GetReviews, GetReviewTypes, UpdateReviewById } from "../../../../../service/ReviewAPI";
import { ReviewInterface } from "../../../../../interface/Review";
import { DeleteOutlined, EllipsisOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Upload, { RcFile } from "antd/es/upload";
import { GetUsersById } from "../../../../../../services/https";
import "./tripreviewedpage.css";
import SpinnerReview from "../../../reviewspinner/spinner_review";

const customerID = Number(localStorage.getItem('id'));

export default function TripReviewedPage() {
    const [reviewedFoodItems, setReviewedFoodItems] = useState<ReviewInterface[]>([]);
    const [isReviewedLoaded, setIsReviewedLoaded] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [form] = Form.useForm();
    const [currentReview, setCurrentReview] = useState<ReviewInterface | null>(null);
    const [reviewTypes, setReviewTypes] = useState<Record<number, string>>({});
    const [uploadedEditImages, setUploadedEditImages] = useState<string[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deleteReviewId, setDeleteReviewId] = useState<string | number | null>(null);
    const [, setImageCount] = useState<number>(0); // เก็บจำนวนรูปที่อัปโหลด
    const [maxImages] = useState(3); // จำนวนรูปสูงสุดที่สามารถอัปโหลดได้ั
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [filteredReviews, setFilteredReviews] = useState<ReviewInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true); // State to manage loading

    // Fetch Reviewed Items
    useEffect(() => {
        const fetchReviewedItems = async () => {
            if (!isReviewedLoaded) {
                try {
                    // Start loading
                    setIsLoading(true); // Show the spinner

                    const fetchData = new Promise<void>(async (resolve) => {
                        const reviewResponse = await GetReviews();
                        if (reviewResponse.status !== 200) throw new Error('Failed to fetch reviews.');
                        const allReviews = reviewResponse.data;

                        // Filter reviews for the current customer
                        const customerReviews = allReviews.filter(
                            (review: any) => review.customer_id === customerID && review.review_type_id === 1
                        );

                        const bookingTripResponse = await GetBookingTrip();
                        if (bookingTripResponse.status !== 200) throw new Error('Failed to fetch booking trips.');
                        const allBookingTrip = bookingTripResponse.data;

                        // Filter booking trips for the current customer
                        const customerBookingTrip = allBookingTrip.filter(
                            (bookingTrip: any) => bookingTrip.CustomerID === customerID
                        );

                        const cruiseTripResponse = await GetAllCruiseTrip();
                        if (cruiseTripResponse.status !== 200) throw new Error('Failed to fetch cruise trips.');
                        const allCruiseTrip = cruiseTripResponse.data;

                        // Filter cruise trips related to the customer's booking trips
                        const customerCruiseTrip = allCruiseTrip.filter((cruiseTrip: any) =>
                            customerBookingTrip.some((trip: any) => trip.CruiseTripID === cruiseTrip.ID)
                        );

                        // Enrich reviews with booking trip and cruise trip details
                        const enrichedReviews = customerReviews.map((review: any) => {
                            const relatedBookingTrip = customerBookingTrip.find(
                                (trip: any) => trip.ID === review.booking_trip_id
                            );
                            const relatedCruiseTrip = customerCruiseTrip.find(
                                (cruise: any) => cruise.ID === relatedBookingTrip?.CruiseTripID
                            );
                            return {
                                ...review,
                                tripName: relatedCruiseTrip?.CruiseTripName || 'Unknown',
                                tripStartDate: relatedCruiseTrip?.StartDate || null,
                                tripEndDate: relatedCruiseTrip?.EndDate || null,
                                bookingTripStatus: relatedBookingTrip?.BookingStatus || 'Unknown',
                            };
                        });

                        setReviewedFoodItems(enrichedReviews);
                        setFilteredReviews(enrichedReviews);
                        setIsReviewedLoaded(true);
                        resolve();
                    });

                    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 1000)); // Enforce 3-second delay

                    await Promise.all([fetchData, minimumDelay]); // Wait for both fetching and delay to complete

                    setIsLoading(false); // End loading after fetching and delay
                } catch (error) {
                    console.error('Error fetching reviewed items:', error);
                    setIsLoading(false); // Ensure loading ends even if there's an error
                }
            }
        };

        fetchReviewedItems();
    }, [isReviewedLoaded]);





    useEffect(() => {
        const fetchUserInfo = async () => {
            if (customerID) {
                try {
                    const res = await GetUsersById(customerID);
                    if (res.status === 200) {
                        setUserInfo(res.data);
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            }
        };

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
        fetchUserInfo();
        getReviewTypes();
    }, [customerID]);


    // ฟังก์ชันสำหรับการอัปโหลดรูป
    const handleEditUpload = async (file: RcFile) => {
        const existingImages = form.getFieldValue('pictures') || []; // รูปในฟอร์ม
        const validImages = existingImages.filter((image: string) => image.startsWith('data:image'));
        const totalImages = validImages.length;

        if (totalImages >= maxImages) {
            message.error('คุณสามารถอัปโหลดรูปได้สูงสุด 3 รูป');
            return false;
        }

        const readerEdit = new FileReader();
        readerEdit.readAsDataURL(file);
        readerEdit.onloadend = () => {
            const base64EditImage = readerEdit.result as string;

            if (base64EditImage && base64EditImage.startsWith('data:image')) {
                const updatedImages = [...existingImages, base64EditImage];
                form.setFieldsValue({
                    pictures: updatedImages,
                });
                setUploadedEditImages(updatedImages); // อัปเดต state ของภาพที่อัปโหลดแล้ว
            } else {
                message.error('ไฟล์รูปไม่ถูกต้อง');
            }
        };

        return false; // ป้องกันการอัปโหลดปกติ
    };

    // ฟังก์ชันสำหรับลบรูป
    const handleImageDelete = (index: number) => {
        const currentPictures = form.getFieldValue('pictures') || [];
        const updatedPictures = currentPictures.filter((_: any, idx: number) => idx !== index);
        form.setFieldsValue({
            pictures: updatedPictures, // อัปเดตฟอร์ม
        });
        setUploadedEditImages(updatedPictures); // อัปเดต state ของรูป
    };

    // ฟังก์ชันเพื่อคำนวณจำนวนรูปที่อัปโหลด
    const getTotalValidImages = () => {
        const pictures = form.getFieldValue('pictures') || [];
        const validImages = pictures.filter((image: string) => image.startsWith('data:image'));
        return validImages.length;
    };

    useEffect(() => {
        // อัปเดตจำนวนรูปเมื่อมีการเพิ่มหรือลบรูป
        setImageCount(getTotalValidImages());
    }, [uploadedEditImages]); // เมื่อ uploadedEditImages เปลี่ยน, อัปเดตจำนวน

    useEffect(() => {
        // เช็คจำนวนรูปเริ่มต้นจากฟอร์ม (กรณีที่มีรูปเริ่มต้นอยู่)
        setImageCount(getTotalValidImages());
    }, []); // เมื่อคอมโพเนนต์โหลด, กำหนดค่าเริ่มต้น


    const handleEditClick = (review: any) => {
        setCurrentReview(review);
        form.setFieldsValue({
            tripName: review.tripName,
            reviewType: reviewTypes[review.review_type_id] || 'Unknown',
            reviewText: review.review_text,
            serviceRating: review.service_rating,
            valueForMoneyRating: review.value_for_money_rating,
            cabinRating: review.cabin_rating,
            pictures: review.pictures || [],  // Ensure pictures are included in form state
        });
        setIsEditModalVisible(true);
    };

    const handleCancelEdit = () => {
        setIsEditModalVisible(false);  // Close the modal
        setCurrentReview(null);  // Clear the current review data
        setUploadedEditImages([]);  // Reset uploaded images array to an empty array
        form.resetFields();  // Optionally, reset form fields (if needed)
    };


    const handleSubmitEdit = async () => {
        if (!currentReview) {
            message.error('No review selected.');
            return;
        }

        try {
            const values = await form.validateFields();
            const updatedReviewData = {
                ...currentReview,
                review_text: values.reviewText,
                service_rating: values.serviceRating,
                value_for_money_rating: values.value_for_money_rating,
                cabin_rating: values.cabinRating,
                overall_rating: (
                    parseFloat(values.value_for_money_rating) +
                    parseFloat(values.cabinRating) +
                    parseFloat(values.serviceRating)
                ) / 3,
                pictures: values.pictures,
            };

            const res = await UpdateReviewById(String(currentReview.ID), updatedReviewData);

            if (res.status === 200) {
                message.open({
                    type: "success",
                    className: "message-success",
                    content: "แก้ไขรีวิวสำเร็จ!",
                });
                setTimeout(() => {
                    window.location.href = "/customer/review";
                }, 2000);
            } else {
                message.open({
                    type: "error",
                    content: res.data.error || "ไม่สามารถแก้ไขรีวิวได้!",
                });
            }
        } catch (error) {
            message.error('Failed to submit form.');
        }
    };

    const showDeleteReviewModal = (id: string | number) => {
        setDeleteReviewId(id);
        setIsDeleteModalVisible(true);
    };


    const handleDeleteReviewConfirm = async () => {
        try {
            const response = await DeleteReviewById(String(deleteReviewId));
            if (response.status === 200) {
                message.success('Review deleted successfully');
                setReviewedFoodItems((prevItems) =>
                    prevItems.filter((item) => item.ID !== deleteReviewId)
                );
            } else {
                message.error('Failed to delete review');
            }
        } catch (error) {
            message.error('An error occurred while deleting the review');
        } finally {
            setIsDeleteModalVisible(false);
            setDeleteReviewId(null);
            window.location.reload(); // Refresh the page
        }
    };

    const handleDeleteReviewCancel = () => {
        setIsDeleteModalVisible(false);
        setDeleteReviewId(null);
    };

    // Update filtered reviews when filters change
    useEffect(() => {
        let filtered = [...reviewedFoodItems];

        if (ratingFilter !== null) {
            filtered = filtered.filter(
                (review) =>
                    review.overall_rating !== undefined &&
                    review.overall_rating >= ratingFilter &&
                    review.overall_rating < ratingFilter + 1
            );
        }

        if (dateFilter === "asc") {
            filtered.sort((a, b) =>
                dayjs(a.review_date).isBefore(dayjs(b.review_date)) ? -1 : 1
            );
        } else if (dateFilter === "desc") {
            filtered.sort((a, b) =>
                dayjs(a.review_date).isAfter(dayjs(b.review_date)) ? -1 : 1
            );
        }

        setFilteredReviews(filtered);
    }, [ratingFilter, dateFilter, reviewedFoodItems]);

    // Handle filter clearing
    const clearFilters = () => {
        setRatingFilter(null);
        setDateFilter(null);
        setFilteredReviews(reviewedFoodItems);
    };


    return (
        <section className="reviewed-trip-page" id="reviewed-trip-page">
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
                            <span style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>⭐ Rating:</span>
                            <Rate
                                allowClear
                                value={ratingFilter ?? undefined}
                                onChange={setRatingFilter}
                                style={{ fontSize: "20px", color: "#FF9800", cursor: "pointer" }}
                            />
                        </div>
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
                        filteredReviews.map((review) => (
                            <Card
                                key={review.ID}
                                type="inner"
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                        <img
                                            src={userInfo.picture}
                                            alt="User"
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333', fontFamily: "'Roboto', sans-serif", }}>{`${userInfo.first_name} ${userInfo.last_name}`}</p>
                                            <p style={{ fontSize: '14px', color: '#888', fontFamily: "'Roboto', sans-serif", }}>{userInfo.email}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Rate
                                                    allowHalf
                                                    disabled
                                                    defaultValue={review.overall_rating}
                                                    style={{ fontSize: '16px', color: '#FF9800' }}
                                                />
                                                <p style={{ fontSize: '14px', color: '#888', margin: 0, fontFamily: "'Roboto', sans-serif", }}>
                                                    {dayjs(review.review_date).fromNow()}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <Dropdown
                                                overlay={
                                                    <Menu>
                                                        <Menu.Item
                                                            onClick={() => handleEditClick(review)}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            Edit
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={() => showDeleteReviewModal(String(review.ID))}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            Delete
                                                        </Menu.Item>
                                                    </Menu>
                                                }
                                                trigger={['click']}
                                            >
                                                <Button
                                                    icon={<EllipsisOutlined />}
                                                    shape="circle"
                                                    style={{ border: 'none', background: 'transparent' }}
                                                />
                                            </Dropdown>

                                        </div>
                                    </div>
                                }
                                style={{
                                    marginBottom: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    padding: '20px',
                                }}
                            >

                                {/* เนื้อหารีวิว */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', maxWidth: '1400px' }}>
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{
                                            marginBottom: '16px',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            fontFamily: "'Roboto', sans-serif",
                                            color: '#333',
                                        }}>
                                            {review.tripName} (Booking Trip ID #{review.booking_trip_id})
                                        </h2>
                                        <h4 style={{
                                            marginBottom: '24px',
                                            fontSize: '16px',
                                            fontFamily: "'Roboto', sans-serif",
                                            color: '#555',
                                            lineHeight: '1.6', // เพิ่มความโปร่งเพื่อให้อ่านง่าย  
                                            maxWidth: '1400px',
                                            wordWrap: 'break-word', // รองรับการตัดคำยาวเกิน
                                            overflowWrap: 'break-word', // เพิ่มความยืดหยุ่น
                                            whiteSpace: 'normal', // ป้องกันการไม่ตัดบรรทัด
                                        }}>
                                            {review.review_text}
                                        </h4>
                                        {/* การ์ดสำหรับคะแนน */}
                                        <Card
                                            style={{
                                                background: '#fff',
                                                borderRadius: '16px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                marginTop: '28px',
                                                padding: '24px',
                                            }}
                                        >
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                                {/* คะแนนบริการ */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{
                                                        margin: 0,
                                                        fontWeight: '600',
                                                        fontSize: '16px',
                                                        fontFamily: "'Roboto', sans-serif",
                                                    }}>⛴️ Service</p>
                                                    <Rate allowHalf disabled defaultValue={review.service_rating} style={{ fontSize: '22px', color: '#4CAF50' }} />
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '14px',
                                                        color: '#888',
                                                        fontFamily: "'Roboto', sans-serif",
                                                    }}>
                                                        {review.service_rating} / 5
                                                    </p>
                                                </div>

                                                {/* คะแนนรที่พัก */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{
                                                        margin: 0,
                                                        fontWeight: '600',
                                                        fontSize: '16px',
                                                        fontFamily: "'Roboto', sans-serif",
                                                    }}>🛏️ Cabin</p>
                                                    <Rate allowHalf disabled defaultValue={review.cabin_rating} style={{ fontSize: '22px', color: '#FF5722' }} />
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '14px',
                                                        color: '#888',
                                                        fontFamily: "'Roboto', sans-serif",
                                                    }}>
                                                        {review.cabin_rating} / 5
                                                    </p>
                                                </div>

                                                {/* คะแนนราคา */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{
                                                        margin: 0,
                                                        fontWeight: '600',
                                                        fontSize: '16px',
                                                        fontFamily: "'Roboto', sans-serif",
                                                    }}>💵 Value for Money</p>
                                                    <Rate allowHalf disabled defaultValue={review.value_for_money_rating} style={{ fontSize: '22px', color: '#FFC107' }} />
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '14px',
                                                        color: '#888',
                                                        fontFamily: "'Roboto', sans-serif",
                                                    }}>
                                                        {review.value_for_money_rating} / 5
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Pictures below the Rating Card */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center', // จัดรูปให้อยู่ตรงกลางในแนวนอน
                                                alignItems: 'center', // จัดรูปให้อยู่ตรงกลางในแนวตั้ง (ถ้าสูงกว่าหนึ่งบรรทัด)
                                                flexWrap: 'wrap', // รองรับรูปหลายแถว
                                                gap: '16px', // เพิ่มระยะห่างระหว่างรูป
                                                marginTop: '24px',
                                            }}
                                        >
                                            {review.pictures && review.pictures.length > 0 ? (
                                                review.pictures.map((pic, idx) => (
                                                    <div key={idx} style={{ width: '120px', height: '120px' }}>
                                                        <img
                                                            src={pic}
                                                            alt={`Review Pic ${idx + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                borderRadius: '10px',
                                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // เพิ่มเงาสำหรับรูป
                                                            }}
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>No pictures available.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '16px' }}>
                            <p style={{ marginBottom: '16px' }}>You don't have any cruise trip reviews at the moment. Share your experience after your next adventure!</p>
                        </div>
                    )}
                </Card>
            )}
            {/* Delete Confirmation Modal */}
            <Modal
                className="delete-trip-modal"
                title={<h2 style={{ textAlign: 'center', margin: 0 }}>Confirm Delete</h2>}
                visible={isDeleteModalVisible}
                onOk={handleDeleteReviewConfirm}
                onCancel={handleDeleteReviewCancel}
                okText="Yes, Delete"
                cancelText="No"
                centered
                bodyStyle={{
                    textAlign: 'center',
                    padding: '24px',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                }}
                okButtonProps={{
                    danger: true,
                    style: { backgroundColor: '#ff4d4f', border: 'none', fontWeight: 'bold' },
                }}
                cancelButtonProps={{
                    style: { backgroundColor: '#d9d9d9', border: 'none', fontWeight: 'bold' },
                }}
                width={400}
            >
                <p style={{ fontSize: '16px', marginBottom: '16px' }}>
                    คุณต้องการลบรีวิวนี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                </p>
                <p style={{ fontSize: '14px', color: 'gray' }}>
                    กรุณายืนยันการกระทำของคุณด้านล่าง
                </p>
            </Modal>

            {/* Edit Modal */}
            <Modal
                className="edit-trip-modal"
                visible={isEditModalVisible}
                title={
                    <div style={{ textAlign: 'center', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold' }}>Edit Review</span>
                    </div>
                }
                centered
                width={800}
                footer={[
                    <Button
                        key="cancel"
                        onClick={handleCancelEdit}
                        style={{
                            borderRadius: '10px',
                            fontWeight: 'bold',
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={handleSubmitEdit}
                        style={{
                            borderRadius: '10px',
                            backgroundColor: '#133e87',
                            borderColor: '#133e87',
                            color: '#fff',
                            fontWeight: 'bold',
                        }}
                    >
                        Save Changes
                    </Button>,
                ]}
                onCancel={handleCancelEdit}
            >
                <Form form={form} layout="vertical">
                    {/* Trip Names and Review Type in one row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                        <Form.Item
                            label={<span style={{ fontWeight: 'bold', color: '#555' }}>📖 Review Type</span>}
                            name="reviewType"
                            rules={[{ required: true, message: 'Please select review type' }]}
                            style={{ flex: 1 }}
                        >
                            <Input readOnly />
                        </Form.Item>
                        <Form.Item
                            label={<span style={{ fontWeight: 'bold', color: '#555' }}>📝 Cruise Trip Names</span>}
                            name="tripName"
                            rules={[{ required: true, message: 'Please enter cruise trip names' }]}
                            style={{ flex: 1 }}
                        >
                            <Input readOnly />
                        </Form.Item>
                    </div>

                    {/* Review Text */}
                    <Form.Item
                        label={<span style={{ fontWeight: 'bold', color: '#555' }}>💬 Review Text</span>}
                        name="reviewText"
                        rules={[{ required: true, message: 'Please enter review text' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Write your review here..."
                            style={{ borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fefefe' }}
                        />
                    </Form.Item>

                    {/* Ratings */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                        <Form.Item
                            label={<span style={{ fontWeight: 'bold', color: '#555' }}>⛴️ Service Rating</span>}
                            name="serviceRating"
                            rules={[{ required: true, message: 'Please rate the service' }]}
                            style={{ flex: 1 }}
                        >
                            <Rate allowHalf style={{ fontSize: '18px', color: '#4CAF50' }} />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontWeight: 'bold', color: '#555' }}>🛏️ Cabin Rating</span>}
                            name="cabinRating"
                            rules={[{ required: true, message: 'Please rate the cabin' }]}
                            style={{ flex: 1 }}
                        >
                            <Rate allowHalf style={{ fontSize: '18px', color: '#FF5722' }} />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontWeight: 'bold', color: '#555' }}>💵 Value For Money Rating</span>}
                            name="valueForMoneyRating"
                            rules={[{ required: true, message: 'Please rate the value for money' }]}
                            style={{ flex: 1 }}
                        >
                            <Rate allowHalf style={{ fontSize: '18px', color: '#FFC107' }} />
                        </Form.Item>
                    </div>

                    {/* Upload Images */}
                    <div style={{ marginTop: '20px' }}>
                        <Form.Item
                            label={
                                <strong>
                                    🖼️ Review Images
                                    <span
                                        style={{
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: '8px',
                                            padding: '2px 8px',
                                            fontSize: '12px',
                                            color: 'red',
                                            border: '1px dashed #ccc',
                                            marginLeft: '8px',
                                        }}
                                    >
                                        {getTotalValidImages()} / {maxImages}
                                    </span>
                                </strong>
                            }
                            name="pictures"
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {/* Display Existing Images */}
                                {form.getFieldValue('pictures') &&
                                    form.getFieldValue('pictures').length > 0 &&
                                    form.getFieldValue('pictures').map((pic: string, idx: number) => (
                                        <div
                                            key={idx}
                                            style={{
                                                position: 'relative',
                                                width: '100px', // ขนาดของ container
                                                height: '100px',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                border: '1px solid #ddd',
                                            }}
                                        >
                                            <img
                                                src={pic}
                                                alt={`Review Pic ${idx + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover', // ให้ภาพครอบคลุมพื้นที่
                                                    display: 'block', // ป้องกัน spacing เพิ่มจาก inline element
                                                }}
                                            />
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                style={{
                                                    position: 'absolute',
                                                    top: '5px',
                                                    right: '5px',
                                                    backgroundColor: '#ff4d4f',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                }}
                                                onClick={() => handleImageDelete(idx)}
                                            />
                                        </div>
                                    ))}

                                {/* Upload Button */}
                                {getTotalValidImages() < 3 && (
                                    <Upload
                                        accept="image/*"
                                        beforeUpload={handleEditUpload}
                                        showUploadList={false}
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                border: '1px dashed #bbb',
                                                backgroundColor: '#f9f9f9',
                                                color: '#555',
                                                fontSize: '16px',
                                                flexDirection: 'column',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div>Upload</div>
                                            <div>(Max: 3)</div>
                                        </Button>
                                    </Upload>
                                )}
                            </div>

                        </Form.Item>
                    </div>
                </Form>
            </Modal>


        </section>
    );
}
