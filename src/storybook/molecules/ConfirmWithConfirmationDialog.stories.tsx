import React from 'react';
import { Story, Meta } from '@storybook/react';
import InputConfirmationDialog, { Props } from '../../components/common/InputConfirmationDialog';

const argTypes = {};

export default {
  title: 'Components/Molecules/InputConfirmationDialog',
  component: InputConfirmationDialog,
  argTypes: argTypes,
} as Meta<Props>;

const Template: Story<Props> = (args) => <InputConfirmationDialog {...args} />;

export const Component = Template.bind({});
Component.args = {
  rootStyle: { display: 'block', height: 40, marginTop: 16 },
  variant: 'outlined',
  color: 'primary',
  title: 'Dialog title',
  alertMessage: 'This section can be used to alert the user about whats gonna happen after confirmation',
  label: 'Input label',
  placeholder: 'Input placeholder',
  valueToCheck: '',
  confirmText: 'Submit',
  ctaButtonText: 'Open',
  onConfirm: (input: string) => console.log(input),
};
