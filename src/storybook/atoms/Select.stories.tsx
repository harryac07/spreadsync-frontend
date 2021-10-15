import React from 'react';
import { Story, Meta } from '@storybook/react';
import Select, { Props } from '../../components/common/Select';

export type SelectColorProps = 'primary' | 'secondary' | 'white' | 'error';
export type SizeProps = 'large' | 'medium' | 'small';

const argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['large', 'medium', 'small'],
  },
  multiple: {
    control: false,
  },
  variant: {
    control: {
      type: 'select',
    },
    options: ['contained', 'outlined', 'text'],
  },
};

const options = [
  { key: 'Test 1', value: 'Test 1', label: 'Test 1' },
  { key: 'Test 2', value: 'Test 2', label: 'Test 2' },
  { key: 'Test 3', value: 'Test 3', label: 'Test 3' },
];

export default {
  title: 'Components/Atoms/Select',
  component: Select,
  argTypes: argTypes,
} as Meta<Props>;

// Create a master template for mapping args to render the Select component
const Template: Story<Props> = (args) => <Select {...args} />;

export const Single = Template.bind({});
Single.args = {
  fullWidth: false,
  required: true,
  size: 'small',
  extrasmall: false,
  label: 'Select',
  value: 'Test 2',
  options: options,
  onChange: (e) => console.log(e),
};

export const Multiple = Template.bind({});
Multiple.args = {
  fullWidth: false,
  required: true,
  size: 'small',
  extrasmall: false,
  label: 'Select',
  multiple: true,
  value: ['Test 3', 'Test 2'],
  options: options,
  onChange: (e) => console.log(e),
};
