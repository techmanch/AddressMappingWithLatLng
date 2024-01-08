import haversineDistance from "haversine-distance";
import { useState, useEffect } from "react";
import MyGoogleMap from "../map/MyGoogleMap";
import GoogleMapReact from 'google-map-react';
import DemoMap from "../map/DemoMap";
import MyMapApp from "../map/MyMapApp";
import { drawVertex, generateRandomPoint, getDis, getDisBasedOnDegree, getNewLatLngOnDegree, randomIntFromInterval } from "../utils";
//import ReactDOM from "react-dom/client";
//https://maps.googleapis.com/maps/api/distancematrix/json?origins=noida&destinations=delhi&key=AIzaSyCUdGcTOcfTcA__JlovrPfs4PQkFSUugng
//https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCUdGcTOcfTcA__JlovrPfs4PQkFSUugng&latlng=
const API_KEY = 'AIzaSyCUdGcTOcfTcA__JlovrPfs4PQkFSUugng'
//const URL = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCUdGcTOcfTcA__JlovrPfs4PQkFSUugng&address='
const URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&address=`
const URL_LATLNG = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&latlng=`
const UseMemo = () => {
    const [selectedGrp, setSelectedGrp] = useState('0');
    const [selectedDistanceFormula, setSelectedDistanceFormula] = useState('0');
    const [count, setCount] = useState(0);
    const [grpCount, setGrpCount] = useState(0);
    const [addresses, setAddresses] = useState("");
    const [latLngArr, setLatLngArr] = useState([]);
    const [grpLatLngArr, setGrpLatLngArr] = useState([]);
    const [centerLat, setCenterLat] = useState('');
    const [centerLng, setCenterLng] = useState('');
    const [centerAddress, setCenterAddress] = useState('');
    const [grpMap, setGrpMap] = useState(new Map());
    const [grpMapCopy, setGrpMapCopy] = useState(new Map());
    const [grpOnMouceOver, setGrpOnMouceOver] = useState('');
    const [searchLatLng, setSearchLatLng] = useState('');
    const [searchResult, setSearchResult] = useState('');
    const [onDisFilterSelected, setOnDisFilterSelected] = useState(0);
    const [refesh, setRefesh] = useState(false);
    const [minDisMap, setMinDisMap] = useState(new Map())
    const [circleStartPoint, setCircleStartPoint] = useState()
    const [circleStartLocation, setCircleStartLocation] = useState()
    const [showMap, setShowMap] = useState(false)







    //const calculation = expensiveCalculation(count);
    useEffect(() => {

    }, [showMap]);

    const handleSubmit = (event) => {
        // alert('A name was submitted: ' + addresses);
        console.log("handleSubmit")
        let mLatLngArr = []
        event.preventDefault();
        let addArr = []
        let add = addresses.replaceAll('bank', '').replaceAll('#', '')
        if (add.includes('~')) {
            addArr = add.split('~')
        }
        // console.log("addArr", addArr)
        for (let i = 0; i < addArr.length; i++) {
            const el = addArr[i].replace(',', '')
            if (!el) {
                continue
            }
            fetch(URL + el)
                .then(response => response.json())
                .then(data => {
                    console.log("Response", data)
                    if (data.results.length > 0) {
                        console.log("Res location", data.results[0].geometry.location)
                        let location = data.results[0].geometry.location
                        for (let i = 0; i < data.results.length; i++) {
                            const element = data.results[i];
                            let pin = el.substr(el.length - 7);
                            console.log("pincode", pin)
                            pin = parseInt(pin) + ''
                            console.log("pincode:", element.formatted_address)
                            console.log("pincode:", element.formatted_address.includes(pin))
                            if (element.formatted_address.includes(pin)) {
                                console.log("pincode includes=====================", pin)
                                location = element.geometry.location
                                break
                            }
                        }

                        mLatLngArr.push({ location, address: el })
                        console.log("mLatLngArr", mLatLngArr.length)
                        //  setLatLngArr(mLatLngArr)
                        handleResponse(mLatLngArr)

                    }
                }
                )
                .catch(error => console.error(error));


        }
    }


    const geocodeApiCallLatLngToAddress = () => {
        let latLng = `${centerLat},${centerLng}`
        fetch(URL_LATLNG + latLng)
            .then(response => response.json())
            .then(data => {
                console.log("Response", data)
                if (data.results.length > 0) {
                    console.log("Res location", data.results[0])
                    let address = data.results[0].formatted_address
                    setCenterAddress(address)


                }
            }
            )
            .catch(error => console.error(error));
    }
    const handleResponse = (mLatLngArr) => {
        console.log("latLngArr", latLngArr.length)
        // setSelectedGrp('hhhh' + mLatLngArr.length)
        setCount(mLatLngArr.length)
        setLatLngArr(mLatLngArr)
    }
    const handleChange = (event) => {
        setAddresses(event.target.value)
    }
    const handleCenterLat = (event) => {
        setCenterLat(event.target.value)
    }
    const handleCenterLng = (event) => {
        setCenterLng(event.target.value)
    }
    const onSelectDistanceFormula = (event) => {
        setSelectedDistanceFormula(event.target.value)
    }
    const onFilterSelected = (event) => {
        setOnDisFilterSelected(event.target.value)
    }
    const onSelectGrp = (event) => {
        // setAddresses(event.target.value)
        console.log('onSelectGrp', event.target.value)
        setSelectedGrp(event.target.value)
        // geocodeApiCallLatLngToAddress()

        // let grpArr = []
        // for (let i = 0; i < latLngArr.length; i++) {
        //     const p = latLngArr[i];
        //     const l = p.location

        //     const a = [centerLat, centerLng]
        //     const b = [l.lat, l.lng]
        //     console.log('disInkm', l)
        //     let disInkm = calcCrow(centerLat, centerLng, l.lat, l.lng)//haversineDistance(a, b)/1000
        //     console.log('disInkm', disInkm)

        //     if (disInkm <= event.target.value) {
        //         console.log('disInkm', disInkm)
        //         console.log('disInkm', p.address)
        //         if (grpArr.length == 0) {
        //             grpArr.push(p)
        //         } else {
        //             let isExist = false
        //             for (let k = 0; k < grpArr.length; k++) {
        //                 const element = grpArr[k];
        //                 if (element.address == p.address) {
        //                     isExist = true

        //                 }


        //             }
        //             if (!isExist)
        //                 grpArr.push(p)

        //         }



        //     }





        // }
        // // console.log('disInkm', grpLatLngArr)
        // setCount(grpArr.length)
        // setGrpLatLngArr(grpArr)

    }
    const calculaterDistanse = () => {
        // setAddresses(event.target.value)
        console.log('calculaterDistanse')
        geocodeApiCallLatLngToAddress()

        let grpArr = []
        for (let i = 0; i < latLngArr.length; i++) {
            const p = latLngArr[i];
            const l = p.location

            const a = [centerLat, centerLng]
            const b = [l.lat, l.lng]
            console.log('disInkm', l)
            let disInkm = calcCrow(centerLat, centerLng, l.lat, l.lng)

            console.log('disInkm', disInkm)
            let dis = Math.round(disInkm)
            if (dis <= selectedGrp) {
                console.log('disInkm', disInkm)
                console.log('disInkm', p.address)
                if (grpArr.length == 0) {
                    p['distance'] = disInkm
                    grpArr.push(p)

                } else {
                    let isExist = false
                    for (let k = 0; k < grpArr.length; k++) {
                        const element = grpArr[k];
                        if (element.address == p.address) {
                            isExist = true

                        }


                    }
                    if (!isExist) {
                        p['distance'] = disInkm
                        grpArr.push(p)
                    }


                }



            }





        }
        // console.log('disInkm', grpLatLngArr)
        if (selectedGrp && grpArr.length > 0) {
            grpMap.set(selectedGrp, grpArr)
            let copyArr = [...grpArr]
            grpMapCopy.set(selectedGrp, copyArr)
        }

        setGrpCount(grpArr.length)
        setGrpLatLngArr(grpArr)

    }
    const getDistanseLatLng = (p1, p2) => {

        let disInkm = calcCrow(p1.lat, p1.lng, p2.lat, p2.lng)//haversineDistance(a, b)/1000
        console.log('disInkm', disInkm)

        return disInkm


    }
    const getGrpMapEntries = () => {

        let grpArr = Array.from(grpMap, ([grp, value]) => ({ grp, value }));
        return grpArr
    }
    const drawCircleOnMap = () => {
        if (!circleStartPoint)
            return
        let location = circleStartPoint.split(',')
        let lat = Number(location[0])
        let lng = Number(location[1])
        setCircleStartLocation({ lat, lng })
        setTimeout(() => {
            setShowMap(!showMap)
        }, 1000);
    }
    let isExactMatch = false
    let isExactMatchValue = 0
    const seachInGroup = () => {
        if (!searchLatLng)
            return
        isExactMatch = false
        //console.log('searchResult', searchResult)
        setSearchResult({ grp: '', remark: '' })
        let search = searchLatLng.split(',')
        let p1 = { lat: search[0], lng: search[1] }
        let p2 = { lat: centerLat, lng: centerLng }
        let dis = getDistanseLatLng(p1, p2)

        matchDistanceWithGroups(dis)

        // let arr = getGrpMapEntries()
        // for (let i = 0; i < arr.length; i++) {
        //     const { grp, value } = arr[i];
        //     for (let i = 0; i < value.length; i++) {
        //         const element = value[i];
        //         let search = searchLatLng.split(',')
        //         let p1 = { lat: search[0], lng: search[1] }
        //         let dis = getDistanseLatLng(p1, element.location)
        //         if (search[0] == element.location.lat && search[1] == element.location.lng)
        //             continue
        //         matchDistanceWithGroups(dis)


        //     }

        // }
    }
    const disFilterInGroup = (grpName) => {
        console.log('grpName', grpName)
        let getGrpData = ''
        if (!grpMapCopy.size) {

            let jsonText = JSON.stringify(Array.from(grpMap.entries()))
            let copies = new Map(JSON.parse(jsonText));
            console.log('getGrpData copies', copies)
            setGrpMapCopy(copies)
            getGrpData = grpMap.get(grpName)
        } else {
            let grpData = grpMapCopy.get(grpName)
            if (grpData)
                getGrpData = JSON.parse(JSON.stringify(grpData))
        }
        console.log('getGrpData getGrpData', grpMapCopy)
        if (!getGrpData) {
            return
        }
        console.log('getGrpData', getGrpData.length)
        const result = getGrpData.filter((item) => {

            let dis = Math.round(item.distance)
            console.log('distanse', dis)
            return dis == onDisFilterSelected;
        })
        grpMap.set(grpName, result)
        console.log('result', result.length, onDisFilterSelected)
        setGrpMap(grpMap)
        setRefesh(!refesh)
        //setGrpCount(result.length)

        // if(onDisFilterSelected)


    }
    const clearFilterInGroup = (grpName) => {
        console.log('grpName', grpName)
        let getGrpData = ''
        if (!grpMapCopy.size) {

            let jsonText = JSON.stringify(Array.from(grpMap.entries()))
            let copies = new Map(JSON.parse(jsonText));
            console.log('getGrpData copies', copies)
            setGrpMapCopy(copies)
            getGrpData = grpMap.get(grpName)
        } else {
            let grpData = grpMapCopy.get(grpName)
            if (grpData)
                getGrpData = JSON.parse(JSON.stringify(grpData))
        }
        console.log('getGrpData getGrpData', grpMapCopy)
        if (!getGrpData) {
            return
        }
        console.log('getGrpData', getGrpData.length)
        const result = getGrpData.filter((item) => {

            let dis = Math.round(item.distance)
            console.log('distanse', dis)
            return dis <= grpName;
        })
        grpMap.set(grpName, result)
        console.log('result', result.length, onDisFilterSelected)
        setGrpMap(grpMap)
        setRefesh(!refesh)
        //setGrpCount(result.length)

        // if(onDisFilterSelected)


    }
    const matchDistanceWithGroups = (dis) => {
        let keys = Array.from(grpMap.keys());
        //keys.sort()
        if (grpMap.size > 0)
            keys.sort(function (a, b) { return a - b });
        console.log('grp keys', keys)
        for (let i = 0; i < keys.length; i++) {

            const grp = keys[i];
            console.log('dis', dis)
            //console.log('dis grp', grp, dis <= grp)
            let round = Math.round(dis)
            console.log('dis round', round)
            let disInt = round//Number((round).toFixed(0))//parseInt(dis)
            if (grp == disInt) {
                console.log('dis grp match', dis)
                console.log('dis grp match', disInt, grp)
                console.log('dis grp match:', isExactMatchValue, isExactMatchValue > disInt)
                setSearchResult({ grp, remark: 'exact match', dis })
                // if (isExactMatch && isExactMatchValue > disInt) {
                //     setSearchResult({ grp, remark: 'exact match' })
                //     isExactMatchValue = disInt
                // }

                return true
            } else {
                if (!isExactMatch) {
                    var closest = keys.reduce(function (prev, curr) {
                        return (Math.abs(curr - dis) < Math.abs(prev - dis) ? curr : prev);
                    });
                    setSearchResult({ grp: closest, remark: 'closest match', dis })
                }
            }

        }
        return false
    }
    async function calcDisDriving(assdress) {
        let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${centerAddress}&destinations=${assdress}&key=${API_KEY}`
        const response = await fetch(url);
        const jResponse = await response.json();
        // waits until the request completes...
        let rows = jResponse.rows
        console.log('response', rows);

        if (rows && rows.length > 0) {
            if (rows[0] && rows[0].elements && rows[0].elements.length > 0) {
                let dis = rows[0].elements[0].distance.value / 1000
                return dis
                console.log('response dis', dis);
            }
        }
    }
    var mapCenter = { lat: 28.61343597450134, lng: 77.45505392362305 }
    var myRadius = .44
    const createNotOverlapingCircleRectangle = (center) => {
        let circles = []
        let maxRadius = 1000
        let starCount = 0
        // while (circles.length < 100) {

        starCount++
        //let minMap = findNearestAddres(latLngArr)
        //28.6185117,77.4521056
        // let center = { lat: 28.61343597450134, lng: 77.45505392362305 }
        //45.6
        let lastCenter = center
        let incresingFactor
        for (let i = 0; i < 300; i++) {
            console.log('center:', center)
            let location = getDisBasedOnDegree(lastCenter, 0, myRadius * 2 * 1150)
            // let circle = {
            //     location,
            //     r: myRadius//randomIntFromInterval(10, 20)
            // }
            // if (i / 10 == 1) {
            //     location = getDisBasedOnDegree(center, 1.55, myRadius * 2 * 1000)
            // }
            // if (i / 10 == 2) {
            //     location = getDisBasedOnDegree(center, 4.9, myRadius * 2 * 1000)
            // }
            // if (i / 10 == 3) {
            //     location = getDisBasedOnDegree(center, 40.8, myRadius * 2 * 1000)
            //     location.lat = location.lat - 0.016
            // }

            // if (i / 10 == 4) {
            //     location = getDisBasedOnDegree(center, 40.8, myRadius * 2 * 1000)
            //     location = location.lng + 0.0005
            // }
            let remider = i / 20
            if (remider == 1) {
                location.lat = center.lat - 0.008
                location.lng = center.lng + 0.0090
            }

            if (Number.isInteger(remider)) {
                location.lat = center.lat - 0.008 * remider
                location.lng = center.lng + 0.0090 * 1

            }

            // if (remider == 2) {
            //     location.lat = center.lat - 0.008 * remider
            //     location.lng = center.lng + 0.0090 * 1

            // }
            // if (remider == 3) {
            //     location.lat = center.lat - 0.008 * remider
            //     location.lng = center.lng + 0.0090 * 1

            // }
            // if (remider == 4) {
            //     location.lat = center.lat - 0.008 * remider
            //     location.lng = center.lng + 0.0090 * 1

            // }
            lastCenter = location
            let circle = {
                location,
                r: myRadius//randomIntFromInterval(10, 20)
            }

            circles.push(circle)
        }

        console.log("createNotOverlapingCircle:", circles)
        console.log("createNotOverlapingCircle:", circles.length)
        if (starCount >= breakCount) {

            return circles
        }
        // }

        return circles

    }

    //var mapCenter = { lat: 28.602095449208175, lng: 77.47050344080783 }
    const createNotOverlapingCircle5 = (center) => {
        let circles = []
        let maxRadius = 1000
        let starCount = 0
        // while (circles.length < 100) {

        starCount++
        //let minMap = findNearestAddres(latLngArr)
        //28.6185117,77.4521056
        // let center = { lat: 28.61343597450134, lng: 77.45505392362305 }

        let lastCenter = center
        for (let i = 0; i < 10; i++) {
            let location = getDis(center, lastCenter)
            let circle = {
                location,
                r: 1//randomIntFromInterval(10, 20)
            }
            lastCenter = location

            circles.push(circle)
        }

        console.log("createNotOverlapingCircle:", circles)
        console.log("createNotOverlapingCircle:", circles.length)
        if (starCount >= breakCount) {

            return circles
        }
        // }

        return circles

    }
    const createNotOverlapingCircle4 = () => {
        let circles = []
        let maxRadius = 1000
        let starCount = 0
        // while (circles.length < 100) {

        starCount++
        //let minMap = findNearestAddres(latLngArr)
        //28.6185117,77.4521056
        let center = { lat: 28.6185117, lng: 77.4521056 }
        console.log('getDis:', getDis(center, center))
        let lastCenter = center
        for (let i = 0; i < 10; i++) {
            let location = getNewLatLngOnDegree(lastCenter, '')
            let circle = {
                location,
                r: 1//randomIntFromInterval(10, 20)
            }
            lastCenter = location

            circles.push(circle)
        }

        console.log("createNotOverlapingCircle:", circles)
        console.log("createNotOverlapingCircle:", circles.length)
        if (starCount >= breakCount) {

            return circles
        }
        // }

        return circles

    }
    const breakCount = 100000

    const createNotOverlapingCircle3 = () => {
        let circles = []
        let maxRadius = 1000
        let starCount = 0
        // while (circles.length < 100) {
        starCount++
        //let minMap = findNearestAddres(latLngArr)
        for (let i = 0; i < 5000; i++) {

            let center = { lat: 28.6359439, lng: 77.2290188 }
            let circle = {
                location: generateRandomPoint(center, 10000),
                r: 1//randomIntFromInterval(10, 20)
            }
            let overLapping = false
            for (let j = 0; j < circles.length; j++) {
                let other = circles[j];
                let d = getDistanseLatLng(circle.location, other.location)
                // d = Math.round(d)
                // console.log("createNotOverlapingCircle d:", d)
                // console.log("createNotOverlapingCircle r:", circle.r + other.r)
                if (d < circle.r + other.r) {
                    //they are overlaping
                    overLapping = true
                    break
                }

            }
            if (!overLapping)
                circles.push(circle)
        }

        console.log("createNotOverlapingCircle:", circles)
        console.log("createNotOverlapingCircle:", circles.length)
        if (starCount >= breakCount) {

            return circles
        }
        // }

        return circles

    }

    const createNotOverlapingCircle2 = () => {
        let circles = []
        let maxRadius = 1000
        let starCount = 0
        // while (circles.length < 100) {
        starCount++
        //let minMap = findNearestAddres(latLngArr)
        for (let i = 0; i < latLngArr.length; i++) {
            const element = latLngArr[i];
            // maxRadius = maxRadius - 1
            // if (maxRadius < 0) {
            //     return circles
            // }
            let circle = {
                location: element.location,
                r: 5//randomIntFromInterval(10, 20)
            }
            let overLapping = false
            for (let j = 0; j < circles.length; j++) {
                let other = circles[j];
                let d = getDistanseLatLng(circle.location, other.location)
                d = Math.round(d)
                // console.log("createNotOverlapingCircle d:", d)
                // console.log("createNotOverlapingCircle r:", circle.r + other.r)
                if (d < circle.r + other.r) {
                    //they are overlaping
                    overLapping = true
                    break
                }

            }
            if (!overLapping)
                circles.push(circle)
        }

        console.log("createNotOverlapingCircle:", circles)
        console.log("createNotOverlapingCircle:", circles.length)
        if (starCount >= breakCount) {

            return circles
        }
        // }

        return circles

    }

    const createNotOverlapingCircle = () => {
        let circles = []
        let maxRadius = 1000
        let starCount = 0
        while (circles.length < latLngArr.length) {
            starCount++
            for (let i = 0; i < latLngArr.length; i++) {
                const element = latLngArr[i];
                maxRadius = maxRadius - 1
                if (maxRadius < 0) {
                    return circles
                }
                let circle = {
                    location: element.location,
                    r: maxRadius//randomIntFromInterval(0, 20)
                }
                let overLapping = false
                for (let j = i + 1; j < latLngArr.length; j++) {
                    let otherEl = latLngArr[j];
                    let other = {
                        location: otherEl.location,
                        r: maxRadius//randomIntFromInterval(0, 20)
                    }
                    let d = getDistanseLatLng(circle.location, other.location)
                    d = Math.round(d)
                    // console.log("createNotOverlapingCircle d:", d)
                    console.log("createNotOverlapingCircle d,r:", d, circle.r + other.r)
                    if (d == circle.r + other.r) {
                        //they are overlaping
                        overLapping = true
                        break
                    }

                }
                if (overLapping)
                    circles.push(circle)
            }

            console.log("createNotOverlapingCircle:", circles)
            console.log("createNotOverlapingCircle:", circles.length)
            if (starCount >= breakCount) {
                break
                return circles
            }
        }

        return circles

    }
    const findNearestAddres = (addressArr) => {
        let minDisMap = new Map()
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

        return minDisMap
        //setRefresh(!refresh)
        // setRefesh(!refesh)
    }
    const getGRPNameFromValue = (value) => {
        switch (value) {
            case '0':
                return "A"
                break;
            case '1':
                return "B"
                break;
            case '2':
                return "C"
                break;
            case '3':
                return "D"
                break;
            case '4':
                return "E"
                break;
            case '5':
                return "F"
                break;
            case '10':
                return "G"
                break;
            case '20':
                return "H"
                break;
            case '30':
                return "I"
                break;
                break;
            case '40':
                return "J"
                break;
                break;
            case '50':
                return "K"
                break;

            default:
                return ''
        }

    }
    return (
        <div style={{ padding: 100, background: '#dddddd', marginTop: 20 }}>
            <div style={{ marginTop: -50 }}>

                <h2>Enter Address Data Separated by tilde(~):</h2>
                <form onSubmit={handleSubmit}>
                    <label>

                        <textarea style={{ width: '100%', height: 200, wordWrap: 'break-word', wordBreak: 'break-all' }}
                            placeholder="Enter address by tilde(~) separated" type="text" value={addresses} onChange={handleChange} />
                    </label>


                    <br></br>
                    <input className="button-small" type="submit" value="Map Address" />
                </form>
            </div>
            <hr />
            <div>
                <h2>Address Maped with latitude longitude </h2>
                <h3>Total Results:<span style={{ background: 'yellow', paddingLeft: 2, paddingRight: 2 }}>{latLngArr && latLngArr.length}</span> </h3>
                <div style={{ height: 400, overflowY: 'scroll', background: '#fff', padding: 10 }}>

                    {
                        latLngArr && latLngArr.map((item) => {
                            return <div>
                                <p style={{ fontSize: 14 }}>{item.address}</p>
                                <p style={{ fontSize: 14 }}>{item.location.lat} , {item.location.lng}</p>
                                <hr></hr>
                            </div>
                        }
                        )
                    }
                </div>
                <p style={{ marginTop: 40 }} ></p>
                <h2>Select Group</h2>
                <hr></hr>
                <label for="cars">Choose a Group Redius:</label>

                <select name="cars" id="cars" onChange={onSelectGrp}>
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                    <option value="4">E</option>
                    <option value="5">F</option>
                    <option value="10">G</option>
                    <option value="20">H</option>
                    <option value="30">I</option>
                    <option value="40">J</option>
                    <option value="50">K</option>
                    {/* <option value="60">L</option>
                    <option value="70">M</option>
                    <option value="80">N</option>
                    <option value="90">O</option>
                    <option value="100">P</option> */}
                    {/* <option value="200">200 km</option>
                    <option value="300">300 km</option>
                    <option value="400">400 km</option>
                    <option value="500">500 km</option>
                    <option value="1000">1000 km</option>
                    <option value="2000">2000 km</option> */}
                    {/* <option value="0">0 km</option>
                    <option value="1">1 km</option>
                    <option value="2">2 km</option>
                    <option value="3">3 km</option>
                    <option value="4">4 km</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="20">20 km</option>
                    <option value="30">30 km</option>
                    <option value="40">40 km</option>
                    <option value="50">50 km</option>
                    <option value="60">60 km</option>
                    <option value="70">70 km</option>
                    <option value="80">80 km</option>
                    <option value="90">90 km</option>
                    <option value="100">100 km</option>
                    <option value="200">200 km</option>
                    <option value="300">300 km</option>
                    <option value="400">400 km</option>
                    <option value="500">500 km</option>
                    <option value="1000">1000 km</option>
                    <option value="2000">2000 km</option> */}
                </select>
                {/* <label for="cars">Select distance calculation method:</label>
                <select name="cars" id="cars" onChange={onSelectDistanceFormula}>
                    <option value="0">Haversine formula</option>
                    <option value="1">Google driving distance</option>
                </select> */}
                <h4>Select Center Point</h4>
                <form >
                    <label style={{ marginTop: 20, paddingTop: 20 }}>
                        Center Latitude:
                        <input style={{ marginLeft: 13 }}
                            placeholder="Enter  Center Latitude" type="text" value={centerLat} onChange={handleCenterLat} />
                    </label>
                    <br></br>
                    <label>
                        Center Longitude:
                        <input
                            placeholder="Enter  Center Longitude" type="text" value={centerLng} onChange={handleCenterLng} />
                    </label>
                    <br></br>
                    <input style={{ marginLeft: 131, marginTop: 10, width: 147 }} className="button-small" type="button" value="Submit" onClick={calculaterDistanse} />
                </form>
                <h4>Selected group Redius : {selectedGrp} km</h4>
                <h3>Center Location</h3>
                <p>({centerLat},{centerLng}), Address: {centerAddress}</p>
                <h4>Total Match Result : <span style={{ background: 'yellow', paddingLeft: 2, paddingRight: 2 }}>{grpCount}</span></h4>
                <div style={{ height: 400, overflowY: 'scroll', background: '#fff', padding: 10 }}>
                    {
                        grpLatLngArr && grpLatLngArr.map((item) => {
                            return <div>
                                <p style={{ fontSize: 14 }}>{item.address}</p>
                                <p style={{ fontSize: 14 }}>{item.location.lat} , {item.location.lng}</p>
                                <hr></hr>

                            </div>
                        }
                        )
                    }

                </div>
            </div>

            <h2 style={{ marginTop: 40 }}>Created Group</h2>
            <hr></hr>
            <h4>Total Groups: {grpMap.size}</h4>
            <div style={{ height: 400, overflowY: 'scroll', background: '#fff', padding: 10 }}>
                {
                    grpMap.size > 0 && getGrpMapEntries().map((item) => {
                        return <div>
                            <p style={{ fontSize: 14 }}>Group Name : <span style={{ fontWeight: 'bold' }}>{getGRPNameFromValue(item.grp)} ({item.grp} km)</span>, Address count: {item.value.length} <span style={{ fontWeight: 'bold', color: '#0069c2' }} onClick={() => {

                                if (grpOnMouceOver == item.grp) {
                                    console.log('onclick grpOnMouceOver', grpOnMouceOver)
                                    setGrpOnMouceOver('-1')

                                } else {
                                    setGrpOnMouceOver(item.grp)
                                }

                            }
                            }>{grpOnMouceOver == item.grp ? 'Hide' : 'Show Addess'}</span></p>
                            {
                                grpOnMouceOver == item.grp && <div style={{ marginLeft: 20 }}>
                                    <div style={{ position: 'relative', paddingBottom: 20 }}>
                                        {/* <p>Filter in Group</p> */}
                                        <div style={{ right: 0, position: 'absolute' }}>
                                            <label for="cars">Filter in Group : </label>
                                            <select name="cars" id="cars" onChange={onFilterSelected}>
                                                <option value="0">0 km</option>
                                                <option value="1">1 km</option>
                                                <option value="2">2 km</option>
                                                <option value="3">3 km</option>
                                                <option value="4">4 km</option>
                                                <option value="5">5 km</option>
                                                <option value="10">10 km</option>
                                                <option value="20">20 km</option>
                                                <option value="30">30 km</option>
                                                <option value="40">40 km</option>
                                                <option value="50">50 km</option>
                                                <option value="60">60 km</option>
                                                <option value="70">70 km</option>
                                                <option value="80">80 km</option>
                                                <option value="90">90 km</option>
                                                <option value="100">100 km</option>
                                                <option value="200">200 km</option>
                                                <option value="300">300 km</option>
                                                <option value="400">400 km</option>
                                                <option value="500">500 km</option>
                                                <option value="1000">1000 km</option>
                                                <option value="2000">2000 km</option>
                                            </select>
                                            <input style={{ marginLeft: 10, marginTop: 10, width: 100 }} type="button" value="Filter" onClick={() => disFilterInGroup(item.grp)} />
                                            <input style={{ marginLeft: 10, marginTop: 10, width: 100 }} type="button" value="Clear Filter" onClick={() => clearFilterInGroup(item.grp)} />
                                        </div>


                                    </div>
                                    {
                                        item.value.map((add, index) => <div>
                                            <p style={{ fontSize: 14 }}>{index + 1}:{add.address}</p>
                                            <p style={{ fontSize: 14 }}> {add.location.lat},{add.location.lng} {add.distance ? ', Distance : ' + Number((add.distance).toFixed(2)) + ' km' : add.distance == 0 ? '0 km' : 'NA'}</p>
                                            {
                                                item.value.length != index + 1 &&
                                                <hr style={{ borderTop: '1px dotted red' }}></hr>
                                            }

                                        </div>

                                        )
                                    }
                                </div>
                            }

                            <hr></hr>
                        </div>
                    }
                    )
                }
            </div>
            <h2 style={{ marginTop: 40 }}> Search in Group</h2>
            <hr></hr>
            <label style={{ fontSize: 'larger' }}>
                Enter Latitude Longitude by comma(,) separated :
                <input style={{ width: 200, height: 23, marginLeft: 5 }}
                    placeholder="Enter  Latitude Longitude" type="text" value={searchLatLng} onChange={(event) => setSearchLatLng(event.target.value)} />
                <input style={{ marginLeft: 20, marginTop: 10, width: 100 }} className="button-small" type="button" value="Search" onClick={seachInGroup} />
            </label>
            {
                searchResult && searchResult.grp && <div>
                    <p>Rearch in Group</p>
                    <p><span style={{ fontWeight: 'bold' }}>{getGRPNameFromValue(searchResult?.grp)} ({searchResult?.grp} km)</span>, <span style={{ background: 'yellow', paddingLeft: 2, paddingRight: 2 }}>{searchResult?.remark}</span>, distance: {searchResult?.dis} km</p>
                </div>
            }
            <div style={{ marginTop: 50 }}></div>
            <h2 style={{ marginTop: 40 }}> Draw Circle on Map</h2>
            <hr></hr>
            <label style={{ fontSize: 'larger' }}>
                Enter Start point(Latitude ,Longitude):
                <input style={{ width: 200, height: 23, marginLeft: 5 }}
                    placeholder="Enter  Latitude Longitude" type="text" value={circleStartPoint} onChange={(event) => {
                        setCircleStartPoint(event.target.value)
                    }} />
                <input style={{ marginLeft: 20, marginTop: 10, width: 100 }} className="button-small" type="button" value={showMap ? 'Reset' : 'Draw'} onClick={drawCircleOnMap} />
            </label>
            <div style={{ marginTop: 20 }}></div>
            {
                showMap && <MyGoogleMap path={drawVertex(latLngArr)} allBranches={latLngArr} address={createNotOverlapingCircleRectangle(circleStartLocation)} ></MyGoogleMap>
            }
            {/* <MyGoogleMap address={createNotOverlapingCircle6(mapCenter)}></MyGoogleMap> */}

            {/* <DemoMap></DemoMap> */}



        </div >
    );
};


//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
//Haversine formula
function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}


// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}



export default UseMemo
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);