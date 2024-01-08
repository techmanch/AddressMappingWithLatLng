import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";
import { API_KEY } from "../Constants";

function MyMapComponent({
  center,
  zoom,
}) {
  const ref = useRef();

  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
  });

  return <div ref={ref} id="map" />;
}

const MyMapApp = () => (
  <Wrapper apiKey={API_KEY} >
    <MyMapComponent center={center} zoom={10} />
  </Wrapper>
);

const center = {
  lat: 28.6117427,
  lng: 77.4587233
};

export default MyMapApp
