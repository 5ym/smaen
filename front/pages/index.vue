<template>
  <div class="contents">
    <div class="contents__inner">
      <form @submit.prevent>
        <inputStation
          :stations="['新宿', '池袋', '秋葉原']"
          :query-current-station="stationArray"
          @change="handleChangeInput"
        />
        <inputStation
          :stations="['新宿', '池袋']"
          :query-current-station="queryCurrentStation"
          :index="1"
          @change="handleChangeInput"
          description="あいての駅"
        />
        <div class="utilty__center top__button">
          <serchButton @click="handleClick" button-text="検索" />
          <serchButton
            v-if="navigator"
            @click="shareLink"
            button-text="相手にリンクを共有"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import inputStation from '~/components/inputStation'
import serchButton from '~/components/serchButton'
import GetNearestStation from '~/lib/getNearestStation'

export default {
  components: { inputStation, serchButton },
  data() {
    return {
      queryCurrentStation: this.$route.query.current_station || '',
      latitude: 0,
      longitude: 0,
      stationArray: '',
      twoPointStations: ['', '']
    }
  },
  async mounted() {
    const position = await this.getPosition()
      .then((position) => {
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      })
      .catch((err) => {
        console.error(err.message)
      })

    this.latitude = position.latitude
    this.longitude = position.longitude

    const getNearestStation = new GetNearestStation(
      this.longitude,
      this.latitude
    )

    const nearestStation = await getNearestStation.getter()

    this.stationArray = nearestStation.response.station[0].name
  },
  methods: {
    async handleClick() {
      await axios
        .get(
          `/api?first=${this.twoPointStations[0]}&second=${this.twoPointStations[1]}`
        )
        .then((res) =>
          this.$store.commit(
            'eachOthersCurrentStations/setEachOthersCurrentStations',
            {
              result: res.data.result,
              way: res.data.way,
              station: res.data.station
            }
          )
        )

      this.$router.push('/result')
    },
    getPosition(options) {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    },
    handleChangeInput(value) {
      this.twoPointStations[value.index] = value.currentStation
    },
    shareLink() {
      navigator.share({
        title: 'スマートエンカウント',
        url: `https://smaen.daco.dev?current_station=${this.twoPointStations[0]}`
      })
    }
  }
}
</script>

<style lang="scss" src="./style.scss" scoped />
