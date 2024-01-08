import React, { useEffect } from 'react'
import { Circle, GoogleMap, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api';
import { API_KEY } from '../Constants';
import { getDistanseLatLng } from '../utils';
const containerStyle = {
  width: '1030px',
  height: '800px',

};

const center = {
  lat: 28.6117427,
  lng: 77.4587233
};

const PATH = [
  { lat: 28.6355483557725, lng: 77.22451268874492 },
  { lat: 28.639277242114574, lng: 77.2358852552458 },
  { lat: 28.627336805559338, lng: 77.23361074194563 },
  { lat: 28.626884774965095, lng: 77.22665845600923 },

]

const MyGoogleMap = ({ address, path, allBranches }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY
  })

  const [map, setMap] = React.useState(null)
  const [refresh, setRefresh] = React.useState(false)
  const [isDisCalculated, setIsDisCalculated] = React.useState(false)
  const [minDisMap, setMinDisMap] = React.useState(new Map())
  const [circes, setCircles] = React.useState([{
    location
      : { lat: 28.6671188, lng: 77.4329838 }, r: 5
  }])

  // useEffect = (() => {


  // }, [address, refresh])

  useEffect(() => {
    if (!isDisCalculated)
      findNearestAddres(address)

    // if (!isDisCalculated) {
    //   createNotOverlapingCircle()
    // }


  }, [circes]);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const findNearestAddres = (addressArr) => {

    for (let i = 0; i < addressArr.length; i++) {
      const add = addressArr[i];
      let minDis = -1
      let matchingAdd = ''
      for (let j = i + 1; j < addressArr.length; j++) {
        const add2 = addressArr[j];
        let dis = getDistanseLatLng(add.location, add2.location)

        if (minDis == -1) {
          minDis = dis
          matchingAdd = add2.location
        } else if (minDis > dis) {
          minDis = dis
          matchingAdd = add2.location
        }

      }

      console.log('distance map:', add.location, minDis)
      if (minDis != -1) {
        let exi = minDisMap.get(add.location)
        if (exi) {
          if (exi > minDis) {
            minDisMap.set(add.location, minDis)
            minDisMap.set(matchingAdd, minDis)
          }

        } else {
          minDisMap.set(add.location, minDis)
          minDisMap.set(matchingAdd, minDis)
        }

        // if (!minDisMap.get(matchingAdd))
        //   minDisMap.set(matchingAdd, minDis)
      }

    }
    setRefresh(!refresh)
    setIsDisCalculated(true)
  }


  //*************** */

  const createNotOverlapingCircle = () => {
    let circles = []
    for (let i = 0; i < address.length; i++) {
      const element = address[i];
      let circle = {
        location: element.location,
        r: 5
      }
      let overLapping = false
      for (let j = 0; j < circles.length; j++) {
        let other = circles[j];
        let d = getDistanseLatLng(circle.location, other.location)
        if (d < circle.r + other.r) {
          //they are overlaping
          overLapping = true
          break
        }

      }
      if (!overLapping)
        circles.push(circle)
    }
    console.log("createNotOverlapingCircle", circles)
    setIsDisCalculated(true)
    setCircles(circles)

  }

  return isLoaded && circes.length > 0 ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}

    >
      { /* Child components, such as markers, info windows, etc. */}
      {/* {
        address && address.map((item) => {
          return <div>
            
            <Circle center={{ lat: item.location.lat, lng: item.location.lng }} radius={item.r * 1000} />

          </div>
        })
      } */}
      <div>
        {allBranches && allBranches.map((item) => {
          return <Marker position={{ lat: item.location.lat, lng: item.location.lng }} ></Marker>
        })
        }

        <Polygon
          // Make the Polygon editable / draggable
          editable
          draggable
          path={path}
          options={{ fillOpacity: .1, fillColor: '#88888810' }}
        // Event used when manipulating and adding points
        // onMouseUp={onEdit}
        // Event used when dragging the whole Polygon
        // onDragEnd={onEdit}
        // onLoad={onLoad}
        // onUnmount={onUnmount}
        />
      </div>

      {/* {
        circes.map((item) => {
          return <div>
            <Circle center={{ lat: item.location.lat, lng: item.location.lng }} radius={item.r * 1000} />
            <Marker position={{ lat: item.location.lat, lng: item.location.lng }} ></Marker>

          </div>
        })
      } */}

      <></>
    </GoogleMap>
  ) : <></>
}



export default MyGoogleMap//React.memo(MyGoogleMap)