import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onSignUpclicked: () => void,
    onLoginClicked: () => void,
}

const NavBarLoggedOutView = ({onSignUpclicked, onLoginClicked }: NavBarLoggedOutViewProps) => {
    return ( 
        <>
            <Button onClick={onSignUpclicked}>Sign Up</Button>
            <Button onClick={onLoginClicked}>Log In</Button>
        </>
     );
}
 
export default NavBarLoggedOutView;