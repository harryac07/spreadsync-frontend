import React from 'react';
import { Story, Meta } from '@storybook/react';
import Field from '../../components/common/Field';

type SizeProps = 'large' | 'medium' | 'small';
type VariantProps = 'filled' | 'outlined' | 'standard';
interface Props {
  fullWidth: boolean;
  required: boolean;
  helperText: string;
  label: string;
  placeholder: string;
  multiline: boolean;
  onChange: () => void;
  rows: number;
  size: SizeProps;
  extrasmall: boolean;
  type: string;
  name: string;
  variant: VariantProps;
  className: any;
  defaultValue?: string;
  style: any;
  error?: boolean;
  disabled?: boolean;
}

const argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['large', 'medium', 'small'],
  },
  variant: {
    control: {
      type: 'select',
    },
    options: ['filled', 'outlined', 'standard'],
  },
};

export default {
  title: 'Components/Field',
  component: Field,
  argTypes: argTypes,
} as Meta<Props>;

const Template: Story<Props> = (args) => <Field {...args} />;
export const Single = Template.bind({});
Single.args = {
  variant: 'outlined',
  size: 'small',
  disabled: false,
  fullWidth: false,
  required: true,
  label: 'Name',
  name: 'name',
  onChange: () => null,
};

export const Multi = Template.bind({});
Multi.args = {
  variant: 'outlined',
  size: 'small',
  disabled: false,
  multiline: true,
  rows: 5,
  fullWidth: false,
  label: 'Description',
  onChange: () => null,
};
