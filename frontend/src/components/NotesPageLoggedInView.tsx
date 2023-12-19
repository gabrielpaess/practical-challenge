import React, { useEffect, useState } from 'react';
import { Button, Spinner, Row, Col } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddEditTaskDialog from "./AddEditTaskDialog";
import styleUtils from "../styles/utils.module.css";
import { Task as TaskModel} from "../models/task";
import * as TasksApi from "../network/tasks_api";
import styles from "../styles/TasksPage.module.css";
import Task from "../components/Task";


const NotesPageLoggedInView = () => {

    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [showTasksLoadingError, setShowTasksLoadingError] = useState(false);
  
    const [showAddEditTaskDialog, setShowAddEditTaskDialog] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskModel|null>(null);

    useEffect(() => {
        async function loadTasks() {
          try {
            setShowTasksLoadingError(false);
            setTasksLoading(true);
            const tasks = await TasksApi.fetchTasks();
            setTasks(tasks);
          } catch (error) {
            console.error(error);
            setShowTasksLoadingError(true);
          } finally {
            setTasksLoading(false);
          }
        }
        loadTasks();
      }, []);
    
      async function deleteTask(task: TaskModel) {
        try {
          await TasksApi.deleteTask(task._id);
          setTasks(tasks.filter(existingTask => existingTask._id !== task._id));
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    
    const tasksGrid = 
      <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
          {tasks.map(task => (
            <Col key={task._id}>
            <Task
            task={task} 
            className={styles.task}
            onTaskClicked={setTaskToEdit}
            onDeleteTaskCLicked={deleteTask}
            />
            </Col>
        ))}
      </Row>

    return ( 
        <>
        <Button
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddEditTaskDialog(true)}>
          <FaPlus />
          Add new note
      </Button>
      {tasksLoading && <Spinner animation='border' variant='primary' />}
      {showTasksLoadingError && <p>Something went wrong. Please refresh the page.</p>}
      {!tasksLoading && !showTasksLoadingError &&
      <>
        {tasks.length > 0
        ? tasksGrid
      : <p>You don't have any tasks yet.</p>
      }
      </>
      }
      { showAddEditTaskDialog &&
        <AddEditTaskDialog
        onDismiss={() => setShowAddEditTaskDialog(false)}
        onTaskSaved={(newTask) => {
          setTasks([...tasks, newTask])
          setShowAddEditTaskDialog(false);
        }}
        />
      }
      {taskToEdit &&
      <AddEditTaskDialog
      taskToEdit={taskToEdit}
      onDismiss={() => setTaskToEdit(null)}
      onTaskSaved={(updatedTask) => {
        setTasks(tasks.map(existingTask => existingTask._id === updatedTask._id ? updatedTask : existingTask));
        setTaskToEdit(null);
      }}
      />
    }
        </>
     );
}
 
export default NotesPageLoggedInView;