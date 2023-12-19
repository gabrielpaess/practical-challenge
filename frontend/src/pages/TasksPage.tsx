import { Container } from "react-bootstrap";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import styles from "../styles/TasksPage.module.css";
import { User } from "../models/user";

interface NotesPageProps {
    loggedInUser: User | null,
}

const TasksPage = ({ loggedInUser }: NotesPageProps) => {
    return ( 
        <Container className={styles.tasksPage}>
     <>
     {loggedInUser
        ? <NotesPageLoggedInView />
        : <NotesPageLoggedOutView />
     }
     </>
    </Container>
     );
}
 
export default TasksPage;