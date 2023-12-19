import styles from "../styles/Task.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Task as TaskModel } from "../models/task";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

interface TaskProps {
    task: TaskModel,
    onTaskClicked: (task: TaskModel) => void,
    onDeleteTaskCLicked: (note: TaskModel) => void,
    className?: string,
}

const Task = ({ task, onTaskClicked, onDeleteTaskCLicked, className }: TaskProps) => {
    const {
        title,
        text,
        createdAt,
        updatedAt
    } = task;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card 
            className={`${styles.taskCard} ${className}`}
            onClick={() => onTaskClicked(task)}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {title}
                    <MdDelete 
                    className="text-muted ms-auto"
                    onClick={(e) => {
                        onDeleteTaskCLicked(task);
                        e.stopPropagation();
                    }}/>
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Task