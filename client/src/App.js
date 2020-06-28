import React, { useState, setState, useEffect } from 'react';
import './App.css';
import { Login, Logout, RegisterForm } from "./Login_Registration/LoginComponent";
import { ParamPrice } from "./Components/BaseComponents"
import API from './Api/API';
import { Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { AuthContext, LanguageItalianContext } from './Contexts/Contexts';
import { Car } from './Content/Car';
import { BaseBars, FooterPage } from './Components/BaseBars'
import { BarIcon } from './Components/BarIcon';
import * as moment from 'moment';
import { TitlePage, PageAboutUs_Cov, Page_Rentals, StubPage, Page_Store_Rent_Offer, PageContacts_Report } from './Content/BMainContent'
import { SpinnerPage } from './Components/BaseComponents'
import LInguaTesto from './Components/LInguaTesto';




class App extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            cars: [], InfoUser: null, OpFailed: false,
            StatusLogin: null, Loading: {}, Lang: false, modeDark: null, rent: null, allcars: null,
            filter: this.CarsFilter(), numcars: null, DateByLoad: false, price: null, ErrServer: false, refresh: false
        }
        this.CarsFilter = this.CarsFilter.bind(this);
    }

    // cars : auto da mostrare
    // InfoUser: info su user
    // OpFailed : stato in caso di fallimento di op
    // StatusLogin: stato del login
    // rent : noleggi da mostrare
    // allcars: numero totale auto per rent
    // numcars: numero di modelli per rent 
    // filter: closure 
    // DateByLoad: utile per capire da chi sono stati caricati i dati(component mount)
    // price: prezzo
    // loading: fase di caricamento
    // modedark: indica modalita dark/light
    // lang: indica modalita lingua
    // Errserv : impostato da handleerrors imposta un alert al posto delle tabelle(si attiva quando si stacca il server)
    
    // Need to start with loading: true to check if user already is logged in
    /*  const [loading, setLoading] = useState(true);*/



    // NB: This is required only if you want to recognize that a user is already logged in when
    // reloading the application in the browser or by manually setting a URL in the browser URL bar


    // Attempt to load user info as if the user were authenticated, to determine:
    // - if the authorization token is present (since cookie is not directly accessible by JS)
    // - if the token is present, if it is still valid

    componentDidMount() {

        this.SetLoading(true);
        API.getCarsByFilter(".").then(
            (response) => API.isAuthenticated()
                .then((user) => {

                    console.log("qui1");
                    this.setState((state, props) => ({ cars: [...response.cars], numcars: response.numcars, modeDark: false }));
                    this.setState((state, props) => ({ StatusLogin: true, InfoUser: user, Lang: false, /*filter: filtro,*/ DateByLoad: true }));

                })
                .catch((err) => {

                    console.log("qui2");
                    this.setState((state, props) => ({ cars: [...response.cars], numcars: response.numcars, modeDark: false }));
                    this.setState((state, props) => ({ InfoUser: null, StatusLogin: false, Lang: false,/* filter: filtro, */DateByLoad: true }))

                }))
            .catch((errorObj) => {
                console.log("qui3");
                this.handleErrors(errorObj);
            })
        this.SetLoading(false);

    }







  // Closure per tenere in memoria le scelte fatte sia in fase di filtro delle auto ( store ) 
  //sia in fase di composizione della richiesta di prezzo 

    CarsFilter() {
        let filtroCat = ".";
        let filtroBra = ".";
        let filtro = "";
        let filtro2 = "";
        let num, lastnum, Selezione;
        let pagina = "1";
        let price; new ParamPrice("F", "2018-01-01", "2018-01-02", 100, 30, false, false);

        const that = this;  //Costruzione del filtro da passare al API
        function FilterCars(str, type, in_out) {
            console.log(str + " " + " " + type)


            if (type === "pagina") { pagina = str; }
            else { pagina = "1"; }
            if (type === "cat") {
                if (in_out === 1) {
                    if (filtroCat !== ".")
                        filtroCat += "&" + str;
                    else
                        filtroCat = str;
                    if (str == 0) { filtroCat = "."; }
                }
                else {
                    if (filtroCat.length !== 1) {
                        console.log(filtroCat.length);

                        num = filtroCat.indexOf(str);
                        console.log(num);
                        filtroCat =
                            (num > 0 ? filtroCat.slice(0, num - 1) + filtroCat.slice(num + 1, filtroCat.length) : filtroCat.slice(2, filtroCat.length))

                    }
                    else { filtroCat = "."; }
                }
            }
            if (type === "bra") {
                pagina = 1;
                if (in_out === 1) {
                    if (filtroBra !== ".")
                        filtroBra += "&" + str;
                    else
                        filtroBra = str;
                    if (str == 0) { filtroBra = "."; }
                }
                else {
                    if (filtroBra.indexOf("&") !== -1) {
                        console.log(filtroBra.length);

                        num = filtroBra.indexOf(str);
                        lastnum = str.length + num;
                        console.log(num + " " + lastnum);
                        filtroBra =
                            (num > 0 ? filtroBra.slice(0, num - 1) + filtroBra.slice(lastnum, filtroBra.length) : filtroBra.slice(lastnum + 1, filtroBra.length))

                    }
                    else { filtroBra = "."; }
                }
            }

            console.log(filtroCat)
            console.log(filtroBra)
            console.log(pagina)
            filtro = "/filter/category=" + filtroCat + "&brand=" + filtroBra + "/record=14&offset=" + pagina;
            console.log(filtro);
            API.getCarsByFilter(filtro).then(
                (response) => that.setState((state, props) => ({ cars: [...response.cars], numcars: response.numcars, DateByLoad: false })));
        }
        function CarsAvalaiblePrice(val, type) { //Costruzione dei parametri del prezzo 
            console.log(val);
            switch (type) {
                case 0:
                    if (val === "") {
                        Selezione[type] = false;
                        that.setState((props, state) => ({ price: null }));
                        that.UpdateCars(2);
                    }
                    else {
                        price.SetCategoria(val);
                        Selezione[type] = true;
                    }
                    break;
                case 1:

                    if (val === "") {
                        Selezione[type] = false;
                        that.setState((props, state) => ({ price: null }));
                        that.UpdateCars(2);
                    }
                    else {
                        price.SetDataInizio(val);
                        Selezione[type] = true;
                    }
                    break;
                case 2:
                    if (val === "") {
                        Selezione[type] = false;
                        that.setState((props, state) => ({ price: null }));
                        that.UpdateCars(2);
                    }
                    else {
                        price.SetDataFine(val);
                        Selezione[type] = true;
                    }
                    break;
                    break;

                case 3:  // Valori di default per i vari intervalli
                    switch (val[0]) {
                        case '<':
                            val = 24;
                            break;
                        case '>':
                            val = 68;
                            break;
                        default:
                            val = 30;
                            break;
                    }


                    price.SetAge(val);
                    break;   // Valori di default per i vari intervalli
                case 4: console.log(val[0]);
                    switch (val[0]) {
                        case '<':
                            val = 25;
                            break;
                        case '>':
                            val = 200;
                            break;
                        default:
                            val = 100;
                            break;
                    }

                    price.SetKmDay(val);
                    break;
                case 5:
                    price.SetExtraAss()
                    break;
                case 6:
                    price.SetAddDriver();
                case 7:
                    pagina = val;

            }
            if (type != 7) { pagina = 1; }
            let Cat = price.GetCategoria();
            let DataInizio = price.GetDataInizio();
            let DataFine = price.GetDataFine();
            console.log(price);
            console.log(Selezione); // Controllo che siano stati selezioni almeno Categorie e date prima di passare tutto al API
            if (Selezione[0] && Selezione[1] && Selezione[2]) {
                filtro = '/findprice/category=' + Cat + '&datebegin='
                    + DataInizio + '&dateend=' + DataFine + '/record=14' + '&offset=' + pagina;
                filtro2 = '/findcars/category=' + Cat + '&datebegin='
                    + DataInizio + '&dateend=' + DataFine + '/record=14' + '&offset=' + pagina;

                console.log(filtro)
                console.log(filtro2);
                that.GetPriceAndCars(filtro, filtro2, price); // Chiama sia la get per le auto disponibili che la post per il prezzo
            }

        }
        function StartFormRentFormStore() {
            //Default request

            filtroCat = ".";
            filtroBra = ".";
            filtro = "";
            filtro2 = "";
            Selezione = [false, false, false];
            price = new ParamPrice("F", "2018-01-01", "2018-01-02", 100, 30, false, false);
            if (that.state.InfoUser) {
                const user = that.state.InfoUser.username;
                price.SetUser(user);
            }
            that.setState((props, state) => ({ price: null }));

        }
        function GetRent() {
            let Categoria = filtro[20];
            let DataInizio = filtro.slice(32, 42);
            let DataFine = filtro.slice(51, 61);

            const rent = { categoria: Categoria, DataInizio: DataInizio, DataFine: DataFine };
            return { rent: rent, ParamPrice: price };




        }
        return {
            FilterCars: FilterCars,
            CarsAvalaiblePrice: CarsAvalaiblePrice,
            StartFormRentFormStore: StartFormRentFormStore,
            GetRent: GetRent

        }
    }





    GetPriceAndCars = (filtro, filtro2, Paramprice) => {
        const user = this.state.InfoUser.username.split("@")[0];
        // console.log(user);
        API.GetPrice(filtro, Paramprice, user).then((price) =>
            API.getAvalaibleCars(filtro2, user)
                .then(
                    (response) => this.setState((state, props) =>
                        ({ cars: [...response.cars], numcars: response.numcars, price: price, allcars: response.numnotmodel }))))
            .catch((errorObj) => {

                this.handleErrors(errorObj);
            })

    }








    ChangeLang = () => {
        this.setState((state, props) => ({ Lang: !this.state.Lang }));
    }
    ChangeMode = () => {
        this.setState((state, props) => ({ modeDark: !this.state.modeDark }));
    }

    NewRental = (dati, rent, ParamPrice) => {
      
        API.InsertNewRental(rent, ParamPrice, ParamPrice.User, dati).then(
            (result) => {
                this.SetLoading(false);
             
                this.setState((props, state) => ({ price: 0 }));
            })
            .catch((errorObj) => {
                this.setState((props, state) => ({ price: -1 }));
                this.SetLoading(false);
                console.log("qui3");
            })

    }

    PayRental = (dati, price) => {
        let res = this.state.filter.GetRent();

        API.SendPay(dati, price, res.ParamPrice.User).then(
            (result) => {
                console.log("sendp");
                if (result) {
                    console.log("postSendPay")

                    this.NewRental(dati, res.rent, res.ParamPrice);
                }
                else {
                    this.SetLoading(false);
                    this.setState((props, state) => ({ price: -1 }));
                }
            }).catch((errorObj) => {
                this.SetLoading(false);
                console.log("qui3");
                this.handleErrors(errorObj);

            });

    }



    deleteRental = (ID) => {
        console.log(ID)
        API.DeleteRental(ID, this.state.InfoUser.username)
            .then((res) => {
                console.log("---")
                console.log(res);
                console.log("---")
                if (res === -1)
                    this.setState((props, state) => ({ OpFailed: true }));
                this.UpdateRental(1);
            })
            .catch((errorObj) => {
                console.log("qui");
                this.setState((props, state) => ({ OpFailed: true }));

            });


    }
    closeOpFail = () => {
        this.setState((props, state) => ({ OpFailed: false }));
    }

    UpdateRental = (num) => {  
        console.log("rent--")
        let user, loading = false;
        let filtro;
        if (num < 0)  //Case for refresh for alert
        {
            num = num + 2;
            loading = true;
        }
        if (num == 0) {
            filtro = "/past=1"

        }
        else {
            filtro = "/past=0"
        }
        console.log("rent--")
        API.getRentalsByUser(filtro, this.state.InfoUser.username).then((rent) => {
            this.setState(
                (props, state) => ({ rent: [...rent], DateByLoad: false, ErrServer: false }));
            API.isAuthenticated().then((user) => this.setState(
                (props, state) => ({ InfoUser: user })))
        })
            .catch((errorObj) => {
                console.log("qui.....");
                this.handleErrors(errorObj);
            });

        if (loading)
            this.SetLoading(false);

    }



    UpdateCars = (num) => {  //Aggiorna le auto nelle varie situazioni/pagine
        let user;
        let User;
        let Categoria = "B";
        let DataInizio = moment().format('YYYY-MM-DD');
        let DataFine = moment().add(1, 'days').format('YYYY-MM-DD');
        let filtro;
        console.log(num);


        if (num === 0) {
            filtro = "/filter/category=.&brand=./record=14&offset=1";
            console.log(filtro);
            API.getCarsByFilter(filtro).then(
                (response) => this.setState((state, props) =>
                    ({ cars: [...response.cars], numcars: response.numcars, ErrServer: false, DateByLoad: false })))
                .catch((errorObj) => {
                    console.log("q");
                    this.handleErrors(errorObj);
                });
        }
        if (num === 1) {
            console.log(this.state.InfoUser);
            if (!this.state.InfoUser) { return <Redirect to="/login" /> }
            User = this.state.InfoUser && this.state.InfoUser.username;
            if (this.state.InfoUser) {
                user = this.state.InfoUser.username.split("@")[0];
                console.log(User);
            }
            filtro = "/findcars/category=" + Categoria + "&datebegin=" + DataInizio + "&dateend=" + DataFine + "/record=14&offset=1";
            console.log(filtro);
            console.log("......")
            API.getAvalaibleCars(filtro, user).then(
                (response) => {
                    console.log(response);
                    this.setState((state, props) =>
                        ({ cars: [...response.cars], numcars: response.numcars, ErrServer: false, DateByLoad: false, allcars: response.numnotmodel }));
                })
                .catch((errorObj) => {
                    this.handleErrors(errorObj);
                });

        }
        if (num == 2) {

            filtro = "/filter/category=.&brand=./record=14&offset=.";
            API.getCarsByFilter(filtro).then(
                (response) => this.setState((state, props) =>
                    ({ cars: [...response.cars], numcars: response.numcars, ErrServer: false, DateByLoad: false })))
                .catch((errorObj) => {
                    this.handleErrors(errorObj);
                });
        }




    }

    handleErrors = (err) => {

        if (err)
            if ((err.errors && err.errors[0].msg === "Authorization error") || (err.status === 401)) {
                console.log("qui");
                this.setState({ InfoUser: null, StatusLogin: false });

                return <Redirect to="/login" />
            }
            else {
                this.setState((props, state) => ({ ErrServer: true, Loading: false }));
                console.log("Error in server");
            }
    }


    SetLoading = (value) => {
        this.setState((state, props) => ({ Loading: value }));
    }



    logout = () => {
        API.userLogout().then((res) => {
            this.setState((state, props) => ({ StatusLogin: false, InfoUser: null }));

            return <Redirect to="/store" />
        }).catch((res) => {
            this.setState((state, props) => ({ StatusLogin: false, InfoUser: null }));

            return <Redirect to="/store" />

        })
    }
    // Add a login method

    Login = (username) => {
        console.log(username);
        this.setState((state, props) => ({ StatusLogin: true, InfoUser: username }));
        this.UpdateCars(1);

    };




    render() {


        if (!this.state.Loading) {
            return <> <div class={this.state.modeDark ? "dark" : "light"}> <AuthContext.Provider value={this.state.StatusLogin}>
                <LanguageItalianContext.Provider value={this.state.Lang}>
                    <Switch >
                        <Route path='/personal/history' render={(props) => {

                            if (!this.state.StatusLogin || this.state.ErrServer)
                                return <Redirect to='/login' />
                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <BaseBars UpdateCars={this.UpdateCars} UpdateRental={this.UpdateRental} logout={this.logout} user={this.state.InfoUser} darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Le tue prenotazioni concluse" : "Yout story with us"} />
                                <Page_Rentals page={"history"} rent={this.state.rent} darkmode={this.state.modeDark} DateByLoad={this.state.DateByLoad} ErrServer={this.state.ErrServer}
                                    SetLoading={this.SetLoading} UpdateRental={this.UpdateRental} deleteRental={this.deleteRental} />
                                <FooterPage /></>
                        }}></Route>
                        <Route path='/personal/reservations' render={(props) => {

                            if (!this.state.StatusLogin || this.state.ErrServer)
                                return <Redirect to='/login' />;
                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <BaseBars UpdateCars={this.UpdateCars} UpdateRental={this.UpdateRental} logout={this.logout} user={this.state.InfoUser} darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Le tue prenotazioni" : "Your reservations"} />
                                <Page_Rentals page={"reservations"} closeOpFail={this.closeOpFail} opfail={this.state.OpFailed} rent={this.state.rent} darkmode={this.state.modeDark} DateByLoad={this.state.DateByLoad} ErrServer={this.state.ErrServer}
                                    SetLoading={this.SetLoading} UpdateRental={this.UpdateRental} deleteRental={this.deleteRental} />
                                <FooterPage /></>
                        }}></Route>
                        <Route path='/personal/reports' render={(props) => {

                            if (!this.state.StatusLogin)
                                return <Redirect to='/login' />;
                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <BaseBars UpdateCars={this.UpdateCars} UpdateRental={this.UpdateRental} logout={this.logout} user={this.state.InfoUser} darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Segnalazione" : "Report"} />
                                <PageContacts_Report page="reports" />
                                <FooterPage /></>
                        }}></Route>
                        <Route path='/personal/cov' render={(props) => {
                            //this.state.Path.setPath(props);
                            if (!this.state.StatusLogin)
                                return <Redirect to='/login' />;
                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <BaseBars UpdateCars={this.UpdateCars} UpdateRental={this.UpdateRental} logout={this.logout} user={this.state.InfoUser} darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Informazioni sul COVID-19" : "Information about COVID-19"} />
                                <PageAboutUs_Cov page="cov" />
                                <FooterPage /></>
                        }}></Route>
                        <Route path='/newrental/stub' render={(props) => {

                            if (!this.state.StatusLogin)
                                return <Redirect to='/login' />;
                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <StubPage darkmode={this.state.modeDark} PayRental={this.PayRental} price={this.state.price} SetLoading={this.SetLoading} /></>
                        }}>
                        </Route >
                        <Route path='/store' render={(props) => {

                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <BaseBars UpdateCars={this.UpdateCars} UpdateRental={this.UpdateRental} logout={this.logout} user={this.state.InfoUser} darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Parco auto " : "Car Store"} />
                                <Page_Store_Rent_Offer page="store"
                                    DateByLoad={this.state.DateByLoad} ErrServer={this.state.ErrServer} SetLoading={this.SetLoading} darkmode={this.state.modeDark}
                                    cars={this.state.cars} CloF={this.state.filter} UpdateCars={this.UpdateCars} numcars={this.state.numcars} />

                                <FooterPage /></>
                        }}>
                        </Route >

                        <Route path='/login' render={(props) => {

                            if (this.state.StatusLogin)
                                return <Redirect to='/newrental' />;
                            else
                                return <>
                                    <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} page="login" UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                    <Login Login={this.Login} SetLoading={this.SetLoading} />

                                    <FooterPage /></>;
                        }} >
                        </Route>
                        <Route path='/register' render={(props) => {

                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} page="register" darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Registrazione" : "Registration "} />
                                <RegisterForm />
                                <FooterPage /></>
                        }}></Route>

                        <Route path='/newrental' render={(props) => {

                            if (!this.state.StatusLogin)
                                return <Redirect to='/login' />;
                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <BaseBars UpdateCars={this.UpdateCars} UpdateRental={this.UpdateRental} logout={this.logout} user={this.state.InfoUser} darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Affitta qui la tua auto" : "Rent a new car "} />
                                <Page_Store_Rent_Offer page="rent" ErrServer={this.state.ErrServer} user={this.state.InfoUser.Premium} allcars={this.state.allcars} SetLoading={this.SetLoading} darkmode={this.state.modeDark} cars={this.state.cars} price={this.state.price}
                                    CloF={this.state.filter} UpdateCars={this.UpdateCars} DateByLoad={this.state.DateByLoad} numcars={this.state.numcars} />
                                <FooterPage /></>
                        }}>
                        </Route >
                        <Route path='/aboutus' render={(props) => {

                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <BaseBars UpdateCars={this.UpdateCars} UpdateRental={this.UpdateRental} logout={this.logout} user={this.state.InfoUser} darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Chi siamo" : "About us"} />
                                <PageAboutUs_Cov page="aboutus" />
                                <FooterPage /></>
                        }}></Route >

                        <Route path='/specialoffer' render={(props) => {


                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <BaseBars UpdateCars={this.UpdateCars} UpdateRental={this.UpdateRental} logout={this.logout} user={this.state.InfoUser} darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Offerte Giugno 2020" : "New offers for June 2K20"} />
                                <Page_Store_Rent_Offer ErrServer={this.state.ErrServer} darkmode={this.state.modeDark}
                                    SetLoading={this.SetLoading} page="offer" UpdateCars={this.UpdateCars} cars={this.state.cars} DateByLoad={this.state.DateByLoad} numcars={this.state.numcars} />
                                <FooterPage /></>
                        }}>
                        </Route >
                        <Route path='/contacts' render={(props) => {

                            return <>
                                <BarIcon ChangeMode={this.ChangeMode} ChangeLang={this.ChangeLang} UpdateCars={this.UpdateCars} darkmode={this.state.modeDark} />
                                <BaseBars UpdateCars={this.UpdateCars} UpdateRental={this.UpdateRental} logout={this.logout} user={this.state.InfoUser} darkmode={this.state.modeDark} />
                                <TitlePage title={this.state.Lang ? "Contatti" : "Contacts"} />
                                <PageContacts_Report page="contacts" />
                                <FooterPage /></>
                        }} ></Route>
                        <Route path='/' render={(props) => {
                            return <Redirect to='/store' />;
                        }} ></Route>

                    </Switch>

                </LanguageItalianContext.Provider>
            </AuthContext.Provider></div>
            </>
        }
        else {
            return <><SpinnerPage /> </>
        }
    }


}
export default withRouter(App);