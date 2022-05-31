import axios from 'axios'

class GetNearestStation {
  constructor(latitude, longitude) {
    // this.apiBaseUrl = '/api/json?method=getStations'
    this.latitude = latitude
    this.longitude = longitude
  }

  async getter() {
    const response = await axios.get(
      `location/api/json?method=getStations&x=${this.latitude}&y=${this.longitude}`
    )

    return response.data
  }
}

export default GetNearestStation
