import { useEffect, useState } from 'react'
import { CabinTypeInterface } from '../../interfaces/ICabinType'
import './CabinType.css'
import { Button } from 'antd';
import PopupBookingCabin from '../PopupBookingCabin/PopupBookingCabin';
import { Header } from 'antd/es/layout/layout';
import { ListCabinTypes } from '../../service/https';

function CabinType() {

  const [cabintypes, setCabinTypes] = useState<CabinTypeInterface[]>([]);
  // const [messageApi, contextHolder] = message.useMessage();
  const [popupBookingCabin, setPopupBookingCabin] = useState(<></>)
  
  async function getCabinTypes(){
    const res = await ListCabinTypes()
    //console.log(res)
    if (res) {
      setCabinTypes(res.data);
    }
  }

  function showPopupBookingCabin(id: number) {
    localStorage.setItem("type-id", String(id))
    setPopupBookingCabin(<PopupBookingCabin setPopupBookingCabin={setPopupBookingCabin} typeName={typename} cabinPrice={cabinPrice} cabinsize={cabinsize}/>)
  }

  const sltCabinStr = localStorage.getItem("sltCabin")
  const sltCabin = sltCabinStr !=null ? parseInt(sltCabinStr) : 0;

  const typename = cabintypes.length > 0 ? cabintypes[sltCabin].TypeName : '';
  const cabinPrice = cabintypes.length > 0 ? cabintypes[sltCabin].CabinPrice : '';
  const cabinsize = cabintypes.length > 0 ? cabintypes[sltCabin].Cabinsize : '';

  const cabintypeElements = cabintypes?.map((subCabinType, index) => {
    return (
        <div className="cabintype-container" key={index}>
          <div className="img-box">
            <img src={subCabinType.Image} alt="" />
          </div>
          <div className="detail">
            <div className="type-name">
              <h2>{subCabinType.TypeName}</h2>
            </div>
            <div className="price">
              ราคาเริ่มต้น <h2 style={{color: '#133e87'}}>฿{subCabinType.CabinPrice?.toLocaleString()}</h2>
            </div>
            <div className="size">
              ขนาดห้องเริ่มต้น : {subCabinType.Cabinsize} ตารางฟุต
            </div>
              <Button
                style={{
                  marginTop: "10px"
                }} 
                className="cabin-btn" type="primary" onClick={()=>showPopupBookingCabin(subCabinType.ID ?? 0)}>เลือก</Button>
          </div>
        </div>
    )
  })

  useEffect(() => {
    getCabinTypes()
  }, [])

  return (
    <>
    <Header/>
    {popupBookingCabin}
    <div className="container-cabintype">
      <div className="grid-container">
        {cabintypeElements}
      </div>
    </div>
    </>
  )
}

export default CabinType;