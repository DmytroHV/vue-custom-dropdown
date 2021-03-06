<template>

  <div
    ref="dropdownContainer"
    class="base-dropdown"
    :data-test="testSelectors.Container"
    id="base-dropdown"
    @keydown.down="handleContainerArrowDownPress"
    @keydown.up="handleContainerArrowUpPress"
    @keydown.enter="handleContainerEnterKeydown"
  >

    <label
      v-if="label"
      :for="uniqueInputId"
      class="base-dropdown__label"
      :data-test="testSelectors.Label"
    >
      {{ label }}
    </label>

    <div class="base-dropdown__options-container">

      <input
        ref="dropdownInput"
        v-model="inputValue"
        type="text"
        :id="uniqueInputId"
        class="base-dropdown__input"
        :data-test="testSelectors.Input"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="!filterable"
        :name="name"
        autocomplete="off"
        autocapitalize="none"
        :aria-expanded="isOpen"
        aria-autocomplete="list"
        aria-owns="base-dropdown-options"
        role="combobox"
        spellcheck="false"
        @focus="handleInputFocus"
        @keydown.tab="handleInputTabKeydown"
      >

      <svg
        viewBox="0 0 32 32"
        class="base-dropdown__caret-icon"
        focusable="false"
        aria-hidden="true"
      >
        <path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/>
      </svg>

      <ul
        v-show="isOpen"
        class="base-dropdown__options"
        :data-test="testSelectors.OptionsList"
        id="base-dropdown-options"
        role="listbox"
      >
        <li
          v-if="isTyping"
          class="base-dropdown__option"
          tabindex="-1"
          :data-test="testSelectors.Option"
        >
          Typing...
        </li>
        <li
          v-else-if="isLoading"
          class="base-dropdown__option"
          tabindex="-1"
          :data-test="testSelectors.Option"
        >
          Loading...
        </li>
        <li
          v-else-if="!hasFilteredOptions"
          class="base-dropdown__option"
          tabindex="-1"
          :data-test="testSelectors.Option"
        >
          No options found
        </li>
        <li
          v-else
          v-for="(option, idx) in filteredOptions"
          :key="option.code"
          class="base-dropdown__option"
          :class="{
            'base-dropdown__option--selected': checkIfOptionSelected(idx),
            'base-dropdown__option--highlighted': checkIfOptionHighlighted(idx),
          }"
          :data-test="testSelectors.Option"
          tabindex="-1"
          role="option"
          :aria-selected="checkIfOptionSelected(idx)"
          @click="handleOptionClick(idx, $event)"
          @mouseover="handleOptionMouseover(idx, $event)"
        >
          {{ option.label }}
        </li>
      </ul>

    </div>

  </div>

</template>

<script>
import { debounce } from 'debounce';
import { nanoid } from 'nanoid';
import { sanitizeString } from '../utils';
import { CSSDataTestElement } from '../../tests/utils';

export default {
  name: 'base-dropdown',

  inheritAttrs: false,

  props: {
    label: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      default: () => ([]),
    },
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: 'dropdown-input',
    },
    queryMethod: {
      type: Function,
      default: null,
    },
    asyncQuery: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      inputValue: null,
      uniqueInputId: null,
      isOpen: false,
      isLoading: false,
      isTyping: false,
      selectedOption: null,
      filteredOptions: [],
      highlightedOptionIdx: 0,
      testSelectors: CSSDataTestElement,
    };
  },

  computed: {
    hasOptions() {
      return this.options.length > 0;
    },
    hasFilteredOptions() {
      return this.filteredOptions.length > 0;
    },
    lastOptionIndex() {
      return this.filteredOptions.length - 1;
    },
  },

  created() {
    this.debouncedProcessAutocomplete = debounce(this.processAutocomplete, 600);
  },

  mounted() {
    document.addEventListener('click', this.documentClickListener);
    this.uniqueInputId = `dropdown-input-${nanoid()}`;
  },

  destroyed() {
    document.removeEventListener('click', this.documentClickListener);
  },

  watch: {
    value: {
      handler(val) {
        const matchedOption = this.options.find((option) => option.code === val);
        this.selectedOption = matchedOption || null;
        this.inputValue = matchedOption?.label || null;
      },
      immediate: true,
    },
    options: {
      handler(val) {
        this.filteredOptions = val;
      },
      immediate: true,
    },
    inputValue(newVal, oldVal) {
      if (!this.isOpen) {
        return;
      }

      if (sanitizeString(oldVal) === sanitizeString(newVal)) {
        return;
      }

      this.isTyping = true;
      this.debouncedProcessAutocomplete();
    },
  },

  methods: {
    processAutocomplete() {
      this.isTyping = false;

      if (this.queryMethod && this.asyncQuery) {
        this.queryFilteredOptionsAsync();
        return;
      }

      if (this.queryMethod) {
        this.filteredOptions = this.queryFilteredOptions();
        return;
      }

      this.filterOptionsInternally();
    },
    queryFilteredOptions() {
      this.isLoading = false;
      this.filteredOptions = this.queryMethod();
      this.isLoading = true;
    },
    async queryFilteredOptionsAsync() {
      this.isLoading = true;
      try {
        this.filteredOptions = await this.queryMethod(this.inputValue);
      } catch (error) {
        this.filteredOptions = this.filterOptionsInternally();
      } finally {
        this.isLoading = false;
      }
    },
    filterOptionsInternally() {
      this.isLoading = true;

      if (this.inputValue) {
        this.filteredOptions = this.options.filter(
          (option) => sanitizeString(option.label).indexOf(sanitizeString(this.inputValue)) > -1,
        );
        this.isLoading = false;

        return;
      }

      this.isLoading = false;
      this.filteredOptions = this.options;
    },
    openDropdown() {
      this.isOpen = true;

      if (this.selectedOption) {
        this.filteredOptions = this.options;
      }
    },
    closeDropdown() {
      this.isOpen = false;
      this.inputValue = this.selectedOption?.label || null;
    },
    selectOption(optionIndex) {
      this.selectedOption = this.filteredOptions[optionIndex];
      this.$emit('input', this.selectedOption.code);
      this.closeDropdown();
    },
    selectHighlightedOption() {
      if (this.highlightedOptionIdx || this.highlightedOptionIdx === 0) {
        this.selectOption(this.highlightedOptionIdx);
        this.$refs.dropdownInput.blur();
      }
    },
    checkIfOptionSelected(optionIndex) {
      return this.selectedOption?.code === this.filteredOptions[optionIndex].code;
    },
    checkIfOptionHighlighted(optionIndex) {
      return this.highlightedOptionIdx === optionIndex;
    },
    documentClickListener(event) {
      if (!this.$refs.dropdownContainer.contains(event.target)) {
        this.closeDropdown();
      }
    },
    highlightOption(optionIndex) {
      this.highlightedOptionIdx = optionIndex;
    },
    traverseUp() {
      if (this.highlightedOptionIdx === 0) {
        this.highlightedOptionIdx = this.lastOptionIndex;

        return;
      }

      this.highlightedOptionIdx -= 1;
    },
    traverseDown() {
      if (this.highlightedOptionIdx === this.lastOptionIndex) {
        this.highlightedOptionIdx = 0;

        return;
      }

      this.highlightedOptionIdx += 1;
    },

    // Event handlers
    handleContainerArrowDownPress() {
      this.traverseDown();
    },
    handleContainerArrowUpPress() {
      this.traverseUp();
    },
    handleContainerEnterKeydown() {
      this.selectHighlightedOption();
    },
    handleInputFocus() {
      this.openDropdown();
    },
    handleInputTabKeydown() {
      this.closeDropdown();
    },
    handleOptionClick(optionIndex) {
      this.selectOption(optionIndex);
    },
    handleOptionMouseover(optionIndex) {
      this.highlightOption(optionIndex);
    },

    // Input native methods to expose outside for usage within $ref
    focus() {
      this.$refs.dropdownInput.focus();
    },
    blur() {
      this.$refs.dropdownInput.blur();
    },
  },
};
</script>

<style scoped lang="scss">
.base-dropdown {
  display: flex;
  flex-flow: column nowrap;
  text-align: left;
  max-width: 350px;
  min-width: 250px;
  font-size: 16px;
}

.base-dropdown__label {
  margin-bottom: 5px;
}

.base-dropdown__options-container {
  position: relative;
}

.base-dropdown__input {
  padding: .5em;
  width: 100%;
  border: 2px solid black;
  font-size: inherit;
}

.base-dropdown__input[disabled] {
  cursor: not-allowed;
}

.base-dropdown__input[disabled],
.base-dropdown__input[disabled] + .base-dropdown__caret-icon {
  opacity: 0.5;
}

.base-dropdown__caret-icon {
  position: absolute;
  right: 0.5em;
  width: 1.7em;
  height: 1.7em;
  top: 0.3em;
  pointer-events: none;
}

.base-dropdown__options {
  margin: 0;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
  list-style-type: none;
  border: 2px solid black;
  margin-top: -2px;
  position: absolute;
  width: 100%;
  top: 100%;
  max-height: 230px;
}

.base-dropdown__option {
  cursor: pointer;
  padding: .5em;
  border-bottom: 2px solid black;
  transition: ease .15s;

  &:last-child {
    border-bottom: none;
  }
}

.base-dropdown__option--selected {
  font-weight: bold;
  background-color: rgba(0, 0, 0, .1);
}

.base-dropdown__option--highlighted {
  background-color: rgba(0, 0, 0, .1);
}

.base-dropdown__input,
.base-dropdown__option {
  line-height: 1.25;
}
</style>
