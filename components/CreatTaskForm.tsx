import React, { useState }          from 'react'
import { useCreateTaskMutation }    from '../generated/grapghql-frontend';

interface Props {
    onSuccess: () => void
}
const CreateTaskForm: React.FC<Props> = ({ onSuccess }) => {
    const [title, setTitle]              = useState('')
    const [createTask, {loading, error}] = useCreateTaskMutation({
        onCompleted: () => {
            onSuccess();
            setTitle('');
        }
    });

    const handleChangeTitle = (e:  React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!loading) {
            try {
                await createTask({variables: {input: {title: title }}})
            } catch (e) {
    
            }
        }
    }
    
    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="alert-error">An error occurred.</p>}
            <input 
                type="text" 
                name="title" 
                placeholder="What would you like to get done?" 
                autoComplete="off"  
                className="text-input new-task-text-input"
                value={title}
                onChange={handleChangeTitle}
            />

        </form>
    )
}

export default CreateTaskForm