<template>
  <div class="contents">
    <div class="contents__inner">
      <p>
        集合場所は:
        <strong>
          {{ eachOthersCurrentStations.eachOthersCurrentStations.result }}
        </strong>
        です
      </p>
      <div>
        <p>{{ wayFromCurrent[0] }}から集合場所までの経路は</p>
        <ul class="stations__list">
          <li
            :key="station"
            v-for="station in wayFromCurrent"
            class="stations__list-item"
          >
            {{ station }}
          </li>
        </ul>
        <p>です。</p>
      </div>
      <div>
        <p>{{ wayFromOthers[0] }}から集合場所までの経路は</p>
        <ul class="stations__list">
          <li
            :key="station"
            v-for="station in wayFromOthers"
            class="stations__list-item"
          >
            {{ station }}
          </li>
        </ul>
        <p>です。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['eachOthersCurrentStations'])
  },
  data() {
    return {
      wayFromCurrent: []
    }
  },
  mounted() {
    this.wayFromCurrent = this.createWaysArray(
      this.eachOthersCurrentStations.eachOthersCurrentStations.way[0].includes(
        this.eachOthersCurrentStations.eachOthersCurrentStations.result
      )
        ? this.eachOthersCurrentStations.eachOthersCurrentStations.way[1]
        : this.eachOthersCurrentStations.eachOthersCurrentStations.way[0],
      this.eachOthersCurrentStations.eachOthersCurrentStations.result
    )
    this.wayFromOthers = this.createWaysArray(
      this.eachOthersCurrentStations.eachOthersCurrentStations.way[0].includes(
        this.eachOthersCurrentStations.eachOthersCurrentStations.result
      )
        ? this.eachOthersCurrentStations.eachOthersCurrentStations.way[1].reverse()
        : this.eachOthersCurrentStations.eachOthersCurrentStations.way[0].reverse(),
      this.eachOthersCurrentStations.eachOthersCurrentStations.result
    )
  },
  methods: {
    createWaysArray(array, result) {
      const newArray = []
      for (let i = 0; i < array.length; i++) {
        newArray.push(array[i].name)
        if (array[i].name === result) {
          break
        }
      }

      return newArray
    }
  }
}
</script>

<style lang="scss" src="./style.scss" scoped />
