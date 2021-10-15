import React from 'react';
import { Story, Meta } from '@storybook/react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';

interface Props {
  ctaToOpenModal?: any;
  header: string | React.ReactNode;
  bodyContent: string;
  cancelText: string;
  cancelCallback: () => void;
  confirmText: string;
  confirmCallback: () => void;
}

const argTypes = {
  type: {
    control: {
      type: 'radio',
    },
  },
};

export default {
  title: 'Components/Molecules/ConfirmDialog',
  component: ConfirmDialog,
  argTypes: argTypes,
} as Meta<Props>;

// Create a master template for mapping args to render the ConfirmDialog component
const Template: Story<Props> = (args) => <ConfirmDialog {...args} />;

export const Component = Template.bind({});
Component.args = {
  ctaToOpenModal: (
    <Button variant="outlined" color="primary" size="small">
      Open dialog
    </Button>
  ),
  header: <span>Confirm dialog title</span>,
  bodyContent: 'Dialog description here',
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  cancelCallback: () => console.log('cancel clicked'),
  confirmCallback: () => console.log('confirm clicked'),
};
