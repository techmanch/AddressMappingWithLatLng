
export const getDistanseLatLng = (p1, p2) => {

    let disInkm = calcCrow(p1.lat, p1.lng, p2.lat, p2.lng)//haversineDistance(a, b)/1000
    console.log('disInkm', disInkm)

    return disInkm


}

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

export function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
* Generates number of random geolocation points given a center and a radius.
* 
* @param  {Object} center A JS object with lat and lng attributes.
* @param  {number} radius Radius in meters.
* @return {Object} The generated random points as JS object with lat and lng attributes.
*/
export function generateRandomPoint(center, radius) {
    var x0 = center.lng;
    var y0 = center.lat;
    // Convert Radius from meters to degrees.
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    var xp = x / Math.cos(y0);

    // Resulting point.
    return { lat: y + y0, lng: xp + x0 };
}

export function getNewLatLngOnDegree(center, degree) {
    let your_meters = 1500
    var earth = 6378.137,  //radius of the earth in kilometer
        pi = Math.PI,
        cos = Math.cos,
        sin = Math.sin,
        m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

    var new_latitude = center.lat + (your_meters * m);

    //var new_longitude = center.lng + (your_meters * m) / cos(center.lat * (pi / 180));
    var new_longitude = center.lng + (your_meters * m) / sin(center.lat * (pi / 180));
    return { lat: new_latitude, lng: new_longitude };
}



// 
var gis = {
    /**
    * All coordinates expected EPSG:4326
    * @param {Array} start Expected [lon, lat]
    * @param {Array} end Expected [lon, lat]
    * @return {number} Distance - meter.
    */
    calculateDistance: function (start, end) {
        var lat1 = parseFloat(start[1]),
            lon1 = parseFloat(start[0]),
            lat2 = parseFloat(end[1]),
            lon2 = parseFloat(end[0]);

        return gis.sphericalCosinus(lat1, lon1, lat2, lon2);
    },

    /**
    * All coordinates expected EPSG:4326
    * @param {number} lat1 Start Latitude
    * @param {number} lon1 Start Longitude
    * @param {number} lat2 End Latitude
    * @param {number} lon2 End Longitude
    * @return {number} Distance - meters.
    */
    sphericalCosinus: function (lat1, lon1, lat2, lon2) {
        var radius = 6371e3; // meters
        var dLon = gis.toRad(lon2 - lon1),
            lat1 = gis.toRad(lat1),
            lat2 = gis.toRad(lat2),
            distance = Math.acos(Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon)) * radius;

        return distance;
    },

    /**
    * @param {Array} coord Expected [lon, lat] EPSG:4326
    * @param {number} bearing Bearing in degrees
    * @param {number} distance Distance in meters
    * @return {Array} Lon-lat coordinate.
    */
    createCoord: function (coord, bearing, distance) {
        /** http://www.movable-type.co.uk/scripts/latlong.html
        * φ is latitude, λ is longitude, 
        * θ is the bearing (clockwise from north), 
        * δ is the angular distance d/R; 
        * d being the distance travelled, R the earth’s radius*
        **/
        var
            radius = 6371e3, // meters
            δ = Number(distance) / radius, // angular distance in radians
            θ = gis.toRad(Number(bearing));
        var φ1 = gis.toRad(coord[1]),
            λ1 = gis.toRad(coord[0]);

        var φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) +
            Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));

        var λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
            Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));
        // normalise to -180..+180°
        λ2 = (λ2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

        return [gis.toDeg(λ2), gis.toDeg(φ2)];
    },
    /**
     * All coordinates expected EPSG:4326
     * @param {Array} start Expected [lon, lat]
     * @param {Array} end Expected [lon, lat]
     * @return {number} Bearing in degrees.
     */
    getBearing: function (start, end) {
        var
            startLat = gis.toRad(start[1]),
            startLong = gis.toRad(start[0]),
            endLat = gis.toRad(end[1]),
            endLong = gis.toRad(end[0]),
            dLong = endLong - startLong;

        var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) /
            Math.tan(startLat / 2.0 + Math.PI / 4.0));

        if (Math.abs(dLong) > Math.PI) {
            dLong = (dLong > 0.0) ? -(2.0 * Math.PI - dLong) : (2.0 * Math.PI + dLong);
        }

        return (gis.toDeg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    },
    toDeg: function (n) { return n * 180 / Math.PI; },
    toRad: function (n) { return n * Math.PI / 180; }
};

export function getDis(center, last) {
    var start = [center.lat, center.lng];
    var end = [28.61825815146375, 77.93021262663325];
    //var end = [28.616562877800085, 77.64113485366627];
    let icon_coord = [last.lat, last.lng]
    var total_distance = gis.calculateDistance(start, end); // meters
    var percent = 4.5;
    // this can be also meters
    var distance = (percent / 100) * total_distance;
    var bearing = gis.getBearing(start, end);

    var new_coord = gis.createCoord(icon_coord, bearing, distance);

    return { lat: new_coord[0], lng: new_coord[1] };
}

// r in meter
export function getDisBasedOnDegree(center, a, r) {
    let cosValue = Math.cos(a)
    let sinValue = Math.sin(a)
    let coseLat = Math.cos(center.lat)
    let eastDisplacement = r * sinValue / coseLat / 111111 // = 0.000450007 degree.
    let northDisplacement = r * cosValue / 111111 //= 0.000779423 degree.

    let newLat = center.lat + eastDisplacement
    let newLng = center.lng + northDisplacement
    return { lat: newLat, lng: newLng }

}


// convexHull algo

function convexHull(points) {
    if (points.length < 3) {
        return points;
    }

    points.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    const upper = [];
    const lower = [];

    for (const point of points) {
        while (upper.length >= 2 && isNotRightTurn(upper[upper.length - 2],
            upper[upper.length - 1], point)) {
            upper.pop();
        }
        upper.push(point);
    }

    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        while (lower.length >= 2 && isNotRightTurn(lower[lower.length - 2],
            lower[lower.length - 1], point)) {
            lower.pop();
        }
        lower.push(point);
    }

    const hull = new Set([...upper, ...lower]);
    return Array.from(hull);
}
// Nikunj Sonigara

// Function to check the correct direction
function isNotRightTurn(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 0;
}

export function drawVertex(latLngArr) {
    let points = []
    latLngArr.map((item) => {
        let arr = [item.location.lat, item.location.lng]
        points.push(arr)
    })


    let hull = convexHull(points);
    let vertexes = []
    hull.map((item) => {
        vertexes.push({ lat: item[0], lng: item[1] })
    })


    console.log('latLngArr hull', vertexes)
    // console.log('latLngArr polygon', polygon)
    return vertexes


}
