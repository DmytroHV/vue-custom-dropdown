import { shallowMount } from '@vue/test-utils';
import BaseDropdown from '@/components/BaseDropdown.vue';

const options = [
  {
    code: 'AL',
    label: 'Albania',
  },
  {
    code: 'BE',
    label: 'Belgium',
  },
  {
    code: 'UA',
    label: 'Ukraine',
  },
];
const CSSSelector = {
  Input: '.base-dropdown__input',
  Option: '.base-dropdown__option',
  Label: '.base-dropdown__label',
};

describe('BaseDropdown.vue', () => {
  it('should open the list of options on focus', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options },
    });

    expect(wrapper.vm.isOpen).toBe(false);
    wrapper.find(CSSSelector.Input).trigger('focus');
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it('should close the list of options when the component loses focus', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options },
    });

    const input = wrapper.find(CSSSelector.Input);

    input.trigger('focus');
    expect(wrapper.vm.isOpen).toBe(true);

    input.trigger('keydown.tab');
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it('should not close the list of options after click inside area of the component', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options },
    });

    wrapper.vm.isOpen = true;
    wrapper.trigger('click');

    expect(wrapper.vm.isOpen).toBe(true);
  });

  it('should set and emit selected value', () => {
    const country = { code: 'AL', label: 'Albania' };

    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options: [country] },
    });

    wrapper.vm.isOpen = true;
    wrapper.find(CSSSelector.Option).trigger('click');

    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.vm.selectedOption).toMatchObject(country);
    expect(wrapper.vm.inputValue).toBe(country.label);
    expect(wrapper.emitted('input')[0]).toEqual([country.code]);
    expect(wrapper.emitted('input').length).toBe(1);
  });

  it('should set and emit selected value by keyboard', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options },
    });

    wrapper.vm.isOpen = true;
    wrapper.trigger('keydown.down');
    wrapper.trigger('keydown.enter');

    const selectedOption = options[1];

    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.vm.selectedOption).toMatchObject(selectedOption);
    expect(wrapper.vm.inputValue).toBe(selectedOption.label);
    expect(wrapper.emitted('input')[0]).toEqual([selectedOption.code]);
    expect(wrapper.emitted('input').length).toBe(1);
  });

  it('should clear the input when open the list of options', () => {
    const bindedValue = options[0].code;

    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, value: bindedValue },
    });

    const input = wrapper.find(CSSSelector.Input);
    input.trigger('focus');

    expect(wrapper.vm.inputValue).toBe(null);
  });

  it('should render provided label', () => {
    const label = 'test-label';

    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, label },
    });

    const labelElement = wrapper.find(CSSSelector.Label);

    expect(labelElement.exists()).toBe(true);
    expect(labelElement.text()).toBe(label);
  });

  it('should render provided placeholder', () => {
    const placeholder = 'test-placeholder';

    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, placeholder },
    });

    expect(wrapper.find(CSSSelector.Input).element.placeholder).toBe(placeholder);
  });

  it('should disable input if prop provided', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, disabled: true },
    });

    expect(wrapper.find(CSSSelector.Input).element.disabled).toBe(true);
  });

  it('should disable autocomplete feature if filterable prop set to false', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, filterable: false },
    });

    expect(wrapper.find(CSSSelector.Input).element.readOnly).toBe(true);
  });
});
