import React, {Component} from 'react';
import store from 'store';

import axios from 'axios';
import Header from '../Header';
import { Redirect, Link, withRouter  } from 'react-router-dom';
//import Pagination from '../component/Pagination';
import Auth from '../modules/Auth';
import Loader from 'react-loader';
import Pagination from "react-js-pagination";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

class Reportbycampaign extends Component { 
  


  constructor(props) {
        super(props);
        //var exampleItems = [...Array(10).keys()].map(i => ({ id: (i+1), name: 'Item ' + (i+1) }));
    this.addnewhandleclick = this.addnewhandleclick.bind(this);
    
    
    this.getAllCampaignlist(1,Auth.Itemperpagecount());

        this.state = {
          fields:[{
                update_price:'',           
          }],
        itemId:'',
        price:'',
        label:'' ,
        quality_type:'',
        base_price:'',
        errors: {},
        pageOfItems: [],
        persons: [],
        open: false,
        search:'',
        status_msg:'',
        loaded: false,
         errorMessage : '',
        status:'',
        activePage: 1,
        TotalRecords: Auth.Itemperpagecount(),
        stype:''
      
        };
    this.handlePageChange = this.handlePageChange.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    this.changestatus = this.changestatus.bind(this);
     this.changeprice = this.changeprice.bind(this);
     this.pricechange = this.pricechange.bind(this);
    

        

    }


 onOpenModal = (itemId,base_price,price,label,quality_type) => {
    this.setState({ open: true });
    this.setState({ itemId: itemId });
    this.setState({ price: price });
    this.setState({ base_price: base_price });
    this.setState({ label: label });
    this.setState({ quality_type: quality_type });
    

  };
 
  onCloseModal = () => {
    this.setState({ open: false });
    this.setState({ itemId: '' });
    this.setState({ price: '' });
    this.setState({ base_price: '' });
    this.setState({ label: '' });
    this.setState({ errors: '' });
    this.setState({ quality_type: '' });
    
  };




pricechange(e){
   
       let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
     
      this.setState({
        fields
      });
      
     }


 changeprice(itemId){

  if (this.validateForm()) {
 console.log(this.state)
     const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}

  axios.post(`${Auth.getapiurl()}/Updateprice`,
  {
    itemId: itemId,
    price:this.state.fields.update_price
  },
  {
    headers: headers
  }).then(res => {

 //const  errorMessage =res.data.message;

 //this.setState({errorMessage});
  //const status = res.data.status;
        
  //this.setState({ status }); 

   if(res.data.status==1){     
   Auth.toastmsg(res.data.message,'S')  
 }else{
  Auth.toastmsg(res.data.message,'E') 
 }
  
 setTimeout(() => {
  this.setState({
    errorMessage:'',
    status:''
  });

 this.setState({ open: false });
  this.getAllCampaignlist(1,Auth.Itemperpagecount()); 

}, 2000)






    
    });
  }
}


 validateForm() {

      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
    
     
   
  
   

   

         if (!fields["update_price"]) {
        formIsValid = false;
        errors["update_price"] = "*Please Enter Price.";
      }else{
        if(parseInt(fields["update_price"]) < parseInt(this.state.base_price)){
          formIsValid = false;
        errors["update_price"] = "*Please Enter Higher Bid Price of base price.";
        }
      }

      if (typeof fields["update_price"] !== "undefined") {
        if (!fields["update_price"].match(/^\d+(\.\d{1,2})?$/)) {
        formIsValid = false;
        errors["update_price"] = "*Please Enter Numeric Value Price.";
      }
    }
     

         
    

      this.setState({
        errors: errors
      });

      
      return formIsValid;


    }




    


handleChangeStatus = (itemId,status) => {


confirmAlert({
      title: 'Are You sure ?',
      message: 'You want change the status?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.changestatus(itemId,status)
        },
        {
          label: 'No'
          
        }
      ]
    });


   
    };
    
  changestatus(itemId,status){
     const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}

  axios.post(`${Auth.getapiurl()}/CampaignChangeStatus`,
  {
    itemId: itemId,
    status:status
  },
  {
    headers: headers
  }).then(res => {

   if(res.data.status==1){     
   Auth.toastmsg(res.data.message,'S')  
 }else{
  Auth.toastmsg(res.data.message,'E') 
 }   
  this.getAllCampaignlist(1,Auth.Itemperpagecount());




    
    });
  }

  handlePageChange(pageNumber) {
    const perpage = Auth.Itemperpagecount();
    if(this.state.stype == 1)
    {
      this.getsearch(pageNumber,perpage);
    }else{
      this.getusers(pageNumber,perpage);
    }
    
    this.setState({activePage: pageNumber});
   }
  
  getAllCampaignlist(pageNumber,perpage)
  {

    const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}


    axios.post(`${Auth.getapiurl()}/getAllCampaignlist`, { 
    pageNumber:pageNumber,
    perpage: perpage
  },
  {
    headers: headers
  })
        .then(res => {
         
        this.setState({ loaded: true }); 
        const persons = res.data.responsedata.results;
  
        const TotalRecords = res.data.responsedata.Records;
        this.setState({ persons });
        this.setState({ TotalRecords });
        })
    
  }
  
  
  
  
    
  onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }
  
  addnewhandleclick() {
    
    this.props.history.push('/useradd');
  }
  

  

      


 getsearch = (pageNumber,perpage) => {
       axios.post(`${Auth.getapiurl()}/admin/getSearchCampaignlist`, { 
     session:Auth.getToken(), 
     search : this.state.search,
     pageNumber:pageNumber,
     perpage:perpage })
        .then(res => {
        
        
        if(res.data.status == '203'){
          this.setState({ status_msg:res.data.error });
          this.setState({ status:res.data.status });
        }else{
          const persons = res.data.results;
          const TotalRecords = res.data.Records;
          this.setState({ persons });
          this.setState({ TotalRecords });
          this.setState({ status:'204' });
          this.setState({ stype:1 });
        }
                
        })
  }
    

handlesearchChange = (event: React.KeyboardEvent<HTMLDivElement>): void => {
if (event.key === 'Enter') {  
    this.setState({
      search: event.target.value
    }, () => {
      if (this.state.search && this.state.search.length > 1) {
        //if (this.state.search.length % 2 === 0) {
          this.getsearch(1,Auth.Itemperpagecount())
        //}
      }else{
        this.setState({ status:'204' });
        this.getusers(1,Auth.Itemperpagecount());
      } 
    })
  }
}


  renderAlert() {

    if (this.state.errorMessage && this.state.status == '0') {



      return (
        <div className="row">
        <div className="col-md-12">
        <div className="alert alert-danger">
          <strong>!Opps, </strong>{ this.state.errorMessage }
        </div></div></div>

      );
    }else if(this.state.status == '1'){
      return (
        <div className="row">
        <div className="col-md-12">
        <div className="alert alert-success">
          <strong>Success, </strong>{ this.state.errorMessage }
        </div></div></div>
      );
    }





  }
  
  render() {
    
    const { open } = this.state;


    let paginate;
    if(this.state.TotalRecords > Auth.Itemperpagecount()) 
     {
       paginate = <Pagination
        prevPageText='Previous'
        nextPageText='Next'
        firstPageText='First'
        lastPageText='Last'
        activePage={this.state.activePage}
        itemsCountPerPage={Auth.Itemperpagecount()}
        totalItemsCount={this.state.TotalRecords}
        pageRangeDisplayed={10}
        onChange={this.handlePageChange}
      />                    
        
     }      
    
    
    
    
    
   if (!Auth.getToken()) {
     
     return <Redirect to="/login" />;
     }   
  
  const status = this.state.status;
  const status_msg = this.state.status_msg;
  let table;
  if(status == '203') {

       table = <div className="col-md-12">
                                           <table className="table table-bordered table-striped" id="example2">
                       <thead className="thead-dark">
                       <tr>
                       <td>Campaign Id</td>
                       <td>Name</td>
                       <td>Lead type Status</td>
                       <td>Generation Type</td>
                       <td>Buyer Bid</td>
                       <td>Action</td>
                       
                       </tr>
                       </thead>
                       
                      
                       <tbody>
                       <tr>
                       <td>{status_msg}</td>
                       </tr>
                       </tbody>
                       </table>
                      </div>;   
      
    }else{  

      

      table =<div className="col-md-12">
                                           <table className="table table-bordered table-striped" id="example2">
                       <thead className="thead-dark">
                       <tr>
                       <td>Campaign Id</td>
                       <td>Name</td>
                       <td>Lead type Status</td>
                       <td>Generation Type</td>
                       <td>Buyer Bid</td>
                       <td>Action</td>
                       
                       </tr>
                       </thead>
                       
                       
                      
                       <tbody>
                       {this.state.persons.map(item =>
                                             <tr key={item.buyer_lead_type_id}>
                      
                       <td>{item.buyer_lead_type_id}</td> 
                       <td>{item.lead_type_name}</td>
                       <td>
                       <span className={item.status == 'Draft' ? "btn btn-info btn-lg"  : item.status == 'Inactive' ? "btn btn-danger btn-lg" : "btn btn-success btn-lg" }>
                        {item.status == 'Draft' ? <i class="fa fa-file" aria-hidden="true"></i>  : item.status == 'Inactive' ? <i class="fa fa-times" aria-hidden="true"></i> : <i class="fa fa-check" aria-hidden="true"></i> }
                       </span>

                        {item.status == 'Draft' || item.status == 'Inactive' ?
                        <span className="btn btn-default btn-lg" 
                        onClick={()=>this.handleChangeStatus(item.buyer_lead_type_id,'Active')}>Active</span> : <span className="btn btn-default btn-lg" onClick={()=>this.handleChangeStatus(item.buyer_lead_type_id,'Inactive')}>Inactive</span> }


                       </td>
                       <td>{item.Sys_lead_quality_type}</td>
                       <td>{item.min_price_asked} <span className="btn btn-default btn-lg" 
                        onClick={()=>this.onOpenModal(item.buyer_lead_type_id,item.base_price,item.min_price_asked,item.lead_type_name,item.Sys_lead_quality_type)}><i className="fa fa-edit"></i> Price</span></td>
                       
                      
                       
                       <td>
                      
                      
                      
                      <Link to={'/filter/'+item.buyer_lead_type_id} className="btn bg-navy">Filter</Link>
                      <Link to={'/daywisecap/'+item.buyer_lead_type_id} className="btn bg-orange">Day Wise Cap</Link>
                      
                      
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
                                    <div className="col-md-12"><h3 className="box-title">Campaign</h3>
                                       <div className="pull-right">
                    
                     <Link to='/campaignadd' className="btn btn-info"><i className="fa fa-plus"></i></Link>
                    </div>
                                    </div>
                  
                  </div>
                                
                                <div className="box-body">
                                    <div className="row">
                                        {table}
                    {paginate}
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

export default withRouter(Reportbycampaign);