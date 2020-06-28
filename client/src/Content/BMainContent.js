import React, { useState, useRef } from 'react';
import { Navbar, Nav, NavDropdown, Row, Col, Container, Button, FormCheck, ThemeProvider } from 'react-bootstrap';
import { NavLink, Redirect } from 'react-router-dom';
import { Form, InputGroup, FormControl, Alert, dismissibile } from 'react-bootstrap'
import { BrandsContext, RentContext } from '../Contexts/Contexts'
import { Link } from 'react-router-dom'
import * as moment from 'moment';
import { SpinnerPage } from '../Components/BaseComponents'

import { CarsTable, PrintTable } from './CarsTableComponents.js'
import API from '../Api/API'
import LInguaTesto from '../Components/LInguaTesto';
import RentTable from './RentTableComponent';
// bar with title page
function TitlePage(props) {
  return <>
    <Container>

      <Navbar bg="warning" className=" border-bottom border-dark rounded-bottom text-dark" >
        <h4 class="font-italic text-right mb-0 pt-3">{props.title}</h4>
      </Navbar>

    </Container>
  </>
}

function Page_Store_Rent_Offer(props) {

  // console.log(props);
  let num = props.cars.length;

  return <>
    <Container>

      <Navbar className=" pl-0 ml-0 pr-5 mr-5"   >
        {!props.ErrServer && props.numcars != null && <>
          {props.page !== "offer" && <Nav className={num < 7 ? "col-5 pl-5 ml-5 pr-0 " : "col-3  pl-3 ml-3 pr-0 mr-0 "} >
            {props.page === "store" && <FormStore CloF={props.CloF} />}
            {props.page === "rent" && <FormRent user={props.user} CloF={props.CloF} numcars={props.numcars} price={props.price} />}
          </Nav>}</>}
        <Nav className={props.page === "rent" ? "pr-2 mr-2 ml-3 pl-3 pt-0 pb-5" : "mr-5 pr-5 ml-0"}>
          {!props.ErrServer && props.numcars != null && <ListCars className={num < 7 ? "" : "mr-0 ml-5"}
            cars={props.cars} page={props.page} allcars={props.allcars} darkmode={props.darkmode} price={props.price} num={num} numcars={props.numcars} UpdateCars={props.UpdateCars} DateByLoad={props.DateByLoad} CloF={props.CloF} />
          }
          {(props.ErrServer || props.numcars == null) && <AlertPage page={props.page} SetLoading={props.SetLoading} update={props.UpdateCars} />}
        </Nav>
      </Navbar>
    </Container>
  </>
}

function PageContacts_Report(props) {
  return <>
    <Container>
      {props.page && props.page === "contacts" && <Nav >
        <TextContacts />
      </Nav>}
      {props.page && props.page === "reports" && <Nav >
        <TextBlock page={props.page} />
      </Nav>}

      <FormComunication page={props.page} />
    </Container>
  </>
} //Page with rent table
class Page_Rentals extends React.Component {
  constructor(props) {
    super(props);
    this.state = { load: false, alert: false, alertGreen: false, typealert: null, rent: null };

  };

  componentDidMount() {
    if (!this.props.DateByLoad) {
      if (this.props.page === "history")
        this.props.UpdateRental(0);
      else
        this.props.UpdateRental(1);


    }

  }

  delete = (value, id) => {
    if (!this.state.alert)
      this.setState((props, state) => ({
        alert: true,
        typealert: value, idrent: id, alertGreen: false, alertRed: props.opfail
      }));
  }

  SetDeleteAlert = (value) => {// console.log(value);
    if (value) {
      this.setState((props, state) => ({ alert: false, load: true, alertGreen: true }));
      this.props.deleteRental(this.state.idrent);
      setTimeout(() => this.setState((props, state) => ({ load: false })), 2000);
    }
    else {
      this.setState((props, state) => ({ alert: false }));

    }
  }

  setOfGreen = () => { this.setState((props, state) => ({ alertGreen: false })); }

  close = () => {
    this.setState((props, state) => ({ alertGreen: false }));
    this.props.closeOpFail();
  }


  render() {

    if (!this.props.ErrServer && this.props.rent !== null) {
      if (!this.state.load)
        return <><RentContext.Provider value={this.props.rent}>
          <Container>
            {this.props.opfail && <AlertPage page={this.props.page} close={this.close} />}
            {this.props.page === "reservations" && this.state.alert && !this.state.alertGreen &&
              <Navbar className=" py-0 my-0"> <AlertRedStub type={this.props.page} value={this.state.typealert} id={this.state.idrent}
                delete={this.SetDeleteAlert} /></Navbar>}
            {this.props.page === "reservations" && !this.state.alert && this.state.alertGreen && !this.props.opfail && <AlertGreenStub
              page={this.props.page} setOfGreen={this.setOfGreen} />}
            {this.props.rent && this.props.rent.length > 0 && <RentTable page={this.props.page}
              darkmode={this.props.darkmode}
              delete={this.delete} />}
            {(this.props.rent === null || this.props.rent.length === 0) && <h5 className=" font-italic mb-5 pr-2 mr-2 pt-5 mt-5 row justify-content-center">
              <LInguaTesto testoIT="Nessun noleggio presente!" testoEN="No rental here!" />
            </h5>}

            {this.props.page === "reservations" &&
              <><div className=" pb-5 mb-5 pr-2 mr-2 row justify-content-end">
                <Link to="/newrental"><Button variant={this.props.darkmode ? "warning rounded-circle" : "dark rounded-circle"}>+</Button></Link></div>
              </>}

          </Container> </RentContext.Provider> {/*simbolo + */}
        </>
      else return <><SpinnerPage /></>
    }
    else return <><AlertPage page={this.props.page} updateRent={this.props.UpdateRental} /></>
  }
}


function PageAboutUs_Cov(props) {
  return <>
    <Container>
      <TextBlock page={props.page} />
    </Container>
  </>
}
// form with brands and categories
class FormStore extends React.Component {
  constructor(props) {
    super(props);
    this.state = { AllBrandShow: false, brands: null, Sw1: true, Sw2: true }
  }
  componentDidMount() {
    API.getBrands().then((brands) => this.setState((props, state) => ({
      brands: brands

    })));
    this.props.CloF.StartFormRentFormStore();
  }
  Showotherbrands = () => {
    this.setState((state, props) => ({ AllBrandShow: !this.state.AllBrandShow }));
  };
  onChangeFormCat = (ev, str) => {
    //  ev.preventDefault();
    if (ev.target.checked) {
      this.props.CloF.FilterCars(str, "cat", 1)
    } else {
      this.props.CloF.FilterCars(str, "cat", 0)
    }
  };

  onChangeFormBrand = (ev, str) => {
    //  ev.preventDefault();
    if (ev.target.checked) {
      this.props.CloF.FilterCars(str, "bra", 1)
    } else {
      this.props.CloF.FilterCars(str, "bra", 0)
    }
  };

  //Switch delle categorie e brands che disabilita le singole scelte
  SwitchZero = () => {
    if (!this.state.Sw1)
      this.props.CloF.FilterCars(0, "cat", 1)
    this.setState((state, props) => ({ Sw1: !this.state.Sw1 }));


  }

  SwitchOne = () => {
    if (!this.state.Sw2)
      this.props.CloF.FilterCars(0, "bra", 1)
    this.setState((state, props) => ({ Sw2: !this.state.Sw2 }));

  }

  render() {

    return <>
      <Form><h5 className="font-italic ml-2 mb-3 pb-3 "><LInguaTesto testoIT={"Scegli la tua prossima auto"} testoEN={"Choose your next car"} /></h5>
       <Form.Row> <div class="button" onClick={this.SwitchZero}> <Form.Check
          id="switchEnabled0"
          disabled
          type="switch"
          checked={this.state.Sw1}
          label=""/*{<CorsivoSwitch text={<LInguaTesto testoIT={"Tutte le categorie"} testoEN={"All Categories"} />} />}*/ />
        </div><CorsivoSwitch text={<LInguaTesto testoIT={"Tutte le categorie"} testoEN={"All Categories"} />} />

        </Form.Row>

        {this.state.Sw1 && <div key={`inline-checkbox`} className="mb-3">
          <Form.Check inline label="A" type='checkbox' id={`inline-checkbox-A`} disabled checked={false} onChange={(ev) => this.onChangeFormCat(ev, "A")} />
          <Form.Check inline label="B" type='checkbox' id={`inline-checkbox-B`} disabled checked={false} onChange={(ev) => this.onChangeFormCat(ev, "B")} />
          <Form.Check inline label="C" type='checkbox' id={`inline-checkbox-C`} disabled checked={false} onChange={(ev) => this.onChangeFormCat(ev, "C")} />
          <Form.Check inline label="D" type='checkbox' id={`inline-checkbox-D`} disabled checked={false} onChange={(ev) => this.onChangeFormCat(ev, "D")} />
          <Form.Check inline label="E" type='checkbox' id={`inline-checkbox-E`} disabled checked={false} onChange={(ev) => this.onChangeFormCat(ev, "E")} />
        </div>}
        {!this.state.Sw1 && <div key={`inline-checkbox`} className="mb-3">
          <Form.Check inline label="A" type='checkbox' id={`inline-checkbox-A`} onChange={(ev) => this.onChangeFormCat(ev, "A")} />
          <Form.Check inline label="B" type='checkbox' id={`inline-checkbox-B`} onChange={(ev) => this.onChangeFormCat(ev, "B")} />
          <Form.Check inline label="C" type='checkbox' id={`inline-checkbox-C`} onChange={(ev) => this.onChangeFormCat(ev, "C")} />
          <Form.Check inline label="D" type='checkbox' id={`inline-checkbox-D`} onChange={(ev) => this.onChangeFormCat(ev, "D")} />
          <Form.Check inline label="E" type='checkbox' id={`inline-checkbox-E`} onChange={(ev) => this.onChangeFormCat(ev, "E")} />
        </div>}
        <BrandsContext.Provider value={this.state.brands}>  <ShowBrands SwitchOne={this.SwitchOne} onChangeFormBrand={this.onChangeFormBrand}
          Showotherbrands={this.Showotherbrands} Sw2={this.state.Sw2} AllBrandShow={this.state.AllBrandShow} />   </BrandsContext.Provider>



      </Form>
    </>
  };
}

/* Show more or less brands*/
function ShowBrands(props) {
  let brands1, brands2;
  return <> <BrandsContext.Consumer>{(value) => (value && <>

<Form.Row>
    <div class="button" onClick={props.SwitchOne}> <Form.Check
      id="switchEnabled1"
      disabled
      type="switch"
      checked={props.Sw2}
      label=""/*{<CorsivoSwitch text={<LInguaTesto testoIT={"Tutte le marche"} testoEN={"All Brands"} />} />}*/ />
    </div><CorsivoSwitch text={<LInguaTesto testoIT={"Tutte le marche"} testoEN={"All Brands"} />} /></Form.Row>

    <div key={`inline-checkboxB`} className="mb-3">
      {!props.Sw2 && value.slice(0, 4).map((b) => <Form.Check inline label={<CorsivoCheckBox text={b} />} type='checkbox' id={b}
        onChange={(ev) => props.onChangeFormBrand(ev, b)} />)}
      {!props.Sw2 && props.AllBrandShow && value.length > 6 &&
        value.slice(4, value.length).map((b) => <Form.Check inline label={<CorsivoCheckBox text={b} />} type='checkbox' id={`inline-checkbox-` + b}
          onChange={(ev) => props.onChangeFormBrand(ev, b)} />)}
      {props.Sw2 && value.slice(0, 4).map((b) => <Form.Check inline label={<CorsivoCheckBox text={b} />} type='checkbox' id={b} disabled
        onChange={(ev) => props.onChangeFormBrand(ev, b)} />)}
      {props.Sw2 && props.AllBrandShow && value.length > 6 &&
        value.slice(4, value.length).map((b) => <Form.Check inline label={<CorsivoCheckBox text={b} />} type='checkbox' id={`inline-checkbox-` + b} disabled
          onChange={(ev) => props.onChangeFormBrand(ev, b)} />)}
    </div>

    <div className="btn btn-warning" type="button" onClick={props.Showotherbrands}>
      {props.AllBrandShow ? <LInguaTesto testoIT={"Mostra meno marche"} testoEN={" Show less brands "} /> : <LInguaTesto testoIT={"Mostra tutte le marche"} testoEN={"Show all brands"} />}</div>
    {/*First five brands*/}
  </>)}</BrandsContext.Consumer></>
}


function CorsivoCheckBox(props) { return <p class="font-italic mt-2 ">{props.text}</p> }

function CorsivoSwitch(props) { return <p class="font-italic">{props.text}</p> }
// form with categories and dates 
class FormRent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      datainizio: moment().format('YYYY-MM-DD'), datafine: moment().add(1, 'days').format('YYYY-MM-DD'), Alert: 0, Scarto: null, value: null, alertField: false,
      send: [true, true]
    }
  }
  componentDidMount() {
    this.props.CloF.StartFormRentFormStore();
    this.props.CloF.CarsAvalaiblePrice(this.state.datainizio, 1);
    this.props.CloF.CarsAvalaiblePrice(this.state.datafine, 2);

  }

  // Gestisco in maniera particolare le date ricavate dal form
  // cercando di mantenere in memoria le date immesse anche in caso di intervalli sbagliati

  onChangeForm = (ev, str) => {
    //  ev.preventDefault();
    this.setState((props, state) => ({ alertField: false }));
    // console.log(ev.target.value);
    let val = ev.target.value;
    // console.log(val);
    switch (str) {
      case 1:
        if (!this.state.send[0]) { this.setState((props, state) => ({ send: [true, true] })); }
        this.CloseAlert();
        if (val === "") {
          this.props.CloF.CarsAvalaiblePrice(val, str);
          this.setState((props, state) => ({ datainizio: null }));
        }
        else {
          if (this.state.datafine === null) {
            this.props.CloF.CarsAvalaiblePrice(val, str);
            if (!this.state.send[1]) {
              if (moment(this.state.Scarto).isAfter(val))   //if(this.state.Scarto.slice(8,10)>val.slice(8,10))
              {
                this.props.CloF.CarsAvalaiblePrice(this.state.Scarto, 2);
                this.setState((props, state) => ({ send: [true, true], datafine: this.state.Scarto }));
              }
              else this.setState((props, state) => ({ Alert: 1 }));
            }
            this.setState((props, state) => ({ datainizio: val }));
            console.log("1")
          }
          else {
            if (moment(this.state.datafine).isAfter(val))      //if(this.state.datafine.slice(8,10)>val.slice(8,10))
            {
              this.props.CloF.CarsAvalaiblePrice(val, str);
              this.setState((props, state) => ({ datainizio: val }));
              console.log("2")
            }
            else {
              this.setState((props, state) => ({ Alert: 1 }));
              this.setState((props, state) => ({ datainizio: null }));
              this.setState((props, state) => ({ value: this.state.datafine }));
              this.setState((props, state) => ({ Scarto: val }))
              this.props.CloF.CarsAvalaiblePrice("", 1);
              this.setState((props, state) => ({ send: [false, true] }));
              console.log("3");

            }
          }

        }
        break;
      case 2:

        if (!this.state.send[1]) { this.setState((props, state) => ({ send: [true, true] })); }
        this.CloseAlert();
        if (val === "") {
          this.props.CloF.CarsAvalaiblePrice(val, str);
          this.setState((props, state) => ({ datafine: null }));
        }
        else {
          if (this.state.datainizio === null) {
            this.props.CloF.CarsAvalaiblePrice(val, str);
            if (!this.state.send[0]) {
              if (moment(val).isAfter(this.state.Scarto))//if(this.state.Scarto.slice(8,10)<val.slice(8,10))
              {
                this.props.CloF.CarsAvalaiblePrice(this.state.Scarto, 1);
                this.setState((props, state) => ({ send: [true, true], datainizio: this.state.Scarto }));
              }
              else this.setState((props, state) => ({ Alert: 1 }));
            }

            this.setState((props, state) => ({ datafine: val }));

            console.log("1")
          }
          else {
            if (moment(val).isAfter(this.state.datainizio))// if(val.slice(8,10)>this.state.datainizio.slice(8,10))
            {
              this.props.CloF.CarsAvalaiblePrice(val, str);
              this.setState((props, state) => ({ datafine: val }));
              console.log("2")
            }
            else {
              this.setState((props, state) => ({ Alert: 2 }));
              this.setState((props, state) => ({ datafine: null }));
              this.setState((props, state) => ({ value: this.state.datainizio }));
              this.setState((props, state) => ({ Scarto: val }))
              this.setState((props, state) => ({ send: [true, false] }));
              this.props.CloF.CarsAvalaiblePrice("", 2);
              console.log("2")
            }
          }
        }
        break;

      default:
        this.props.CloF.CarsAvalaiblePrice(ev.target.value, str);
        break;
    }
  };

  CloseAlert = () => {
    this.setState((props, state) => ({ Alert: 0 }));
  }

  SetAlertField = () => {
    this.setState((props, state) => ({ alertField: true }));

  }


  render() {
    return <>
      <Form>
        <Form.Row className="pl-1">
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label> {<CorsivoCheckBox text={<LInguaTesto testoIT={"Scegli una categoria"} testoEN={"Choose a category"} />} />}</Form.Label>
            <Form.Control as="select" onChange={(ev) => this.onChangeForm(ev, 0)}>
              <option></option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>E</option>
            </Form.Control></Form.Group>
          {this.state.Alert > 0 && <AlertPage page={"rentForm"} close={this.CloseAlert}
            alert={this.state.Alert} data={this.state.value} />}
        </Form.Row>
        <Row >
          <Form.Group className="px-3 " controlId="deadline-date" onChange={(ev) => this.onChangeForm(ev, 1)}>
            <Form.Label> <CorsivoCheckBox text={<LInguaTesto testoIT={"Data inizio Noleggio"} testoEN={"Rental start date"} />} /></Form.Label>
            <Form.Control type="date" min={moment().format('YYYY-MM-DD')} defaultValue={this.state.datainizio} name="deadlineDate0" />
          </Form.Group>
          <Form.Group className="ml-3" controlId="deadline-date2" onChange={(ev) => this.onChangeForm(ev, 2)}>
            <Form.Label><CorsivoCheckBox text={<LInguaTesto testoIT={"Data Fine Noleggio"} testoEN={"Rental end date"} />} /></Form.Label>
            <Form.Control type="date" min={moment().add(1, 'days').format('YYYY-MM-DD')} defaultValue={this.state.datafine} name="deadlineDate1" />
          </Form.Group></Row> <Form.Text className="text-muted" id="textlittle"><u>
            <LInguaTesto testoIT={"Imposta categoria e date per il primo preventivo"} testoEN={"Set category and dates for the first price."} />
          </u> </Form.Text>

        < div class="pt-3" >
          <label><CorsivoCheckBox text={<LInguaTesto testoIT={"Indica la tua età ( anni ) :"} testoEN={"Your age: (years old) "} />} /></label><br />
          <select title="age-select" onChange={(ev) => this.onChangeForm(ev, 3)}>
            <option >&lt;25 </option>
            <option selected>25-65 </option>
            <option>&gt;65 </option>
          </select>
        </div>
        <div className="pt-3">
          <label>
            <CorsivoCheckBox text={<LInguaTesto testoIT={"Quanti chilometri farai al giorno :"} testoEN={" How far you will go with us (km/day) "} />} />
          </label>
          <select title="age-select" onChange={(ev) => this.onChangeForm(ev, 4)}>
            <option>&lt;50 km</option>
            <option selected> 50-150 </option>
            <option  >&gt;
            150 km
            </option>
          </select>
        </div>
        <br />
        <Form.Check inline label={<CorsivoCheckBox text={<LInguaTesto testoIT={"Assicurazione extra"} testoEN={"Extra insurance"} />} />}
          type='checkbox' id={`inline-checkbox-A`} onChange={(ev) => this.onChangeForm(ev, 5)} />
        <Form.Check inline label={<CorsivoCheckBox text={<LInguaTesto testoIT={"Guidatori addizionali"} testoEN={"Additional drivers"} />} />}
          type='checkbox' id={`inline-checkbox-B`} onChange={(ev) => this.onChangeForm(ev, 6)} />
        {this.props.user && <Form.Check className="px-3" checked label={<CorsivoCheckBox text={<LInguaTesto testoIT={"Utente premium"} testoEN={"Premium user"} />} />}
          type='checkbox' id={`inline-checkbox-D`} />}
        <br />

        {this.state.alertField && <AlertRedStub type={"rent"} />}


        {this.props.price !== null && this.props.numcars > 0 && <Link to="/newrental/stub" ><Button variant="warning" className="my-4">
          <CorsivoCheckBox text={<LInguaTesto testoIT={"Vai al pagamento"} testoEN={"Pay here"} />} />
        </Button></Link>}
      </Form>
    </>
  }
}
/* Form Contacts / Reports */
function FormComunication(props) {

  const [email, setEmail] = useState('12@it');
  const [ID, setID] = useState('');
  const [alert, setAlert] = useState(false);

  const setemailField = (value) => {
    setEmail(value);
  }

  const setIDField = (value) => {
    setID(value);
  }

  const doRequest = (event) => {
    //event.preventDefault();


    if (email.split('@').length >= 2 &&
      ((Number.isInteger(parseInt(ID)) && parseInt(ID) > 0 && props.page === "reports") ||
        (props.page === "contacts" && ID.length > 0))) {
      setAlert(true);
    }

  }


  const validateForm = (event) => {
    event.preventDefault();
  }

  let testoEn, testoit;
  if (props.page === "contacts") {
    testoEn = "Object";
    testoit = "Oggetto";
  }
  if (props.page === "reports") {
    testoEn = "ID Rental";
    testoit = "ID Prenotazione";
  }
  return <>
    <Container> {alert && <AlertPage page={props.page} />}
      {!alert && <Form>
        <Form.Row>
          <Form.Group controlId="formGridEmail" className="d-none d-md-block w-50 ml-3 pl-1" >
            <Form.Label className="pb-3" >Email
          </Form.Label>
            <Form.Control type="email" required placeholder={"Enter valid mail"} onChange={(ev) => setemailField(ev.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridEmail" className="d-md-none">
            <Form.Label className="pb-3">Email</Form.Label>
            <Form.Control type="email" required onChange={(ev) => setemailField(ev.target.value)} placeholder={"Enter valid mail"} />
          </Form.Group> </Form.Row>

        <Form.Group as={Col} className="d-none d-md-block w-50">
          <Form.Label>
            <CorsivoCheckBox text={<LInguaTesto testoIT={testoit} testoEN={testoEn} />} />
          </Form.Label>
          <Form.Control
            onChange={(ev) => setIDField(ev.target.value)} required type={props.page === "contacts" ? "text" : "number"} />
        </Form.Group>
        <Form.Group as={Col} className="d-md-none pl-0 ml-0">
          <Form.Label> <CorsivoCheckBox text={<LInguaTesto testoIT={testoit} testoEN={testoEn} />} /></Form.Label>
          <Form.Control onChange={(ev) => setIDField(ev.target.value)} required type={props.page === "contacts" ? "text" : "number"} />
        </Form.Group>
        {props.page === "reports" && <Form.Check inline className="ml-3 pt-1 py-2" label={<CorsivoCheckBox text={<LInguaTesto testoIT={"Incidente d'auto"} testoEN={"Car crash"} />} />}
          type='checkbox' id={`inline-checkbox-1`} />}
        <Form.Group className="d-none d-md-block" controlId="exampleForm.ControlTextarea1">
          <Form.Control as="textarea" rows="10" className="w-75" placeholder="Write here/Scrivi qui" />
        </Form.Group>
        <Form.Group className="d-md-none" controlId="exampleForm.ControlTextarea1">
          <Form.Control as="textarea" rows="10" placeholder="Write here/Scrivi qui" />
        </Form.Group>
        <button className=" btn btn-warning mb-3" type="button" onSubmit={validateForm} onClick={doRequest}>
          <LInguaTesto testoIT={"Invia"}
            testoEN={"Send"} />
        </button>
      </Form>}</Container>
  </>
}
/* wrapper of printTable ( cars table)*/
function ListCars(props) {
  if (props.page === "rent" || props.page === "offer") {
    { props.DateByLoad && props.page === "rent" && props.UpdateCars(1); }
    { props.DateByLoad && props.page === "offer" && props.UpdateCars(2); }
  }
  //console.log(props);
  return <>
    <PrintTable cars={props.cars} darkmode={props.darkmode} allcars={props.allcars} page={props.page} price={props.price} num={props.num} numcars={props.numcars} CloF={props.CloF} />


  </>
}



/* text in some pages*/

function TextBlock(props) {
  return <>
    <Container className="py-5">
      {props.page === "cov" && <p class="font-italic " id="text"><LInguaTesto testoIT={"Gertz Corporation include i brand Gertz, Grifty, Gollar e Girefly."}
        testoEN={"Gertz Corporation includes the Gertz, Grifty, Gollar and Girefly brands."} /><br /><br /> <LInguaTesto testoEN={"In this constantly evolving situation, we want to remind you that our main goal remains to offer you the best rental experience, guaranteeing you all the support you need to get to your destination as safely as possible. The safety of our customers and employees always remains our priority."} testoIT={"In questa situazione in continua evoluzione, desideriamo ricordarti che il nostro principale obiettivo rimane quello di offrirti la migliore esperienza di noleggio, garantendoti tutto il supporto necessario per arrivare a destinazione nel modo più sicuro possibile."} />
        <br /><br /> <LInguaTesto testoEN={"For this reason, we are continuing to monitor the spread of Coronavirus (COVID-19) and to follow the current guidelines of the Government and Health Authorities, in order to guarantee compliance with the indications provided and safeguard the health of our customers, employees and communities in which we operate."} testoIT={"Per questo motivo, stiamo continuando a monitorare la diffusione del Coronavirus (COVID-19) e a seguire le attuali linee guida del Governo e delle Autorità sanitarie, al fine di garantire il rispetto delle indicazioni fornite e salvaguardare la salute dei nostri clienti, dipendenti e delle comunità in cui operiamo."} />
        <br /><br />
        <LInguaTesto testoEN={"Our mission is to keep our safety and cleanliness standards high. In addition to the preventive measures adopted to reduce the spread of germs in all our facilities, we work to ensure that our vehicles undergo a rigorous and meticulous cleaning process before and after each rental. We are committed to staying vigilant to ensure compliance with these practices and will take additional precautions as recommended by the Centers for Disease Control and Prevention (CDC), the World Health Organization (WHO) and local governments to reduce the risks for our customers and employees."} testoIT={" La nostra missione è mantenere elevati i nostri standard di sicurezza e pulizia.La sicurezza dei nostri clienti e dipendenti rimane sempre la nostra priorità.Oltre alle misure preventive adottate per ridurre la diffusione di germi in tutte le nostre strutture, lavoriamo affinché i nostri veicoli vengano sottoposti ad un rigoroso e meticoloso processo di pulizia prima e dopo ogni noleggio. Ci impegniamo a rimanere vigili per assicurare il rispetto di queste pratiche e adotteremo ulteriori precauzioni come raccomandato dai Centri per il Controllo e la Prevenzione delle Malattie (CDC), dell'Organizzazione Mondiale della Sanità (OMS) e dai governi locali per ridurre i rischi per i nostri clienti e dipendenti."} />
        <br /><br /></p>}

      {props.page === "aboutus" && <p class="font-italic " id="text">
        <LInguaTesto testoIT={"Benvenuti nel mondo del noleggio di  Gertz."}
          testoEN={"Welcome to Gertz Car Hire. "} /><br /><br />
        <LInguaTesto testoEN={" In 1918, our founder, Walter White had a bold idea. He invented the car rental category. And we’ve been reinventing it ever since. Making life easier for our customers with innovative products, extraordinary levels of service and our award winning loyalty programme, Gold Plus Rewards. Today, with over 10,000 locations across 145 countries and 6 continents, we are the world’s most global car rental company. A trusted provider of vehicles for hire. By the day, the week or the month. You’re with  Gertz. And we’ve got you covered. We’re here to get you there. Book direct and enjoy Fastrack and free ‘go anywhere’ Wi-Fi, T&C’s apply."}
          testoIT={"Nel 1918, il nostro fondatore Walter White ebbe un’idea geniale e coraggiosa: inventò il settore dell’autonoleggio. Da allora, abbiamo continuato a reinventarlo con l’obiettivo di semplificare la vita ai nostri clienti attraverso prodotti innovativi, un livello di servizio ineccepibile ed il nostro pluripremiato programma fedeltà Gold Plus Rewards. Oggi, con oltre 10.000 agenzie in 145 paesi e 6 continenti, rappresentiamo la società di autonoleggio più globalizzata al mondo. In qualità di fornitore affidabile mettiamo a disposizione il noleggio di veicoli a tariffazione giornaliera, settimanale o mensile. Con  Gertz sei in buone mani perché pensiamo noi a tutto. Siamo qui per portarti a destinazione. Prenota e approfitta del Fastrack e del Wi-Fi gratuito. Vedi i termini e le condizioni."} /></p>}



      {props.page === "reports" && <p class="font-italic" id="text"> <LInguaTesto testoIT={"Se hai deciso di acquistare la Riduzione Penalità Risarcitoria Danni (CDW), ridurremo tale responsabilità all’importo della penalità risarcitoria non rimborsabile indicata sul contratto di noleggio. Questa penalità può essere abbattuta grazie all’acquisto della copertura opzionale SuperCover (Eliminazione Penalità Risarcitoria), al momento dell’inizio del noleggio. Se hai deciso di non acquistare la copertura opzionale SuperCover, sarai responsabile in caso di danno per l’importo della penalità risarcitoria. L’importo sarà addebitato sul tuo contratto di noleggio, indipendentemente dalla colpa e da altre coperture “non Gertz” delle quali sei titolare. L’intestatario del contratto di noleggio sarà ritenuto finanziariamente responsabile per tutti i danni al veicolo noleggiato."}
        testoEN={"If you have decided to purchase the Damage Compensation Penalty Reduction (CDW), we will reduce this liability to the amount of the non-refundable compensation penalty indicated on the rental contract. This penalty can be reduced thanks to the purchase of the optional SuperCover coverage (Elimination of Compensation Penalty), at the time of the start of the rental. If you have decided not to purchase the optional SuperCover coverage, you will be liable in the event of damage for the amount of the compensation penalty. The amount will be charged to your rental agreement, regardless of the fault and other non-Gertz coverages you own. The owner of the rental agreement will be held financially responsible for all damages to the rented vehicle."} /><br /><br />

        <LInguaTesto
          testoEN={" In the object below, refer to the rental contract that we provided to you at the time of collection, to determine your liability limit in case of damage."}
          testoIT={"Nell'oggetto in basso fai riferimento al contratto di noleggio che ti abbiamo fornito al momento del ritiro, per determinare il tuo limite di responsabilità in caso di danno."} />

        <LInguaTesto testoEN={"You and any additional drivers must collaborate with Gertz to find information on the dynamics of the accident and in assessing the damage. The collaboration by the customer includes the completion of the claim.The claim must be completed for each accident and delivered to Gertz when the vehicle is returned. In the description of the damage, you must indicate if there are people who have suffered injuries in the accident or if they have died. For any request during the rental, you can contact the rental agency. The contacts are listed on the contract."}
          testoIT={"Tu ed eventuali guidatori aggiuntivi, dovrete collaborare con Gertz a reperire informazioni sulla dinamica dell’incidente e nella valutazione dei danni. La collaborazione da parte del cliente, comprende il completamento della constatazione di sinistro .La constatazione di sinistro deve essere compilata per ogni incidente e consegnata a Gertz al momento della restituzione del veicolo. Dovrai indicare, nella descrizione del danno, se vi sono persone che hanno riportato delle lesioni nell’incidente o se sono decedute. Per qualsiasi richiesta durante il noleggio, potrai contattare l’agenzia di noleggio. I contatti sono riportati sul contratto."} />
      </p>}
    </Container>
  </>
}  /*page contacts text*/
function TextContacts(props) {
  return <>
    <Container className="py-5">
      <p class="font-italic " id="text"><LInguaTesto testoIT={"Come posso contattare Gertz?"}
        testoEN={"How can I contact Gertz?"} /><br /><br />
        <LInguaTesto testoEN={"Car and van rental: Tel: (0039) 02 69685545 Opening hours: Mon-Sun 09:00-18:00. Monthly Rentals: Tel: 199 00 88 11 Opening hours: Mon-Sun 09:00-18:00 . Social Network contacts : "}
          testoIT={"Noleggi Auto e Furgoni: Tel: (0039) 02 69685545 Orari d'apertura: Lun-Dom 09:00-18:00. Noleggi Mensili: Tel: 199 00 88 11 Orari d'apertura: Lun-Dom 09:00-18:00.  Contattaci attraverso i social :"} />
        <a href='http://instagram.com'>  <img className="px-2" height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v2/icons/instagram.svg" /></a>
        <a href='http://youtube.com '>          <img className="px-2" height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v2/icons/youtube.svg" /></a>
        <a href='http://facebook.com '>                   <img className="px-2" height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v2/icons/facebook.svg" /></a>
        <a href='http://twitter.com '>              <img className="px-2" height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v2/icons/twitter.svg" /></a>
        <br /><br /> <LInguaTesto testoEN={"Customer Service (FOR PAST RENTALS ONLY: REFUNDS, CHARGES, CLARIFICATIONS, FINES): Live Chat - Opening Hours: Mon-Fri 09:00-17:30, Sat-Sun Closed."}
          testoIT={"Servizio Clienti (SOLO PER NOLEGGI PASSATI: RIMBORSI, ADDEBITI, CHIARIMENTI, MULTE): Chat dal vivo - Orari d'apertura: Lun-Ven 09:00-17:30, Sab-Dom Chiuso."} />
        <br /><br />
        <LInguaTesto testoEN={"Emergency Roadside Assistance (ONLY for current rentals and vehicles on Italian territory) Italian Tel: 800250700  English or from a foreign mobile phone: +39 02 66430025 Opening hours: Mon-Sun, 24 hours a day . Invoice copy request: www.Gertz.it/invoice"}
          testoIT={"Assistenza Stradale d'Emergenza (SOLO per noleggi in corso e veicoli sul territorio italiano) Tel: 800250700 Italiano  Tel: +39 02 6630025 Inglese o da cellulare straniero Orari di apertura: Lun-Dom, 24 ore su 24. Richiesta copia fatture: www.Gertz.it/invoice"} />
        <br /><br /></p>
      <LInguaTesto testoIT={"Oppure scrivici qui in basso , Ti contatteremo!"}
        testoEN={"Contacts us throught this form , we will contact you!"} /><br /><br />
    </Container>

  </>
}
function AlertPage(props) {




  return <> <Alert variant="warning"   >
    <Alert.Heading>{props.page === "rent" || props.page === "rentForm"
      || props.page === "store" || props.page === "offer" || props.page === "reservations" || props.page === "login"
      ? "Oops!" :
      <LInguaTesto testoIT={"Ben fatto!!"}
        testoEN={"Well done!!"} />

    }

      {(props.page === "footer" || props.page === "rentForm" || props.page === "reservations") &&
        <button type="button" class="close pb-5 mb-5" data-dismiss="alert"
          onClick={props.close} aria-label="Close">&times;</button>}

      {props.page === "login" &&
        <Link to="/store" ><button type="button" class="close pb-5 mb-5"
          aria-label="Close">&times;</button></Link>}



      {(props.page === "contacts" || props.page === "reports") &&
        <button type="button" class="close pb-5 mb-5" data-dismiss="alert"
          aria-label="Close">&times;</button>}




    </Alert.Heading>
    {props.page === "reports" &&
      <p>
        <LInguaTesto testoIT={"Prendiamo nota della tua segnalazione, ti contatteremo al piu presto. Non preoccuparti!"}
          testoEN={"We take note of yout report , we will contact you as soon as possibile! Don't worry."} />
      </p>}

    {(props.page === "store" || props.page === "rent" || props.page === "offer" || props.page === "login") && <p>

      <LInguaTesto testoIT={"E' stato riscontrato un problema nel caricamento dei dati. Premi il Logo Gertz in alto a sinistra per aggiornare la pagina. Grazie per la pazienza!"}
        testoEN={" There was a problem about loading the data from server. Press the Gertz Icon in the upper left corner to refresh page.  Thanks for your patience."} />
    </p>}

    {props.page === "contacts" && <p>


      <LInguaTesto testoIT={"Prendiamo nota della tua richiesta, ti contatteremo al piu presto. Grazie per la pazienza!"}
        testoEN={" We take note of yout request , we will contact you as soon as possibile!  Thanks for your patience."} />
    </p>}

    {props.page === "reservations" && <p>


      <LInguaTesto testoIT={"E' stato riscontrato un errore nella cancellazione di tale noleggio, potrebbe essere un errore di Database. Grazie per la pazienza!"}
        testoEN={" There was a problem about deleting rental, It may be a server problem. Thanks for your patience."} />
    </p>}

    {props.page === "footer" && <p>
      <LInguaTesto testoIT={"Da adesso in poi rimarrai sempre aggiornato sulle nuove offerte."}
        testoEN={" You will always be update on Gertz offers through your email. "} />
    </p>
    }
    {props.alert === 2 && props.page === "rentForm" && <p>
      <LInguaTesto testoIT={"Non puoi impostare una data di fine noleggio prima del :"}
        testoEN={" You can't put an rental end date before:"} />
      {GetDateClientFormat(props.data)}
    </p>}
    {props.alert === 1 && props.page === "rentForm" && <p>
      <LInguaTesto testoIT={"Non puoi impostare una data di inizio dopo il  :"}
        testoEN={" You can't put an rental start date after:"} />
      {GetDateClientFormat(props.data)}
    </p>}



  </Alert></>

}
function GetDateClientFormat(DATA) {
  let Data;
  Data = DATA.slice(8, 10) + "-" + DATA.slice(5, 7) + "-" + DATA.slice(0, 4);
  return Data;

}

function StubPage(props) {

  const [carta, setCarta] = useState(''); //useState('1234567891011121')
  const [data, setData] = useState(''); //useState('2020-07-01')
  const [ccv, setccv] = useState(''); //useState('123')
  const [name, setName] = useState(''); //useState('Sergio')
  const [lastName, setLastName] = useState(''); //useState('Giardina')
  const [alert, setAlert] = useState(0);


  const handleErrors = (err) => {
    console.log("Error in server:" + err);
  }

  const setCartaField = (value) => {
    setCarta(value);
    setAlert(0);
  }




  const setNameField = (value) => {
    setName(value);
    setAlert(0);

  }
  const setLastNameField = (value) => {
    setLastName(value);
    setAlert(0);
  }

  const setCCVField = (value) => {
    setccv(value);
    setAlert(0);
  }
  const setDataField = (value) => {
    setData(value);
    setAlert(0);


  }


  const doPay = () => {
    //event.preventDefault();
    let dati = { carta: carta, ccv: ccv, name: name, lastname: lastName, data: data };
    let datalocal = moment().format('YYYY-MM-DD');
    if (data.length == 10 && !moment(datalocal).isAfter(data) && carta.length === 16 && Number.isInteger(parseInt(carta)) && Number.isInteger(parseInt(ccv)) && name.length > 0 && lastName.length > 0 && ccv.length === 3) {
      props.SetLoading(true);
      props.PayRental(dati, props.price);
    }
    else
      setAlert(1);
  }


  return <>
    <Container className="  pb-5 mb-5 mb-5 ml-5 pl-5">


      {props.price > 0 && <><h4 class="right-text py-4 pl-5 ml-5"> <CorsivoCheckBox text={<LInguaTesto testoIT={"Fase di pagamento"} testoEN={"Payment step"} />} /></h4><Form >

        <Form.Row>
          <Form.Check className="px-3" checked label={<CorsivoCheckBox text={<LInguaTesto testoIT={"Carta di credito"} testoEN={"Credit Card"} />} />}
            type='checkbox' id={`inline-checkbox-A`} />
          <Form.Check disabled className="px-3" label={<CorsivoCheckBox text={<LInguaTesto testoIT={"Carta di credito"} testoEN={"Debit card"} />} />}
            type='checkbox' id={`inline-checkbox-A`} />
          <Form.Check disabled className="px-3" label={<CorsivoCheckBox text={<LInguaTesto testoIT={"PayPal"} testoEN={"PayPal"} />} />}
            type='checkbox' id={`inline-checkbox-A`} />   </Form.Row>
        <Form.Row className="w-50" >
          <Form.Group as={Col} >
            <Form.Label><LInguaTesto testoIT={"Numero della carta di pagamento"} testoEN={"Card Number"} /></Form.Label>
            <Form.Control type="number" minLength={16} required placeholder="Enter a valid number card" onChange={(ev) => setCartaField(ev.target.value)} />
          </Form.Group>
          <Form.Group className="pl-5 ml-5 " controlId="deadline-date">
            <Form.Label> <CorsivoCheckBox text={<LInguaTesto testoIT={"Data di scadenza"} testoEN={"Deadline validity"} />} /></Form.Label>
            <Form.Control type="date" min={moment().format('YYYY-MM-DD')} name="deadlineDate0" onChange={(ev) => setDataField(ev.target.value)} />
          </Form.Group>
        </Form.Row>
        <Form.Group className="w-25" >
          <Form.Label>
            <LInguaTesto testoIT={"ccv"} testoEN={"CCV"} />
          </Form.Label>
          <Form.Control type="number" minlength={3} required placeholder="Enter CCV" onChange={(ev) => setCCVField(ev.target.value)} />
        </Form.Group>
        <Form.Row className="pl-2">
          <Form.Group >
            <Form.Label>
              <LInguaTesto testoIT={"Nome"}
                testoEN={"First Name"} />
            </Form.Label>
            <Form.Control type="text" required placeholder="First Name" onChange={(ev) => setNameField(ev.target.value)} />
          </Form.Group>




          <Form.Group className="pl-3">
            <Form.Label> <LInguaTesto testoIT={"Cognome"}
              testoEN={"Last Name"} /></Form.Label>
            <Form.Control type="text" required placeholder="Last name" onChange={(ev) => setLastNameField(ev.target.value)} />
          </Form.Group>
          {alert === 1 && <AlertRedStub type={"field"} />}
        </Form.Row>
        <Button variant="warning " className=" mb-5 " type="button" onClick={doPay}  >
          <LInguaTesto testoIT={"Paga adesso"} testoEN={"Pay now"} /></Button>

      </Form></>}

      {props.price === 0 &&
        <><Container className="pr-5 py-5 mr-5 my-5">
          <AlertGreenStub page={"payment"} />
          <Link to="/personal/reservations"><Button variant="warning" rounded ><LInguaTesto testoIT={"Vedi \"Le tue prenotazioni \""} testoEN={"Go to \"Check a reservation\""} /> </Button>
          </Link> </Container></>}
      {props.price === -1 &&
        <><Container className="pr-5 py-5 mr-5 my-5">
          <AlertRedStub type={"payment"} />
          <Link to="/store"><Button variant="warning" rounded ><LInguaTesto testoIT={"Torna allo store"} testoEN={"Go to store"} /> </Button>
          </Link> </Container></>}

    </Container></>

}   /* Alert */
function AlertGreenStub(props) {

  if (props.page === "reservations") {
    return <Alert variant="success" className="pr-5 mr-5"   >

      <Alert.Heading><button type="button" class="close pr-5 mr-5 pb-5 mb-5 " data-dismiss="alert"
        aria-label="Close" onClick={props.setOfGreen}>&times;</button></Alert.Heading>
      <p> <LInguaTesto testoIT={"OPERAZIONE AVVENUTA CON SUCCESSO"}
        testoEN={"OPERATION WAS SUCCESSFULL"} /> </p>
    </Alert>

  }
  else return <> <Alert variant="success" className="pr-5 mr-5"   >
    <Alert.Heading>

      <Link to="/Store" >
        <button type="button" class="close pr-5 mr-5 pb-5 mb-5 " data-dismiss="alert"
          aria-label="Close">&times;</button></Link>
    </Alert.Heading>
    <p> <LInguaTesto testoIT={"TRANSAZIONE AVVENUTA CON SUCCESSO"}
      testoEN={"TRANSACTION WAS SUCCESSFULL"} /> </p>
    <p> <LInguaTesto testoIT={"Troverai tutti i dettagli del noleggio e dell'auto a te assegnata nella sezione : \"Le tue prenotazioni\"."}
      testoEN={"You will find all the details about your rental and the car assigned to you in the section \"Check a reservation\"."} /> </p>
    <p> <LInguaTesto testoIT={"Grazie e al prossimo noleggio!"}
      testoEN={"Thanks and see you soon!"} /> </p>
  </Alert>
  </>

}  // Alert used in a lot of situations
function AlertRedStub(props) {
  if (props.type === "reservations")
    return <>
      <Alert variant="warning  py-0 my-0"  >
        <Alert.Heading className="pt-2 mt-2 py-0 my-0">

          {props.value == 0 && <><p className="text-left"> <LInguaTesto testoIT={"Attenzione,Stai per cancellare il noleggio."}
            testoEN={"You are going to cancel a rental."} /> </p>{"ID:" + props.id}
            <p className="text-left"> <LInguaTesto testoIT={"Vuoi procedere comunque ?"}
              testoEN={"Are you sure?"} /> </p>

          </>}
          {props.value == 1 && <><p className="text-left"><LInguaTesto testoIT={"Attenzione,Stai per cancellare un noleggio."}
            testoEN={"Attention,You are going to cancel a rental."} /> </p>{"ID:" + props.id}
            <p className="text-left"><LInguaTesto testoIT={" (Inizierà tra meno di 3 giorni : Ti verrà addebitata una penale)"}
              testoEN={"(less than 3 days until start: you will be changed a penalty)"} /> </p>
            <p className="text-left"><LInguaTesto testoIT={"Vuoi procedere comunque ?"}
              testoEN={"Are you sure?"} /> </p></>}
          <Form.Row >

            <button type="button" class=" close pl-3 ml-3 pb-5 mb-5 mt-4 pt-4 " data-dismiss="alert" onClick={() => props.delete(true)}
              aria-label="Close"><u> <p className="text-right"><LInguaTesto testoIT={"SI"} testoEN={"YES"} />
              </p></u></button>
            <button type="button" class=" close pl-5 ml-5 pb-5 mb-5 mt-4 pt-4 pr-0 mr-0" data-dismiss="alert"
              aria-label="Close" onClick={() => props.delete(false)}> <u><p className="text-right"><LInguaTesto testoIT={"NO"} testoEN={"NO"} />
              </p></u></button></Form.Row></Alert.Heading>

      </Alert></>
  else
    if (props.type !== "reservations")
      return <> <Alert variant="danger" className="pr-5 mr-5"  >
        {props.type === "payment" && <Link to="/Store" >
          <button type="button" class="close pr-5 mr-5 pb-5 mb-5 " data-dismiss="alert"
            aria-label="Close">&times;</button></Link>}
        {props.type === "payment" && <p>
          <LInguaTesto testoIT={"Oops qualcosa è andato storto"}
            testoEN={"There were some problems with payment ,Attention!"} />
        </p>}
        {props.type === "field" && <p>
          <LInguaTesto testoIT={"Campi non completati/sbagliati!"}
            testoEN={"All Fields must be completed in the right way!"} /></p>}

        {props.type === "rent" && <p>
          <LInguaTesto testoIT={"I campi Categoria,Data-Inizio,Data-Fine sono obbligatori per proseguire!"}
            testoEN={"Category,Begin-date,End-date must be completed!"} />

        </p>}

      </Alert>
      </>

}
export { TitlePage, StubPage, Page_Rentals, GetDateClientFormat, AlertPage, Page_Store_Rent_Offer, PageAboutUs_Cov, PageContacts_Report }