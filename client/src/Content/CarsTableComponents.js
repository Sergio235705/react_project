import React, { useState, useRef } from 'react';
import { Table, Button, Container, Navbar, Nav, Pagination, Badge, Row, Col } from "react-bootstrap"
import { LanguageItalianContext } from '../Contexts/Contexts'
import { Link, Redirect, withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { render } from 'react-dom';
import LinguaTesto from '../Components/LInguaTesto';
import LInguaTesto from '../Components/LInguaTesto';

function CarsTable(props) {

    const whiterow = [];
    let value = true;
    for (let i = props.cars.length; i < 7; i++) { whiterow.push(i) }
    return <Table className="ml-1 pl-1 table table-striped table-hover ">
        <thead >  {/*<ThemeDarkContext.Consumer>{(value) => (*/}
            <tr>

                <th className={!props.darkmode ? "col-6 " : 'col-6 text-warning'}>
                    <LInguaTesto testoIT={"Marca"}
                        testoEN={"Brand"} />
                </th>
                <th className={!props.darkmode ? "col-6 " : 'col-6 text-warning'}>
                    <LInguaTesto testoIT={"Modello"}
                        testoEN={"Model"} />
                </th>
                <th className={!props.darkmode ? "col<-2 " : 'col-6 text-warning'}>
                    <LInguaTesto testoIT={"Categoria"}
                        testoEN={"Category"} /></th>
                <th className='col-4'></th>
            </tr>
            {/*  )}</ThemeDarkContext.Consumer>*/}
        </thead>
        <tbody>{
            props.cars.map((c) => <CarRow key={c.Modello} darkmode={props.darkmode} button={props.button}
                modello={c.Modello}
                marca={c.Marca}
                categoria={c.Categoria}
            />)}
            {whiterow.map((i) => <CarRow key={i} button={props.button}
                modello=""
                marca=""
                categoria=""
            />)}


        </tbody>
        {/*<caption style={{ captionSide: 'top' }}><h4 className="font-italic dark">Here you are some great cars:</h4></caption>*/}
    </Table>
        ;
}

function CarRow(props) {
    return <tr>
        <CarRowData modello={props.modello} darkmode={props.darkmode} button={props.button} categoria={props.categoria} marca={props.marca} />
    </tr>
}

function CarRowData(props) {
    let value = true;
    let modello = props.modello;
    let marca = props.marca;
    if (props.modello.indexOf("-") !== -1 && props.marca.length > 6) {
        if (props.modello.length > 9) { modello = props.modello.split("-").map((s) => (s[0])).join('.') }
        if (props.modello.length <= 9 && props.modello.length > 7) { modello = props.modello.slice(0, props.modello.indexOf("-") + 2) + "."; }
    }
    if (props.marca.indexOf("-") !== -1) { marca = props.marca.slice(0, props.marca.indexOf("-") + 2) + "."; }
    if (marca.length + modello.length >= 15) {
        modello = modello.slice(0, modello.length / 2 + 2) + ".";
        if (marca.length > 9)
            marca = marca.slice(0, marca.length * 2 / 3 + 2);
    }

    return <>
        {/*  <ThemeDarkContext.Consumer>{(value) => (<>*/}
        <td className={!props.darkmode ? "font-italic" : "font-italic text-light"}>{marca}</td>
        <td className={!props.darkmode ? "font-italic" : "font-italic text-light"}>{modello}</td>
        <td className={!props.darkmode ? "" : " text-light"}>{props.categoria}</td>
        {/* </> )}</ThemeDarkContext.Consumer>*/}
        <td>
            {props.button && props.modello !== "" &&
                <p className="badge btn-warning" >
                    <LInguaTesto testoEN="Avalaible" testoIT="Disponibile" /></p>}
            {!props.button && props.modello !== "" && <Link to="/newrental">
                <p className="btn btn-warning" >
                    <LInguaTesto testoEN="Rent!" testoIT="Affitta" /> </p>
            </Link>}
            {props.modello === "" && <p disabled className="btn " variant="">{"\u00a0\u00a0"}</p>}</td>
    </>;
}
// PrintTable wrap Pagine CarsTable TitleTable
function PrintTable(props) {

    return <>
        <Container className="pl-0" >
            <Navbar><Nav className={(props.page === "rent" || props.page === "offer") ? "col-12" : "col-8 px-0 py-0 mx-0 my-0"}>
                <TitleTable numcars={props.numcars} allcars={props.allcars} page={props.page} price={props.price} /></Nav>
                {props.page === "store" && <Nav className="col-3 " />}
                <Nav className="col-1 pr-5 mr-4">
                    {props.page === "store" &&
                        <Pagine numcars={props.numcars} CloF={props.CloF} page={props.page} />}
                    {props.page == "rent" && props.price &&
                        <Pagine numcars={props.numcars} CloF={props.CloF} page={props.page} />}</Nav></Navbar>


            <Navbar className={props.page === "offer" ? "pr-4 mr-4 pl-3 ml-0" : "pl-0"}>
                <Nav className="pl-0 ml-0 pr-0 mr-0"><CarsTable darkmode={props.darkmode} cars={props.cars.slice(0, 7)} button={props.page === "rent" ? true : false} /></Nav>
                {props.num > 7 && <Nav className=" pl-0 ml-0 pr-5 mr-5"><CarsTable darkmode={props.darkmode} cars={props.cars.slice(7, props.num)} button={props.page === "rent" ? true : false} /></Nav>}
            </Navbar>
        </Container>




    </>
}
function TitleTable(props) {
    let num = props.numcars;
    let num_priceit = "Ecco i modelli delle " + props.allcars + " auto disponibili,";
    let num_priceen = "Wow, " + props.allcars + " cars available, ";

    return <>
        {props.page === "store" && <h4 className="font-italic text-right">
            {<LanguageItalianContext.Consumer >{(value) => (value ? "Ecco qui alcune fantastiche auto" : "Here you are some great cars")}</LanguageItalianContext.Consumer>}
        :</h4>}

        {props.numcars != 0 && props.page === "rent" && !props.price && <h4 className="font-italic  text-left  ">  <LinguaTesto testoIT="Ecco alcune auto disponibili per te " testoEN=" Here are some cars avalaible for you" /></h4>}
        {props.numcars != 0 && props.page === "rent" && props.price &&
            <> <table>
                <tr className="py-5 my-5"> <h4 className="font-italic text-left ml-0 pl-0"> <LinguaTesto testoIT={num_priceit} testoEN={num_priceen} /> </h4> </tr>
                <tr><br></br></tr>  <tr className="py-5 my-5">  <h4 className="font-italic text-left ml-0 pl-0"> <LinguaTesto testoIT={' noleggia a soli: '} testoEN={'rent now one of these models for only: '} />
                    <Badge variant="warning">{props.price} EURO </Badge></h4></tr></table></>}
        {props.numcars === 0 && props.page === "rent" && <h4 className="font-italic text-left "> <LinguaTesto testoIT="Ci dispiace nessuna auto disponibile , prova a cambiare categoria e/o data!" testoEN="Ops, no cars avalaible , try to change date and/or category!" /></h4>}
        {props.page === "offer" && <h5 className="font-italic text-right  pl-5 ml-5"><u>
            <LinguaTesto testoIT="Risparmia con noi , Scegli una di queste auto!" testoEN=" You'll save money with us , Choose one of these cars!" /></u>
        </h5>}</>
}
class Pagine extends React.Component {
        constructor(props) {
            super(props)
        }
    onChangeForm = (ev, str) => {

        { this.props.page === "store" && this.props.CloF.FilterCars(str, "pagina", 1); }
        { this.props.page === "rent" && this.props.CloF.CarsAvalaiblePrice(str, 7); }

    };
    render() {
        let numpage = (this.props.numcars / 14);
        const vetpage = [];
        let string = ""
        for (let i = 0; i < numpage; i++) {
            vetpage.push(<Pagination.Item key={i} id="paginationblock" onClick={(ev) => this.onChangeForm(ev, i + 1)} >
                <p class="font-weight-bold text-dark">{romanize(i + 1)}</p>
            </Pagination.Item>)
        }
        return <>
            <Pagination className="border-top border-warning ">{vetpage}</Pagination>
        </>
    }

}
function romanize(num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function OptionalErrorMsg(props) {
    if (props.errorMsg)
        return <div className='alert alert-danger alert-dismissible show' role='alert'>
            <strong>Error:</strong> <span>{props.errorMsg}</span>
            <button type='button' className='close' aria-label='Close'
                onClick={props.cancelErrorMsg}> {/* needed to reset msg in state, so next time renders as null */}
                {/* do not use data-dismiss which activates bootstrap JS (incompatible with React). 
                    Alternatively, you can use react-bootstrap components */}
                <span aria-hidden='true'>&times;</span>
            </button>
        </div>;
    else
        return null;
}

function Loading(props) {
    return <div className='d-flex align-items-left'>
        <div className='spinner-border m-2' role='status' aria-hidden='true'></div>
        <strong>Loading...</strong>
    </div>;
}


export { CarsTable, Loading, OptionalErrorMsg, PrintTable, romanize }