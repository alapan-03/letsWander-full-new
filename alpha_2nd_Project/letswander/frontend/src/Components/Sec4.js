import Footer from "./Footer";

export default function Sec4(props) {
  return (
    <>
      <div className="s4-cont">
        <div className="sec-4">
          <p className="iti-text">Itinerary</p>
          {props.data.itinerary &&
            props.data.itinerary.map((iti, index) => (
              <div className="iti-cont">
                <p className="day">Day {index + 1}</p>
                <p>{iti}</p>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
