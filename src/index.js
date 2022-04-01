import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Auth from './modules/Auth';


import Login from "./Login"; 
import DirectLogin from "./DirectLogin"; 

import Dashboard from './Dashboard'; 

import ProtectedRoute from './ProtectedRoute'; 

import Campaignlist from './campaign/campaignlist';
import Campaignedit from './campaign/campaignedit';
import Campaignadd from './campaign/campaignadd';
import Campaignads from './campaign/campaignads';


import Daywisecap from './campaign/daywisecap';
import Filter from './campaign/filter';

import UserEdit from './users/UserEdit';
import Filteredit from './campaign/filteredit';
import Filteradd from './campaign/filteradd';

import Reportstate from './report/reportstate';
import Report from './report/report';
import Dynamicprice from './campaign/dynamicprice';
import Clickreport from './report/clickreport';

import Apispecs from './campaign/apispecs';



const App = () => (
  <div>
  
    
      <AuthProvider>
	 
        <Switch>
          
        <Route path="/directLogin/:id" component={DirectLogin} />
          <Route path="/Login" component={Login} />
		  <Route exact path="/" component={Dashboard} />
       <ProtectedRoute path="/UserEdit/:id" component={UserEdit} />    
          
          
      <ProtectedRoute path="/campaign" component={Campaignlist} />    
      
      <ProtectedRoute path="/campaignedit/:id" component={Campaignedit} /> 
      <ProtectedRoute path="/campaignadd" component={Campaignadd} /> 
      <ProtectedRoute path="/campaignads/:id" component={Campaignads} /> 
      

      <ProtectedRoute path="/daywisecap/:id" component={Daywisecap} /> 
      <ProtectedRoute path="/filter/:id" component={Filter} />
      <ProtectedRoute path="/filteredit/:id/:main" component={Filteredit} />   
      <ProtectedRoute path="/filteradd/:id" component={Filteradd} />   
	  
	  	
		   <ProtectedRoute path="/report-state" component={Reportstate} />
		  <ProtectedRoute path="/report" component={Report} /> 
      <ProtectedRoute path="/clickreport" component={Clickreport} /> 
      
      <ProtectedRoute path="/dynamicprice/:id" component={Dynamicprice} /> 
      <ProtectedRoute path="/apispecs/:id/:token/:display_name" component={Apispecs} /> 

      
      
      
	  	
        </Switch>
      </AuthProvider>

   
  </div>
)

render((
    <BrowserRouter basename={Auth.getBasename()}>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));