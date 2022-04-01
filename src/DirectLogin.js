import React, { Component } from "react";

import axios from 'axios';
import store from 'store';
import { AuthConsumer } from './AuthContext';
import { Redirect } from 'react-router-dom';
import Auth from './modules/Auth';
import ReactEncrypt from 'react-encrypt';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
 
class DirectLogin extends Component {

  constructor(props) {

    super(props);
    this.state = { 
      loaded: false
    }
  

      this.getDirectLogin();

      
  };

  getDirectLogin(e){
   
    const headers = {
      'Content-Type': 'application/json',
      'Authkey': Auth.Authkey(),
      'session': this.props.match.params.id
    }
    
    
      axios.post(`${Auth.getapiurl()}/getUsersbyid`,
      {},
      {
        headers: headers
      }).then(res => {
    
            
            const status = res.data.status;
           
             
              if(status == 22){
                this.setState({ loaded: true }); 
                Auth.toastmsg(res.data.message,'E');
                localStorage.clear(); 
                 window.location.href = Auth.getSiteUrl()+'/';
              }else{
                this.setState({ loaded: true }); 
                Auth.toastmsg(res.data.message,'S')
                store.set('id_token', res.data.responsedata.session);
                 store.set('userdata', JSON.stringify(res.data.responsedata.userdata));
                 window.location.href= Auth.getSiteUrl()+'/'; 
              }     
    
    
            }).catch(error => {
            
            
              this.setState({ loaded: true }); 
                    localStorage.clear(); 
               window.location.href= Auth.getSiteUrl()+'/'; 
      })

      



  }

  render() {
    
    return (

      <div>
      <Loader loaded={this.state.loaded}>
      </Loader>
      </div>
  
      );
    }
  }
 
export default DirectLogin;