import React from 'react';
import { Story, Meta } from '@storybook/react';
import { TooltipProps } from '@material-ui/core';
import Tooltip, { Props } from '../../components/common/Tooltip';

export type TooltipColorProps = 'primary' | 'secondary';
const tooltipPlacements: TooltipProps['placement'][] = [
  'bottom-end',
  'bottom-start',
  'bottom',
  'left-end',
  'left-start',
  'left',
  'right-end',
  'right-start',
  'right',
  'top-end',
  'top-start',
  'top',
];

const argTypes = {
  color: {
    control: {
      type: 'radio',
    },
    options: ['primary', 'secondary'],
  },
  placement: {
    control: {
      type: 'select',
    },
    options: tooltipPlacements,
  },
};

export default {
  title: 'Components/Atoms/Tooltip',
  component: Tooltip,
  argTypes: argTypes,
} as Meta<Props>;

// Create a master template for mapping args to render the Tooltip component
const Template: Story<Props> = (args) => (
  <Tooltip {...args}>
    <span>Hover me</span>
  </Tooltip>
);

export const Component = Template.bind({});
Component.args = {
  title: 'I am a tooltip content',
  color: 'primary',
  arrow: true,
  placement: 'top',
};
