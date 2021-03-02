import Head                   from 'next/head';
import Error                  from 'next/error'
import TaskList               from '../components/TaskList';
import TaskFilter             from '../components/TaskFilter';
import CreateTaskForm         from '../components/CreatTaskForm'
import { useRouter }          from 'next/router';
import { initializeApollo }   from '../lib/client';
import { useEffect, useRef }  from 'react';
import { GetServerSideProps } from 'next';
import { 
  TasksQueryVariables, 
  TasksDocument, 
  TasksQuery, 
  TaskStatus, 
  useTasksQuery 
}                             from '../generated/grapghql-frontend';

const isTaskStatus= (value: string): value is TaskStatus => 
  Object.values(TaskStatus).includes(value as TaskStatus)


export default function Home() {
  const router =  useRouter()
  const status = Array.isArray(router.query.status) && router.query.status.length ? router.query.status[0] : undefined 

  if (status !== undefined && !isTaskStatus(status) ) {
    return <Error statusCode={404}></Error>
  }

  const prevStatus = useRef(status)

  useEffect(() => {
    prevStatus.current = status
  }, [status])

  const result = useTasksQuery({
    variables: {status},
    fetchPolicy: prevStatus.current === status ? 'cache-first' : 'cache-and-network'
  });
  const tasks = result.data?.tasks;


  return (
    <div>
      <Head>
        <title>Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateTaskForm onSuccess={result.refetch}/>
      {result.loading && !tasks ? 
        <p> Loading Tasks...</p> 
        : result.error ? 
        <p>An Error has occurred</p> 
        : tasks && tasks.length > 0 
        ? <TaskList tasks={tasks} /> 
        : <p className="no-task-message"> You have no tasks</p>
      }
      <TaskFilter status={status} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();
  const status = typeof context.params?.status === 'string' ? context.params.status : undefined 

  if (status === undefined || isTaskStatus(status)) {
    await apolloClient.query<TasksQuery, TasksQueryVariables>({
      query: TasksDocument,
      variables: { status }
    });
  
    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  }

  return { props: {} }
};
