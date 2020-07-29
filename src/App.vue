<template>
  <div id="app">
    <BaseDropdown
      v-model="selection"
      label="Countries"
      :options="options"
      placeholder="Select a country"
    />
  </div>
</template>

<script>
import BaseDropdown from './components/BaseDropdown.vue';
import countries from './data/countries.json';

export default {
  name: 'app',
  components: {
    BaseDropdown,
  },
  data() {
    return {
      selection: '',
      options: countries,
    };
  },
};
</script>

<style lang="scss">
*,
*:before,
*:after {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 60px;
}
</style>
