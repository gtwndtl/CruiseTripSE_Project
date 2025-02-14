import "./DotLoader.css"

function DotLoader() {
  return (
    <div
    style={{
      position: "fixed",
    //   top: "50%",
    //   left: "50%",
      zIndex: 2000,
      width: "100%",
      height: "100%",
    //   backgroundColor:"red"
    }}
  >
        <span className="dot-loader"></span>
  </div>
  )
}

export default DotLoader