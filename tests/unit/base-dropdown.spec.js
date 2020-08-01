import { shallowMount } from '@vue/test-utils';
import BaseDropdown from '@/components/BaseDropdown.vue';
import { sanitizeString } from '../../src/utils';
import { CSSTestSelector } from '../utils';

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

const methods = {
  queryMethodAsync: (input) => new Promise((resolve) => {
    setTimeout(() => {
      resolve(options.filter(
        (option) => sanitizeString(option.label).indexOf(sanitizeString(input)) > -1,
      ));
    }, 2000);
  }),
};

describe('BaseDropdown.vue', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should open the list of options on focus', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options },
    });

    expect(wrapper.vm.isOpen).toBe(false);
    wrapper.find(CSSTestSelector.Input).trigger('focus');
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it('should close the list of options when the component loses focus', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options },
    });

    const input = wrapper.find(CSSTestSelector.Input);

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
    wrapper.find(CSSTestSelector.Option).trigger('click');

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

  it('should preserve selected value when open the list of options', () => {
    const selectedOption = options[0];

    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, value: selectedOption.code },
    });

    const input = wrapper.find(CSSTestSelector.Input);
    input.trigger('focus');

    expect(wrapper.vm.inputValue).toBe(selectedOption.label);
  });

  it('should render provided label', () => {
    const label = 'test-label';

    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, label },
    });

    const labelElement = wrapper.find(CSSTestSelector.Label);

    expect(labelElement.exists()).toBe(true);
    expect(labelElement.text()).toBe(label);
  });

  it('should render provided placeholder', () => {
    const placeholder = 'test-placeholder';

    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, placeholder },
    });

    expect(wrapper.find(CSSTestSelector.Input).element.placeholder).toBe(placeholder);
  });

  it('should disable input if prop provided', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, disabled: true },
    });

    expect(wrapper.find(CSSTestSelector.Input).element.disabled).toBe(true);
  });

  it('should disable autocomplete feature if filterable prop set to false', () => {
    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, filterable: false },
    });

    expect(wrapper.find(CSSTestSelector.Input).element.readOnly).toBe(true);
  });

  it('should call provided queryMethod', () => {
    const queryMethodMock = jest.spyOn(methods, 'queryMethodAsync');
    const query = 'rain';

    const wrapper = shallowMount(BaseDropdown, {
      propsData: { options, asyncQuery: true, queryMethod: queryMethodMock },
    });

    wrapper.vm.inputValue = query;
    wrapper.vm.processAutocomplete();

    expect(queryMethodMock).toHaveBeenCalledTimes(1);
    expect(queryMethodMock).toHaveBeenCalledWith(query);
  });
});
