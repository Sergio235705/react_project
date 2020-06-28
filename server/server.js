//import Rental from './Rental';
const moment = require('moment')
const express = require('express');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator'); // validation library
const dao = require('./dao.js');

const jwtSecretContent = require('./secret.js');
const jwtSecret = jwtSecretContent.jwtSecret;

const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());
function CountRequest() {
  let valueReq=0;
  return {
    NewRequest: function() {
      valueReq++;
      return valueReq;
    },
    ZeroRequest: function() {valueReq=0;}
  };
  }
const count=CountRequest();





   
// DB error
const dbErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };
// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

const expireTime = 300; //seconds

// Authentication endpoint
app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let state;
  dao.checkUserPass(username, password)
    .then((user) => {
      const token = jsonwebtoken.sign({ username: user.username }, jwtSecret, {expiresIn: expireTime});
      res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
      res.json(user);
    }).catch(
      // Delay response when wrong user/pass is sent to avoid fast guessing attempts
      (test) => 
      
      new Promise((resolve) => {
        state=true;
        if(count.NewRequest()>4) // Closure 
         {  state=false;
      }
        setTimeout(resolve, 4000)
      }).then(
           () => res.status(state ? 401 : 429).end() // 429 troppe richieste si fa attendere il client prima di riproporgli il form
      )                               
    ); 
  

});
 
app.post('/api/registration', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const nome= req.body.nome;
  console.log(req.body);
  dao.ValidEmail(user).then(()=>
  dao.StoreUserPass(username, password,nome) .then((result) => res.end())
  .catch((err) => res.status(500).json(dbErrorObj)))
  .catch((err)=>res.status(500).json(dbErrorObj));
  

});



app.use(cookieParser());


app.post('/api/logout', (req, res) => {
  count.ZeroRequest();
  res.clearCookie('token').end();
});
 // controlla l'unicità del username in fase di registrazione
app.post('/api/newusername', (req, res) => {
  
  user=req.body.username;
  dao.ValidEmail(user).then(()=>
    dao.ValidUsername(user)
      .then((result) => res.json(result))
      .catch((err) => res.status(503).json(dbErrorObj)))
      .catch((err)=> res.status(503).json(dbErrorObj));
  });

 
  app.get('/api/cars/brands', (req, res) => {
  
    dao.listBrands()
      .then((brands) => res.json(brands))
      .catch((err) => res.status(503).json(dbErrorObj));
  });  // record numero di risultati , Offset pagina , category esempio di A AND B : A&B  , brand esempio : Fiat&BMW , category : "." (Tutte le categorie)
  app.get('/api/cars/filter/category=:c&brand=:brand/record=:r&offset=:p', (req, res) => {
   
    
    console.log(req.params);
    categoria=req.params.c||"."; // . all categories
    brand=req.params.brand||"."; // . all brands
    Pagina=req.params.p||0;
    record=req.params.r||0;
    console.log(categoria+" "+brand+" "+Pagina);
    dao.ValidPageRecords(Pagina,record).then(()=>
    dao.listCars(categoria,brand,Pagina,record)
      .then((cars) => res.json(cars))
      .catch((err) => res.status(503).json(dbErrorObj)))
      .catch((err) => res.status(503).json(dbErrorObj));
  });

app.use(
  jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
  })
);


// To return a better object in case of errors 

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json(authErrorObj);
  }
});


app.post('/api/users/:user/newrental/validpayment'
, (req, res) => {
  console.log("oh");
  let dati=req.body;
  let carta=dati.carta;
  let data=dati.data;
  let ccv=dati.ccv;
  let name=dati.name;
  let lastname=dati.lastname;
  dao.ValidPayment(carta,data,ccv,name,lastname).then((response)=> res.json(response))
    .catch((err) => res.status(503).json(dbErrorObj));
}); 
// GET /user : 
app.get('/api/user', (req, res) => {
  // Extract userID from JWT payload***********<-------
 // console.log(req);
  
  const userID = req.user && req.user.username;
  dao.loadUserInfo(userID)   // Only retrieve user info: jwt would stop if not authorized
  .then((userObj) => {
    console.log(userObj)
    res.json(userObj);
  }).catch((err) => res.status(503).json(dbErrorObj));
});



// REST API endpoints


 // con past=1 noleggi passati past=0 noleggi in corso e futuri
app.get('/api/users/:user/rentals/past=:res', (req, res) => {
  const userID = req.user && req.user.username;

  console.log(req.params.res)
  dao.readRentalsByUser(userID,req.params.res)
    .then((rentals) => res.json(rentals))
    .catch((err) => res.status(503).json(dbErrorObj));
});



 // findcars with category datebegin dateend record(num risultati ) offset(pagina)
app.get('/api/users/:user/findcars/category=:cat&datebegin=:DB&dateend=:DE/record=:r&offset=:p'
, (req, res) => {
 
  rent={Categoria:req.params.cat,DataInizio:req.params.DB,DataFine:req.params.DE};
  record=req.params.r;
  Pagina=req.params.p;  //paramCars={NumerodiAutodisponibili,ListaAuto}
  dao.CheckParam(rent,null).then(()=>
  dao.getcarsAvalaible(rent,Pagina,record,true).then((results)=>
  res.json(results))   // Oggetto= {NumeroAuto: ,ListaAuto Disponibili }
    .catch((err) => res.status(503).json(dbErrorObj)))
    .catch((err) => res.status(503).json(dbErrorObj))
});




app.post('/api/users/:user/findprice/category=:cat&datebegin=:DB&dateend=:DE/record=:r&offset=:p'
, (req, res) => {
 

  rent={Categoria:req.params.cat,DataInizio:req.params.DB,DataFine:req.params.DE};
  ParamPrice=req.body;
  record=req.params.r;
  Pagina=req.params.p;  //paramCars[0]=NumerodiAutodisponibili,[1]=ListaAuto
  //Check gestisce un controllo di vari parametri
  dao.CheckParam(rent,ParamPrice).then(()=>
  dao.getcarsAvalaible(rent,Pagina,record,false).then((paramCars)=>
   dao.newrental(ParamPrice,paramCars,"info")).then((price)=>
  res.json(price))   // Oggetto= Prezzo    mod:info per il calcolo del prezzo ai fini di mostrarlo
  .catch((err) => res.status(503).json(dbErrorObj))
    .catch((err) => res.status(503).json(dbErrorObj)))
    .catch((err) => res.status(503).json(dbErrorObj));
});



app.post('/api/users/:user/addrental', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

/*rent={Marca:'Kia',Modello:'Sportage',DataInizio:'05/06/2020',DataFine:'15/06/2020'};
 ParamPrice={Categoria:"B",NumDays:3,KmGiornalieri:20,AgeDriver:22,ExtraAss:true,NumDriverAdd:2,Meno10PCars:true,User};*/
 const userID = req.user && req.user.username;
 console.log(req.body)
 console.log(req.body.Price.User);
 let rent=req.body.rent;
 rent={Categoria:rent.categoria,user:userID,
  DataInizio:rent.DataInizio,DataFine:rent.DataFine}
 console.log(rent);
 dao.CheckParam(rent,req.body.Price).then(()=>
  dao.ValidPayment(req.body.dati.carta,req.body.dati.data,req.body.dati.ccv,
    req.body.dati.name,req.body.dati.lastname).then((response)=>(
   response && 
 dao.getIDcar(rent) //paramCars{NumerodiAutoDisponibili,IDCar}
 .then((paramCars)=>dao.newrental(req.body.Price,paramCars,"Add")) // mod add calcolo del prezzo ai fini di inserimento in db
 .then((rent) => dao.AddRental(rent))
 .then((result)=> res.json(result)) 
   .catch((err) => res.status(503).json(dbErrorObj))
   .catch((err) => res.status(503).json(dbErrorObj))
   .catch((err) => res.status(503).json(dbErrorObj)) ))
   .catch((err) => res.status(503).json(dbErrorObj)))
   .catch((err) => res.status(503).json(dbErrorObj));

});






// DELETE /exams/<course_code>
app.delete('/api/users/:user/rentals/delete=:idRent', (req, res) => {
  // Extract userID from JWT payload

  const userID = req.user && req.user.username;
  console.log(req.params);
  // Controlla se il rent che si vuole cancellare non sia in corso 
  dao.CheckData(req.params.idRent,userID).then((result)=> { 
    console.log(result);
    if(result)
 { dao.deleteRent(req.params.idRent,userID)  //idrent 
    .then((result) => res.json(result))
    .catch((err) => res.status(503).json(dbErrorObj));} 
  else 
    {res.json(-1);}});
});



// Activate web server
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));