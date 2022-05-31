<template>
  <label class="input__station-label">
    <span class="input__station-description">{{ description }}</span>
    <input
      v-model="currentStation"
      @change="onChangeEvent"
      type="text"
      autocomplete="on"
      list="stations"
      class="input__station-text-form"
    />
    <datalist id="stations">
      <option v-for="station in suggestStations" :key="station">{{
        station
      }}</option>
    </datalist>
  </label>
</template>

<script>
import suggestStations from '~/config/suggestStations'

export default {
  props: {
    stations: {
      type: Array,
      default: () => []
    },
    description: {
      type: String,
      default: 'あなたの駅'
    },
    queryCurrentStation: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentStation: this.queryCurrentStation,
      suggestStations
    }
  },
  watch: {
    queryCurrentStation() {
      this.currentStation = this.queryCurrentStation
      this.onChangeEvent()
    }
  },
  mounted() {
    this.currentStation = this.queryCurrentStation
    this.onChangeEvent()
  },
  methods: {
    onChangeEvent() {
      this.$emit('change', {
        index: this.index,
        currentStation: this.currentStation
      })
    }
  }
}
</script>

<style lang="scss" src="./style.scss" />
