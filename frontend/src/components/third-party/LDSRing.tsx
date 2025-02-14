import "./LDSRing.css"

function LDSRing() {
  return (
    <div
    style={{
      position: "fixed",
    //   top: "50%",
    //   left: "50%",
    width: "100%",
    height: "100%",
    zIndex: 2000,
    }}
  >
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  </div>
  )
}

export default LDSRing