import React from 'react';
import useProjectJobsHooks, { State, Dispatch } from '../hooks/useProjectJobsHooks';

const JobStateContext = React.createContext<State>(null);
const JobDispatchContext = React.createContext<Dispatch>(null);

const ProjectJobContextProvider = ({ children, jobId }) => {
  const [state, dispatch] = useProjectJobsHooks(jobId);
  return (
    <JobStateContext.Provider value={state}>
      <JobDispatchContext.Provider value={dispatch}>{children}</JobDispatchContext.Provider>
    </JobStateContext.Provider>
  );
};

function useProjectJobState() {
  const context = React.useContext(JobStateContext);
  if (context === undefined) {
    throw new Error('useProjectJobState must be used within a ProjectJobContextProvider');
  }
  return context;
}
function useProjectJobDispatch() {
  const context = React.useContext(JobDispatchContext);
  if (context === undefined) {
    throw new Error('useProjectJobDispatch must be used within a ProjectJobContextProvider');
  }
  return context;
}
function useJobConfig() {
  return [useProjectJobState(), useProjectJobDispatch()] as const; // state, dispatch
}

export { ProjectJobContextProvider, useProjectJobState, useProjectJobDispatch, useJobConfig };
