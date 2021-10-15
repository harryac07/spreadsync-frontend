import React from 'react';
import { Story, Meta } from '@storybook/react';
import ContainerWithHeader from '../../components/ContainerWithHeader';
import Button from '../../components/common/Button';

interface Props {
  headerLeftContent?: React.ReactNode;
  headerRightContent?: React.ReactNode;
  children: any;
  elevation?: number;
  square?: boolean;
  padding: string | number;
  showHeader?: boolean;
}

const argTypes = {
  children: {
    control: false,
  },
};

export default {
  title: 'Components/Molecules/ContainerWithHeader',
  component: ContainerWithHeader,
  argTypes: argTypes,
} as Meta<Props>;

const Template: Story<Props> = (args) => <ContainerWithHeader {...args} />;

export const WithChildren = Template.bind({});
WithChildren.args = {
  padding: '10px',
  elevation: 1,
  square: true,
  headerLeftContent: 'Title left',
  headerRightContent: (
    <Button variant="outlined" color="primary" size="small" onClick={() => console.log('Edit clicked')}>
      Edit
    </Button>
  ),
  showHeader: true,
  children: (
    <div>
      I am a content of this container. I may exist or not depending upon the need.
      <br />
      Try changing me
    </div>
  ),
};

export const WithoutChildren = Template.bind({});
WithoutChildren.args = {
  padding: '10px',
  elevation: 1,
  square: true,
  headerLeftContent: 'Title left',
  headerRightContent: 'Header right',
  showHeader: true,
};
