import React from 'react';
import { Story, Meta } from '@storybook/react';
import AlertBox from '../../components/common/AlertBox';

export type AlertBoxTypeProps = 'info' | 'success' | 'error' | 'warning';
export type alignProps = 'left' | 'right' | 'center';
interface Props {
  type?: AlertBoxTypeProps;
  align?: alignProps;
}

const argTypes = {
  type: {
    control: {
      type: 'radio',
    },
    options: ['error', 'warning', 'success', 'info'],
  },
  align: {
    control: {
      type: 'radio',
    },
    options: ['left', 'right', 'center'],
  },
};

export default {
  title: 'Components/Atoms/AlertBox',
  component: AlertBox,
  argTypes: argTypes,
} as Meta<Props>;

// Create a master template for mapping args to render the AlertBox component
const Template: Story<Props> = (args) => <AlertBox {...args} />;

export const Component = Template.bind({});
Component.args = {
  type: 'info',
  align: 'left',
  children: 'I am a message',
};
