type StepProps = {
  label: string;
  createNewJobLabel: string;
  id: number;
}
export const jobSteps: StepProps[] = [
  {
    label: 'Job detail',
    createNewJobLabel: 'Create a job',
    id: 0
  },
  {
    label: 'Data source',
    createNewJobLabel: 'Connect data source',
    id: 1
  },
  {
    label: 'Data target',
    createNewJobLabel: 'Connect data target',
    id: 2
  }
];