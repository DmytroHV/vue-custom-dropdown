<template>
  <div id="app">
    <BaseDropdown
      v-model="selection"
      label="Countries"
      :options="options"
      :asyncQuery="true"
      :queryMethod="asyncFilterOptions"
      placeholder="Select a country"
    />
  </div>
</template>

<script>
import BaseDropdown from './components/BaseDropdown.vue';
import countries from './data/countries.json';
import { sanitizeString } from './utils/index';

export default {
  name: 'app',

  components: {
    BaseDropdown,
  },

  data() {
    return {
      selection: 'BE',
      options: countries,
    };
  },

  methods: {
    filterOptions(input) {
      if (input === '') {
        return this.options;
      }

      return this.options.filter(
        (option) => sanitizeString(option.label).indexOf(sanitizeString(input)) > -1,
      );
    },
    asyncFilterOptions(input) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.filterOptions(input));
        }, 2000);
      });
    },
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
