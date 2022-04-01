import React, {Component} from 'react';
import store from 'store';
import axios from 'axios';
import Header from '../Header';
import { Redirect, Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import Loader from 'react-loader';
import { confirmAlert } from 'react-confirm-alert';

class Filter extends Component { 


   constructor(props) {
      super(props);
      this.state = {
        fields: [],
        errors: {},
        errorMessage : '',
        message : '',
        status : '',
		userbyid : '',
    loaded: false,

      }
	  
	  //console.log(this.props.match.params.id);
	  
	  
       this.getFilter();

    };


handleChangeStatus = (itemId) => {


confirmAlert({
      title: 'Are You sure ?',
      message: 'You want Delete this Item?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.handleDelete(itemId)
        },
        {
          label: 'No'
          
        }
      ]
    });


   
    };

	 renderAlert() {

    if (this.state.errorMessage && this.state.status == '0') {



      return (
        <div className="row">
        <div className="col-md-12">
        <div className="alert alert-danger">
          <strong>!Opps, </strong>{ this.state.errorMessage }
        </div></div></div>

      );
    }else if(this.state.errorMessage && this.state.status == '1'){
      return (
        <div className="row">
        <div className="col-md-12">
        <div className="alert alert-success">
          <strong>Success, </strong>{ this.state.errorMessage }
        </div></div></div>
      );
    }





  }
  
	
	
	
	
	getFilter()
  {

const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}


  axios.post(`${Auth.getapiurl()}/getFilter`,
  {
    leadID: this.props.match.params.id
  },
  {
    headers: headers
  }).then(res => {

        const status = res.data.status;
        this.setState({status})
       
        const product = res.data.responsedata.product;
        this.setState({product})
        
        
        const Campaign_code = res.data.responsedata.Campaign_code;
        this.setState({Campaign_code})
         this.setState({ loaded: true });
        if(status == 1){

          const message = res.data.message;
        this.setState({errorMessage:''})


            const fields = res.data.responsedata.results;

            
            this.setState({fields: fields})

        }else{
          var fields = this.state.fields;
          const message = res.data.message;
        this.setState({message:message})
          this.setState({fields: []})
        }

        })
    
  }
  
  
	

  
 handleDelete = itemId => {
    const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}

  axios.post(`${Auth.getapiurl()}/removeFilter`,
  {
    itemId: itemId
  },
  {
    headers: headers
  }).then(res => {


      const status = res.data.status;
        this.setState({status})
        const message = res.data.message;
        this.setState({errorMessage:message})

          if(res.data.status==1){     
   Auth.toastmsg(res.data.message,'S')  
 }else{
  Auth.toastmsg(res.data.message,'E') 
 }

  

  this.setState({fields:[]})

  this.getFilter();
 





    
    });
    };
	  
	
	

  
  render() {
	  
	
	  
	  const fields = this.state.fields;
	
    


	 if (!Auth.getToken()) {
		 return <Redirect to="/login" />;
	 }   

 const status = this.state.status;
  const status_msg = this.state.message;
  let table;
  if(status == '0') {

       table = <div className="col-md-12">
                                           <table className="table table-bordered table-striped">
                       <thead className="thead-dark">
                       <tr>
                       
                       <td>Filter</td>
                       <td>Filter Condition</td>
                       <td>Filter Value</td>
                      
                       <td>Make a Change</td>
                       
                       </tr>
                       </thead>
                       
                      
                       <tbody>
                       <tr>
                       <td colspan="4">{status_msg}</td>
                       </tr>
                       </tbody>
                       </table>
                      </div>;   
      
    }else{  

      

      table =<div className="col-md-12">
                                           <table className="table table-bordered table-striped">
                       <thead className="thead-dark">
                       <tr>
                       
                       <td>Filter</td>
                       <td>Filter Condition</td>
                       <td>Filter Value</td>
                      
                       <td>Make a Change</td>
                       
                       </tr>
                       </thead>
                       
                       
                       
                       
                       <tbody>
                       {this.state.fields.map(item =>
                                             <tr key={item.id}>
                      
                       
                        <td>{item.display_name}</td> 
                       <td>{item.field_condition_display_name} ({item.field_condition})</td>
                      
                       <td>{item.field_value}</td>
                       <td>
                      
                      
                      <Link to={'/filteredit/'+item.id+'/'+this.props.match.params.id} className="btn btn-info" 
                       ><i className="fa fa-edit"></i></Link>

                      <button type="submit" className="btn btn-danger leftside"                      
                       onClick={()=>this.handleChangeStatus(item.id)}
                      ><i className="fa fa-trash"></i> </button>
                      
                      
                       </td>
                      
                      
                      </tr>
                      )}
                        </tbody>
                                 </table>
                        
                                        </div>;
                                           
    } 
	  
	  
     return (
      <div>
    <Loader loaded={this.state.loaded}>
    </Loader>
     <div>
    <Header />
    </div>
        <div className="content-wrapper">
                <section className="content-header">
                
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header with-border">
                                    <div className="col-md-12"><h3 className="box-title">{this.state.product} Filter</h3>
                                    <div className="pull-right">
                                    <div className="col-md-9">
                    <h2 className="box-title">[ Campaign : {this.state.Campaign_code} ] </h2> 
                    </div>
                    <div className="col-md-1">
                     <Link to={'/filteradd/'+this.props.match.params.id} className="btn btn-info"><i className="fa fa-plus"></i> Add Campaign Filter</Link>
                     </div>
                    </div>
                                    </div>
                  </div>
                                
                                <div className="box-body">
                                    <div className="row">
                                        {table}
                                      <div className="box-footer text-center col-sm-12">
                <Link className="btn btn-primary" to={"/campaign"}>Back</Link>
                
              </div>  
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </section>
            </div>
      </div>
    );
  }


}

export default Filter;