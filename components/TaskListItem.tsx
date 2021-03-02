import Link                    from 'next/link';
import { Reference }            from '@apollo/client';
import React, { useEffect }    from 'react';
import { 
  Task, 
  TaskStatus, 
  useDeleteTaskMutation, 
  useUpdateTaskMutation
}                               from '../generated/grapghql-frontend';

interface Props {
    task: Task
}

const TaskListItem: React.FC<Props> = ({ task }) => {
  const [deleteTask, {loading, error}] = useDeleteTaskMutation({
    variables: {id: task.id},
    errorPolicy: 'all',
    update: (cache, result) => {
      const deletedTask = result.data?.deleteTask

      if (deletedTask) {
        cache.modify({
          fields: {
            tasks(taskRefs: Reference[], {readField}) {
              return taskRefs.filter((taskRef) => {
                return readField('id', taskRef) !== deletedTask.id;
              })

            }
          }
        })
      }
    }
  });
  const [updateStatus, {loading: updateTaskLoading, error: updateTaskError}] = useUpdateTaskMutation({errorPolicy: 'all'})

  const handleDeleteClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      await deleteTask();
    } catch (e) {
    }
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? TaskStatus.Completed : TaskStatus.Active
    updateStatus({variables: {input: {id: task.id, status: newStatus}}})
  }

  useEffect(() => {
    if (error) {
      alert("An error occurred, please try again.");
    }
  }, [error])

  useEffect(() => {
    if (updateTaskError) {
      alert('An error occurred')
    }
  }, [updateTaskError])

  return (
    <li key={task.id} className="task-list-item">
      <label className="checkbox">
        <input 
          type="checkbox" 
          onChange={handleStatusChange} 
          checked={task.status === TaskStatus.Completed}
          disabled={updateTaskLoading}
        />
        <span className="checkbox-mark">&#10003;</span>
      </label>
      <Link href="/update/[id]" as={`/update/${task.id}`}>
          <a className="task-list-item-title">{task.title}</a>
      </Link>
      <button 
        className="task-list-item-delete" 
        disabled={loading} 
        onClick={handleDeleteClick}
      >
        &times;
      </button>
    </li>
  )
}

export default TaskListItem

