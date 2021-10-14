import React from 'react';
import { Story, Meta } from '@storybook/react';
import AddIcon from '@material-ui/icons/Add';
import Button from '../../components/common/Button';

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

const argTypes = {
  color: {
    control: {
      type: 'radio',
    },
    options: ['primary', 'secondary', 'white', 'error'],
  },
  size: {
    control: {
      type: 'radio',
    },
    options: ['large', 'medium', 'small', 'xs'],
  },
  float: {
    control: {
      type: 'select',
    },
    options: ['right', 'left', 'none'],
  },
  variant: {
    control: {
      type: 'select',
    },
    options: ['contained', 'outlined', 'text'],
  },
  startIcon: {
    control: false,
  },
};

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: argTypes,
} as Meta<Props>;

// Create a master template for mapping args to render the Button component
const Template: Story<Props> = (args) => <Button {...args}>Click</Button>;

export const Normal = Template.bind({});
Normal.args = {
  variant: 'contained',
  color: 'primary',
  size: 'medium',
  disabled: false,
  fullWidth: false,
  onClick: () => {},
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  variant: 'contained',
  color: 'primary',
  size: 'medium',
  disabled: false,
  fullWidth: false,
  startIcon: <AddIcon />,
};
