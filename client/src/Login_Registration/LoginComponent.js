import React, { useState, useRef } from 'react';
import { OptionalErrorMsg } from "../Content/CarsTableComponents";
import { LInguaTesto } from "../Components/LInguaTesto"
import { Redirect, Link } from 'react-router-dom';
import { SpinnerPage } from '../Components/BaseComponents'
import { AlertPage } from '../Content/BMainContent'
import API from '../Api/API';
import { Form, Container, Row, Col, Nav, Navbar, Button, Alert, Spinner } from 'react-bootstrap';

function Login(props) {

    const [loginSuccess, setLoginSuccess] = useState(false);
    const [errore, setErrore] = useState(false);
    const [load, setLoad] = useState(false);
    const [manyreq, setManyReq] = useState(false);
    const [ErrServ, setErrServ] = useState(false);

    const LoginAPI = (user, pass) => {

        console.log(errore)
        setLoad(true)
        API.userLogin(user, pass).then((User) => {

            setLoginSuccess(true);   // set state to redirect in render
            setLoad(false);

            console.log(user, pass);
            props.Login(User);  // keep success info in state at App level
        }).catch(
            (errore) => {
                setErrore(true);
                if (errore === 429) { SetMany(true); }
                if (errore === 500) { setErrServ(true); }
                console.log("here");
                setLoad(false);


            }
        );
    }
    const SetMany = (value) => {
        setManyReq(true);
        setTimeout(() => {
            setManyReq(false);
            setErrore(false);
        }, 20000);

    }


    const cancelLoginErrorMsg = (value) => {
        setErrore(false);
    }

    if (loginSuccess) {
        return <Redirect to={{
            pathname: '/newrental',
        }} />;
    } else {
        if (!ErrServ)
            if (!load) {
                return <>

                    {!manyreq && errore && <AlertRed type="login" cancel={cancelLoginErrorMsg} />}
                    {!manyreq && <LoginForm LoginAPI={LoginAPI} SetLoading={props.SetLoading} cancel={cancelLoginErrorMsg} />}
                    {manyreq && <AlertRed type="loginreq" />}
                </>;
            }
            else { return <SpinnerPage /> }
        else
            return <AlertPage page="login" SetLoading={props.SetLoading} />
    }
}


function LoginForm(props) {

    const [username, setUsername] = useState(''); //useState('Sergio12@Gertz.com');
    const [password, setPassword] = useState('');  //useState('AW2906');
    const formRef = useRef();

    const setUsernameField = (value) => {
        setUsername(value);
        //props.cancel();
    }

    const setPasswordField = (value) => {
        setPassword(value);
        // props.cancel();
    }

    const doLogin = (event) => {
        //event.preventDefault();
        if (formRef.current.checkValidity()) {
            props.LoginAPI(username, password);
        } else {
            formRef.current.reportValidity();
        }
    }

    const validateForm = (event) => {
        event.preventDefault();
    }

    return <><Container >
        <Row className="py-3 mb-3"><Col xs={4}></Col><Col xs={8}>

            <form className='form ' method={'POST'}
                onSubmit={validateForm} ref={formRef}>
                <Form.Group controlID="formBasicEmail">
                    <Form.Label className=" d-md-none pb-3" >

                        <LInguaTesto testoIT={"Indirizzo email"} testoEN={"Email address"} />
                    </Form.Label>
                    <Form.Control type="email" className="d-md-none w-75 " placeholder="Enter email" onChange={(ev) => setUsernameField(ev.target.value)} />
                    <Form.Text className="text-muted">
                        <LInguaTesto testoIT={"Non preoccuparti non condivideremo mai i tuoi dati."}
                            testoEN={"  Don't worry we'll never share your personal data.."} />
                    </Form.Text>
                </Form.Group>
                <Form.Group controlID="formBasicPassword">
                    <Form.Label className=" d-md-none pb-3">Password</Form.Label>
                    <Form.Control type="password" className=" d-md-none w-75 " placeholder="Enter your password" onChange={(ev) => setPasswordField(ev.target.value)} />
                </Form.Group>

                <Form.Group controlID="formBasicEmail">
                    <Form.Label className="d-none d-md-block pb-3">

                        <LInguaTesto testoIT={"Indirizzo email"} testoEN={"Email address"} />
                    </Form.Label>
                    <Form.Control type="email" className="d-none d-md-block w-25" placeholder="Enter email" onChange={(ev) => setUsernameField(ev.target.value)} />
                </Form.Group>
                <Form.Group controlID="formBasicPassword">
                    <Form.Label className="d-none d-md-block pb-3" >Password</Form.Label>
                    <Form.Control type="password" className="d-none d-md-block w-25 " placeholder="Enter your password" onChange={(ev) => setPasswordField(ev.target.value)} />
                </Form.Group>

                <Button variant="warning rounded-circle" type="button" onSubmit={validateForm} disabled={props.waitingLogin}
                    onClick={doLogin}>Login</Button>

                <Link className="d-md-none pl-5" to="/store"><Button variant="dark rounded-circle" type="button"
                >Home</Button></Link>



            </form></Col><Col></Col></Row><Navbar className="py-3 my-3"></Navbar></Container></>

}
function RegisterForm(props) {

    const [username, setUsername] = useState(''); //useState('Sergio0@Gertz.com'); 
    const [password1, setPassword1] = useState(''); //useState('AABBCC');
    const [password2, setPassword2] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alert, setAlert] = useState(0);
    const [complete, setComplete] = useState(false);
    const [result, setResult] = useState(0);
    const [statename, setStatename] = useState(0);

    const handleErrors = (err) => {
        console.log("Error in server:" + err);
    }

    const setUsernameField = (value) => {
        setUsername(value);
        setResult(1);
    }

    const RegisterNewUser = () => {
        console.log("aaa");
        doRegister().then((result) => {
            if (result === 1) {
                if (alert == 0 && statename == 1) {
                    let Name = name + " " + lastName;
                    API.userRegister(username, Name, password1).then((result) => {
                        console.log(username);
                        setComplete(true);
                    }).catch((err) => handleErrors(err));
                }

            }
            else { setResult(-1); }
        }).catch((err) => (handleErrors))
    }

    const setNameField = (value) => {
        setName(value);
        setStatename(1);
        console.log("--");
        console.log(password1);
        console.log(password2);
    }
    const setLastNameField = (value) => {
        setLastName(value);
        setStatename(1);
    }

    const setPassword2Field = (value) => {
        setPassword2(value);
        setAlert(0)
    }
    const setPassword1Field = (value) => {
        setPassword1(value);
        setAlert(0)


    }


    const doRegister = () => {
        //event.preventDefault();
        console.log("qui");
        if (password1.length >= 5 && password2.length >= 5) {
            console.log(password1);
            console.log(password2);
            console.log("-")
            if (password1.localeCompare(password2) === 0)
                setAlert(0);
            else
                setAlert(-2);
        }
        if (name.length > 0 && lastName.length > 0)
            setStatename(1);
        else
            setStatename(-1);
        if (username) {
            if (username.split('@').length >= 2 && password1.length >= 5
                && alert == 0 && statename == 1)
                console.log("quidentro");
            return API.ValidUser(username);
        }
    }


    return <>
        <Container className=" pt-5 pb-3 mb-3 ml-3 pl-3">
            {!complete && <Form >
                <Form.Group className="w-50" controlId="formGridEmail">
                    <Form.Label className="pb-3">
                        <LInguaTesto testoIT={"Indirizzo email"} testoEN={"Email address"} />
                    </Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(ev) => setUsernameField(ev.target.value)} />
                </Form.Group>
                {result === -1 && <AlertRed type={"email"} />}

                <Form.Row className="w-75" >
                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label className="pb-3">Password</Form.Label>
                        <Form.Control type="password" minLength={5} required placeholder="Password" onChange={(ev) => setPassword1Field(ev.target.value)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridPassword2">
                        <Form.Label className="pb-3">Password</Form.Label>
                        <Form.Control type="password" required minLength={5} placeholder="Password" onChange={(ev) => setPassword2Field(ev.target.value)} />
                    </Form.Group>
                </Form.Row>
                {alert === -2 && <AlertRed type={"password"} />}
                <Form.Row className="pl-2">
                    <Form.Group >
                        <Form.Label className="pb-3">
                            <LInguaTesto testoIT={"Nome"}
                                testoEN={"First Name"} />
                        </Form.Label>
                        <Form.Control type="text" required placeholder="First Name" onChange={(ev) => setNameField(ev.target.value)} />
                    </Form.Group>




                    <Form.Group className="pl-3">
                        <Form.Label className="pb-3"> <LInguaTesto testoIT={"Cognome"}
                            testoEN={"Last Name"} /></Form.Label>
                        <Form.Control type="text" required placeholder="Last name" onChange={(ev) => setLastNameField(ev.target.value)} />
                    </Form.Group>

                </Form.Row>       {statename === -1 && <AlertRed type={"name"} />}
                <Button variant="warning " type="button" onClick={RegisterNewUser}>
                    <LInguaTesto testoIT={"Registrati"} testoEN={"Submit"} /></Button>
                <Link className="d-md-none pl-5" to="/store"><Button variant="dark rounded-circle" type="button"
                >Home</Button></Link>
            </Form>}
            {complete && <AlertGreen />}
        </Container>
    </>
}
function AlertGreen(props) {
    return <> <Alert variant="success" className="pr-5 mr-5"   >
        <Alert.Heading>

            <Link to="/login" >
                <button type="button" class="close pr-5 mr-5 pb-5 mb-5 "
                    aria-label="Close">&times;</button></Link>
        </Alert.Heading>
        <p> <LInguaTesto testoIT={"REGISTRAZIONE AVVENUTA CON SUCCESSO"}
            testoEN={"REGISTRATION WAS SUCCESSFULL"} /> </p>
    </Alert>
    </>

}
function AlertRed(props) {


    if (props.type === "login")
        return <> <Alert variant="danger" className="px-5 mx-5"  >
            <Alert.Heading> <button type="button" class="close pr-5 mr-5 pb-5 mb-5 " data-dismiss="alert"
                aria-label="Close" onClick={props.cancel}>&times;</button></Alert.Heading>
            <p>  <LInguaTesto testoIT={"Email o/e password sbagliate!"}
                testoEN={"Email/password is wrong!"} />

            </p>

        </Alert> </>
    else
        return <>  <Alert variant="danger" className="pr-5 mr-5"  >
            {props.type === "password" && <p>
                <LInguaTesto testoIT={"Le password non corrispondono!"}
                    testoEN={"Passwords not equal!"} />

            </p>}
            {props.type === "loginreq" && <p className="text-center">
                <LInguaTesto testoIT={"Troppi tentativi, il Login tornerà disponibile tra 30 secondi !"}
                    testoEN={"Many request! Login will be unlocked in 30 seconds!!"} />
            </p>}


            {props.type === "email" && <p>
                <LInguaTesto testoIT={"Username NON valido!"}
                    testoEN={"Username NOT valid!"} />
            </p>}
            {props.type === "name" && <p>
                <LInguaTesto testoIT={"Campi obbligatori!"}
                    testoEN={"Field not completed !"} />
            </p>}

        </Alert>
        </>

}

export { Login, RegisterForm };