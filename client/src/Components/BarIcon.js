import React, { useState, useRef } from 'react';
import { Navbar, Nav, NavDropdown, Row, Col, Container, Button } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { LanguageItalianContext } from '../Contexts/Contexts'
import { LInguaTesto } from './LInguaTesto'
import mondo from '../icons/mondo-destinazioni-trasporti-icona-gialla.png'
import log from '../icons/hertz-logo-.png' 
import logd from '../icons/logodark.png'
import luna from '../icons/moon_47708.png'
import sole from '../icons/if-weather-3-2682848_90785 (1).png'
function BarIcon(props) {

  return <>
    <Container >
      <Navbar id="icon" >
        {props.darkmode &&
          <Navbar.Brand className="col-4"> <Link to="/store" onClick={() => props.UpdateCars(0)}> <img className={" w-75 p-3 d-none d-md-block"} src={logd} alt="Logo" /></Link></Navbar.Brand>}
        {!props.darkmode &&
          <Navbar.Brand className="col-4"> <Link to="/store" onClick={() => props.UpdateCars(0)}> <img className={"w-75 p-3 d-none d-md-block "} src={log} alt="Logo" /></Link></Navbar.Brand>}
        <Nav className=" d-none d-md-block col-5 mt-3 pt-3 pb-0 mb-0">{props.page && props.page === "login" && <h5 className="font-italic mt-5 pt-5 mr-5 pr-5">
          <LInguaTesto testoIT={"Vieni a scoprire il nostro mondo."} testoEN={"Come and discover our world."} />
        </h5>}
          {props.page && props.page === "register" && <h5 className="font-italic mt-5 pt-5 mr-5 pr-5 ">
            <LInguaTesto testoIT={"Fornisci questi pochi dati e sarai pronto per partire."}
              testoEN={"Provide these few data and you will be ready to go with us."} />
          </h5>}
        </Nav>
        <DarkModeButton className="" ChangeMode={props.ChangeMode} darkmode={props.darkmode} />

        {!props.darkmode && <Nav className=" pr-4 mr-4"> <img className=" h-150 w-150 px-0 d-none d-md-block " src={luna} alt="Logo" /> </Nav>
        }
        {props.darkmode && <Nav className=" pr-4 mr-4 pl-2"> <img className=" h-150 w-150 px-0 d-none d-md-block " src={sole} alt="Logo" /> </Nav>
        } <Nav className="d-md-none px-3 mx-3" />
        <LangButton ChangeLang={props.ChangeLang} />

        <Nav className=" pr-0 mr-0"> <img className=" w-100 h-100 px-0 d-none d-md-block " src={mondo} alt="Logo" /> </Nav>
      </Navbar>
    </Container>

  </>
}
export { BarIcon }

function LangButton(props) {
  return <><Nav className="pl-0 ml-0" >
    <LanguageItalianContext.Consumer >
      {(value) => (
        <button className="btn btn-light" type="button" onClick={props.ChangeLang}>
          <div>{!value ? "IT" : "EN"}</div></button>)}
    </LanguageItalianContext.Consumer></Nav></>
}
function DarkModeButton(props) {
  return <><Nav className="pl-0 ml-0" >
    <button className="btn btn-light" type="button" onClick={props.ChangeMode}>
      {props.darkmode ? "LIGHT" : "DARK"} </button>
  </Nav></>
}



