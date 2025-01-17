import { useRouter }              from 'next/router'
import React, { useState }        from 'react'
import { useUpdateTaskMutation }  from '../generated/grapghql-frontend'

interface Values {
  title: string
}

interface Props {
  id: number
  initialValues: Values
}
const UpdateTaskForm: React.FC<Props> = ({id, initialValues}) => {
  const [values, setValues]            = useState<Values>(initialValues)
  const [updateTask, {loading, error}] = useUpdateTaskMutation()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setValues((preValue) => ({...preValue, [name]: value}))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const result = await updateTask({variables: {input: {id, title: values.title}}})
      if (result.data?.updateTask) {
        router.push('/')
      }
    } catch (e) {
    }
  }

  let errorMessage = ''
  if (error) {
    if (error.networkError) {
      errorMessage = 'A network error occurred, please try again later.'
    } else {
      errorMessage = "Sorry an error occurred"
    }
  }

  return (
      <form onSubmit={handleSubmit}>
        {error && <p className="alert-error">{error.message}</p>}
        <p>
          <label className="field-title">Title</label>
          <input type="text" name="title" className="text-input" value={values.title} onChange={handleChange}/>
        </p>
        <p>
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Loading' : 'Save'}
          </button>
        </p>
      </form>
  )
}

export default UpdateTaskForm