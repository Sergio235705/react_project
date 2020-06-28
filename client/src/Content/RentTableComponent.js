import React, { useState, useRef } from 'react';
import { Table, Button, Container, Navbar, Nav, Pagination, Badge, Row, Col } from "react-bootstrap"
import { LanguageItalianContext, RentContext } from '../Contexts/Contexts'
import { Link, Redirect, withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { render } from 'react-dom';
import * as moment from 'moment';
import LInguaTesto from '../Components/LInguaTesto';
import Cesto from '../icons/trash_bin_icon-icons.com_67981.png';


//Called by Page_Rentals
function RentTable(props) {
    return <>
        <RentContext.Consumer>{(value) => (value &&
            <Table className=" pt-2 mt-2 mr-5 table table-striped table-hover ">
                <thead >
                    <tr>

                        <th className={!props.darkmode ? "col-1" : 'col-1 text-warning'}>
                            <LInguaTesto testoIT={"ID Prenotazione"}
                                testoEN={"ID Rent"} />
                        </th>
                        <th className={!props.darkmode ? "col-2 " : 'col-2 text-warning'}>
                            <LInguaTesto testoIT={"Marca"}
                                testoEN={"Brand"} />
                        </th>
                        <th className={!props.darkmode ? "col-1 " : 'col-1 text-warning'}>
                            <LInguaTesto testoIT={"Modello"}
                                testoEN={"Model"} />
                        </th>

                        <th className={!props.darkmode ? "col-2 " : 'col-1 text-warning'}>
                            <LInguaTesto testoIT={"Targa"}
                                testoEN={"Plate"} />
                        </th>

                        <th className={!props.darkmode ? "col-2" : 'col-1 text-warning'}>
                            <LInguaTesto testoIT={"Inizio Noleggio"}
                                testoEN={"Rental start"} />
                        </th>

                        <th className={!props.darkmode ? "col-2 " : 'col-1 text-warning'}>
                            <LInguaTesto testoIT={"Fine Noleggio"}
                                testoEN={"Rental end"} />
                        </th>

                        <th className={!props.darkmode ? "col-1 " : 'col-1 text-warning'}>
                            <LInguaTesto testoIT={"Importo"}
                                testoEN={"Amount"} />
                        </th>
                        {props.page == "reservation" && <th className={!props.darkmode ? "col-2" : 'col-2 text-warning'}>
                        </th>}

                        <th className={!props.darkmode ? "col-1 " : 'col-1 text-warning'}>
                        </th>

                    </tr>

                </thead>
                <tbody>

                    {value.map((r) => <RentRow
                        key={r.ID} darkmode={props.darkmode} page={props.page} delete={props.delete}
                        ID={r.ID}
                        modello={r.Modello}
                        marca={r.Marca}
                        targa={r.Targa}
                        DataInizio={r.DataInizio}
                        DataFine={r.DataFine}
                        importo={r.Importo}
                    />)}


                    {
                    }
                </tbody>
                {props.page === "reservations" &&
                    <caption style={{ captionSide: 'top', padding: '10px 0px' }}><h2 className={!props.darkmode ? " font-italic text-dark pl-5" : 'font-italic text-light pl-5'}     >
                        <LInguaTesto testoIT={"Le tue prenotazioni da oggi in avanti.(Ricorda, non puoi cancellare i noleggi in corso)"}
                            testoEN={"Rentals from today. ( Attention, you cannot cancel current rentals)"} /></h2></caption>}
                {!props.page === "reservations" &&
                    <caption style={{ captionSide: 'top' }}><h2 className={!props.darkmode ? " font-italic text-dark pl-5" : 'font-italic text-light pl-5'}     >
                        <LInguaTesto testoIT={"Le tue prenotazioni fino ad oggi."}
                            testoEN={"Rentals until today"} /></h2></caption>}
            </Table>)}</RentContext.Consumer></>
        ;
}

function RentRow(props) {
    return <tr>
        <RentRowData ID={props.ID}
            modello={props.modello}
            marca={props.marca}
            targa={props.targa}
            DataInizio={props.DataInizio}
            DataFine={props.DataFine}
            importo={props.importo} page={props.page}
            darkmode={props.darkmode} delete={props.delete}
        />
    </tr>
}
function GetDateClientFormat(DATA) {
    let Data;
    Data = DATA.toString();
    Data = Data.slice(6, 8) + "-" + Data.slice(4, 6) + "-" + Data.slice(0, 4);
    return Data;

}

function GetDataServerComparable(DATA) {
    let Data;
    Data = DATA.toString();
    Data = Data.slice(0, 4) + "-" + Data.slice(4, 6) + "-" + Data.slice(6, 8);
    return Data;
}

function RentRowData(props) {
    let datalocal = moment().format('YYYY-MM-DD');
    console.log(datalocal);
    let modello = props.modello;
    let marca = props.marca;
    let datainizio = GetDateClientFormat(props.DataInizio);
    console.log(datainizio);
    let datafine = GetDateClientFormat(props.DataFine)
    let cestino = true;
    let urgente = true;
    if (moment(datalocal).isAfter(GetDataServerComparable(props.DataInizio)))
        cestino = false;
    else {
        if (!moment(datalocal).add(3, 'days').isAfter(GetDataServerComparable(props.DataInizio)))
            urgente = false;
    }

    return <>

        <td className={!props.darkmode ? "font-italic" : "font-italic text-light"}>{props.ID}</td>
        <td className={!props.darkmode ? "font-italic" : "font-italic text-light"}>{modello}</td>
        <td className={!props.darkmode ? "font-italic" : "font-italic text-light"}>{marca}</td>
        <td className={!props.darkmode ? "font-italic" : "font-italic text-light"}>{props.targa}</td>
        <td className={!props.darkmode ? "font-italic" : "font-italic text-light"}>{datainizio}</td>
        <td className={!props.darkmode ? "font-italic" : "font-italic text-light"}>{datafine}</td>
        <td className={!props.darkmode ? "" : " text-light"}>{props.importo}</td>

        <td>
            {props.page === "reservations" && cestino &&

                <> <Button variant="" onClick={() => {
                    if (urgente)
                        props.delete(1, props.ID);
                    else
                        props.delete(0, props.ID);
                }} >
                    <img className=" h-100 w-100 px-0 mt-0 pt-0 "
                        src={Cesto} alt="Logo" />
                </Button> </>}
        </td></>

}

export default RentTable;

