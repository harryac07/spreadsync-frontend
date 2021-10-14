import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import Button from '../components/common/Button';

export type ButtonColorProps = 'primary' | 'secondary' | 'white' | 'error';
export type SizeProps = 'large' | 'medium' | 'small' | 'xs';
interface Props {
  color?: ButtonColorProps;
  size?: SizeProps;
  disabled?: boolean;
  children: any;
  onClick: () => void;
  className: any;
  variant?: 'contained' | 'outlined' | 'text';
  startIcon;
  display;
  float?: string;
  fullWidth: boolean;
  rootStyle?: any;
}

// export default {
//   title: 'Components/Button',
//   component: Button,
// } as Meta;

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    color: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
} as Meta;

// Create a master template for mapping args to render the Button component
const Template: Story<Props> = (args) => <Button {...args}>Click</Button>;

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  size: 'medium',
  disabled: false,
  onClick: () => {},
};

export const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  size: 'medium',
  disabled: false,
  onClick: () => {},
};

/* Primary.argTypes = {
  color: {
    control: {
      type: 'primary',
    },
    options: ['primary', 'secondary', 'white', 'error'],
  },
  size: {
    control: {
      type: 'medium',
    },
    options: ['large', 'medium', 'small', 'xs'],
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
};
 */
