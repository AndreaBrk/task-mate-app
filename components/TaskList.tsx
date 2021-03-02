import React            from 'react';
import TaskListItem     from './TaskListItem';
import { Task }         from '../generated/grapghql-frontend';

interface Props {
    tasks: Task[]
}

const Layout: React.FC<Props> = ({ tasks }) => {

    return (
        <ul className="task-list">
            {tasks && tasks.length > 0 && tasks.map((task) => {
                return (
                    <TaskListItem key={task.id} task={task}/>
                );
            })}
        </ul>
    )
}

export default Layout

