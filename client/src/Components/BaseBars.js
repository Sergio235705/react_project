import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Row, Col, Container, Button, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Form, InputGroup, FormControl, Table, ButtonGroup } from 'react-bootstrap'
import { AuthContext } from '../Contexts/Contexts'
import { Link, Redirect } from 'react-router-dom';
import {AlertPage} from '../Content/BMainContent'
import {LInguaTesto} from './LInguaTesto'
import offerta from '../icons/offers-icon-31.png'
function BaseBars(props) {  

    return <>
        <Container >
            <Navbar className="row rounded border border-warning  py-0 my-0" collapseOnSelect sticky="top" expand="lg" bg={false ? "dark" : ""}  >
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <div className="col-8">


                        <Nav className="row text-center ">
                            <Nav.Link className="col " as={NavLink} to="/store" onClick={() => props.UpdateCars(0)}><p className={props.darkmode ? "text-light" : ""} >
                                <LInguaTesto testoIT={"Auto"} testoEN={"Store"} />
                            </p></Nav.Link>
                            {true && <Nav.Link className="col" as={NavLink} to="/newrental" onClick={() => props.UpdateCars(1)} ><p className={props.darkmode ? "text-light" : ""} >
                            <LInguaTesto testoIT={"Affitta"} testoEN={"Renting"}/></p></Nav.Link>}
                            <Nav.Link className="col" as={NavLink} to="/aboutus"><p className={props.darkmode ? "text-light" : ""} >
                            <LInguaTesto testoIT={"Chi siamo"} testoEN={"About us"}/></p> </Nav.Link>
                            <Nav.Link className="col " as={NavLink} to="/contacts"> <p className={props.darkmode ? "text-light" : ""} >
                            <LInguaTesto testoIT={"Contatti"} testoEN={"Contacts"}/></p></Nav.Link>
                            <Nav.Link className="col d-xl-none " as={NavLink} to="/specialoffer" onClick={() => props.UpdateCars(2)}><p className={props.darkmode ? "text-light" : ""} > 
                            <LInguaTesto testoIT={"Offerta speciale"} testoEN={"Special Offer"}/> </p></Nav.Link>
                            <Nav.Link className="col mr-0 pr-0 text-right d-none d-xl-block" as={NavLink} to="/specialoffer" onClick={() => props.UpdateCars(2)} > <p className={props.darkmode ? "text-light" : ""} > <LInguaTesto testoIT={"Offerta speciale"} testoEN={"Special Offer"}/> </p></Nav.Link>
                            <Nav.Link className="col-1 ml-0 pl-0 pr-3 mr-3 my-0 py-0 d-none d-xl-block" as={NavLink} to="/specialoffer" onClick={() => props.UpdateCars(2)}> <img className="h-100 w-75 " src={offerta} alt="Logo" /></Nav.Link>
                        </Nav >
                    </div>
                    <Nav className="col-6 pl-3 ml-3 text-right">
                        <AuthContext.Consumer >{(value) => (props.user && value && <>
                            <Navbar.Brand><p className={"font-italic px-0 py-0 mx-0 my-0"}><div className={props.darkmode ? "text-warning" : ""} ><LInguaTesto testoIT={"Benvenuto"} testoEN={"Welcome"}/> {props.user.name.split(" ")[0]} </div> </p>
                            </Navbar.Brand>
                            <NavDropdown className={props.darkmode ? "bg-warning rounded  mx-0 my-0 px-o py-0 " : "bg-warning rounded border  mx-0 my-0 px-o py-0"} title={props.darkmode ? "" : ""} id="collasible-nav-dropdown">
                                <NavDropdown.Item className={props.darkmode ? "DropItDark" : "DropItLight"} as={NavLink} to="/personal/history" onClick={() => props.UpdateRental(0)} ><LInguaTesto testoIT={"Archivio prenotazioni"} testoEN={"History"}/></NavDropdown.Item>
                                <NavDropdown.Item className={props.darkmode ? "DropItDark" : "DropItLight"} as={NavLink} to="/personal/reservations"  onClick={() => props.UpdateRental(1)}  ><LInguaTesto testoIT={"Le tue prenotazioni"} testoEN={"Check a reservation"}/></NavDropdown.Item>
                                <NavDropdown.Item className={props.darkmode ? "DropItDark" : "DropItLight"} as={NavLink} to="/personal/reports" ><LInguaTesto testoIT={"Segnalazioni"} testoEN={"Reports"}/></NavDropdown.Item>
                                <NavDropdown.Item className={props.darkmode ? "DropItDark" : "DropItLight"} as={NavLink} to="/personal/cov"><Badge variant="warning">New</Badge> Coronavirus</NavDropdown.Item>
                                <NavDropdown.Divider id="div" />
                                <NavDropdown.Item id="DropLogout" as={NavLink} to="/store" onClick={props.logout} >
                                    Logout</NavDropdown.Item>
                            </NavDropdown>


                        </>

                            ||  !value && !props.user && <>  <div class="btn-group" role="group" aria-label="Basic example"><Nav.Link className="pr-0" as={NavLink} to="/login">
                                <button class="btn btn-secondary  text-left pr-3 border border-warning "><p className="font-italic px-0 py-0 mx-0 my-0">Login</p></button> </Nav.Link>
                                <Nav.Link className="pl-0" as={NavLink} to="/register">
                                    <button class="btn btn-secondary  text-right pl-3 border border-warning "><p className="font-italic px-0 py-0 mx-0 my-0"> 
                                    <LInguaTesto testoIT={"Registrati"} testoEN={"Sign in"}/> </p></button></Nav.Link></div> </>)}</AuthContext.Consumer>

                               <p className="pl-3 mt-3"><Time/> </p>    
                    </Nav>

                </Navbar.Collapse>
            </Navbar>

        </Container>
    </>


}


class Time extends React.Component
{    constructor(props)
    {
        super(props);
        this.state={date: new Date()};
    }
    componentDidMount()
    { this.timerID=setInterval(()=> this.tick(),1000);}

    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    tick=()=>
    {this.setState((props,state)=>({date: new Date()}));}

   render(){
    return <>{this.state.date.toLocaleTimeString()}</>;}
}




    
function FooterPage(props) {
    return <>
        <Container>
            <Footer />
        </Container>



    </>
}
class Footer extends React.Component{
   constructor(props)
   {
       super(props)
       this.state={alert:false,email:null}
      
      
   }
    
    SetAlert = () =>{ 
        if(this.state.email && this.state.email.split('@').length>=2)
       this.setState((props,state)=>({alert:!this.state.alert}));
    }
    CloseAlert = () =>{
        this.setState((props,state)=>({alert:false, email : null }));
    }
    setEmail= (value) =>
    {  if(value!== null)
        this.setState((props,state)=>({ email : value }));

    }
    render() {
    return <>
        <Navbar bg="warning" className="  container position-relative rounded-top border-top border-dark " fixed="bottom" >
            <Container>
                <Form inline >
                    <div className="d-sm-none">
                    <LInguaTesto testoIT={"Aggiungi la tua email"}
       testoEN={" Add your email address!"}/> </div>
                    <InputGroup>
                        
                        <FormControl
                            placeholder="Email address"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(ev)=> this.setEmail(ev.target.value)}
                        /> <Button variant=""
                         className=" border border-dark mx-2"  type="button"
                        onClick={this.SetAlert}>
                            <LInguaTesto testoIT={"Iscriviti"}
       testoEN={"Sign up"}/> </Button>
                    </InputGroup> <p class="text-dark pt-3">
                    <LInguaTesto testoIT={"Gertz pensa ad offerte proprio per te "}
       testoEN={"Tailored Offers from Gertz"}/>
                        </p>
                </Form>
         {!this.state.alert  &&   <Nav class="px-3 py-0 ">
         <div className=" pt-2 font-italic text-dark">
                        <LInguaTesto testoIT={"Contattaci"}
       testoEN={"Contact us"}/> </div>
                    <Link to="/contacts">  <img className="px-2" height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v2/icons/instagram.svg" />
                        <img className="px-2" height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v2/icons/youtube.svg" />
                        <img className="px-2" height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v2/icons/facebook.svg" />
                        <img className="px-2" height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v2/icons/twitter.svg" /></Link> 
                    <p class="font-italic text-dark">
                    <LInguaTesto testoIT={"Progettato e pensato con tutto l'amore del mondo da Sergio Giardina"}
       testoEN={" Designed and built with all the love in the world by the Gertz team."}/>
                        </p> </Nav>
}
{this.state.alert && <AlertPage close={this.CloseAlert} page="footer"/>}
            </Container>
        </Navbar>



    </>
    }
}




export { BaseBars, FooterPage };