import React, { Component } from 'react';
import store from 'store';

import axios from 'axios';
import Header from '../Header';
import { Redirect, Link, withRouter } from 'react-router-dom';
//import Pagination from '../component/Pagination';
import Auth from '../modules/Auth';
import Loader from 'react-loader';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

class Campaignlist extends Component {



  constructor(props) {
    super(props);
    //var exampleItems = [...Array(10).keys()].map(i => ({ id: (i+1), name: 'Item ' + (i+1) }));
    this.addnewhandleclick = this.addnewhandleclick.bind(this);




    this.state = {
      fields: [{
        update_price: '',
      }],
      itemId: '',
      price: '',
      label: '',
      quality_type: '',
      base_price: '',
      errors: {},
      pageOfItems: [],
      campaignData: [],
      open: false,
      open_status: false,
      open_displayname: false,
      search: '',
      status_msg: '',
      loaded: false,
      errorMessage: '',
      status: '',
      new_status: '',
      activePage: 1,
      TotalRecords: Auth.Itemperpagecount(),
      stype: '',
      type: 'All',
      prstatus: '',
      load_spinner: false,
      display_name:''

    };

    this.getAllCampaignlist(1, Auth.Itemperpagecount(), 'All');
    this.handlePageChange = this.handlePageChange.bind(this);

    this.getAllCampaignlist = this.getAllCampaignlist.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.changestatus = this.changestatus.bind(this);
    this.changeprice = this.changeprice.bind(this);
    this.pricechange = this.pricechange.bind(this);
    this.fieldchange = this.fieldchange.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.handleChangedisplayname = this.handleChangedisplayname.bind(this);
    this.changeDisplayName = this.changeDisplayName.bind(this);
    


  }

  handleChangedisplayname(e){
    var display_name = e.target.value;
    
    this.setState({
      display_name
    });
  }
  changeStatus(e) {


    var new_status = e.target.value;

    this.setState({
      new_status
    });

  }


  onOpenModal = (itemId, base_price, price, label, quality_type) => {
    this.setState({ open: true });
    this.setState({ itemId: itemId });
    this.setState({ price: price });
    this.setState({ base_price: base_price });
    this.setState({ label: label });
    this.setState({ quality_type: quality_type });


  };

  onOpenModal_status = (itemId, status) => {
    this.setState({ open_status: true });
    this.setState({ itemId: itemId });
    this.setState({ new_status: status });

  };

  onOpenModal_displayname = (itemId, value) => {
    this.setState({ open_displayname: true });
    this.setState({ itemId: itemId });
    this.setState({ display_name: value });

  };

  onCloseModal_displayname = () => {
    this.setState({ open_displayname: false });
    this.setState({ itemId: '' });
    this.setState({ display_name: '' });


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

  onCloseModal_status = () => {
    this.setState({ open_status: false });
    this.setState({ itemId: '' });
    this.setState({ new_status: '' });


  };




  pricechange(e) {

    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;

    this.setState({
      fields
    });

  }


  changeprice(itemId) {

    if (this.validateForm()) {

      const headers = {
        'Content-Type': 'application/json',
        'Authkey': Auth.Authkey(),
        'session': Auth.getToken()
      }

      axios.post(`${Auth.getapiurl()}/Updateprice`,
        {
          itemId: itemId,
          price: this.state.fields.update_price
        },
        {
          headers: headers
        }).then(res => {

          //const  errorMessage =res.data.message;

          //this.setState({errorMessage});
          const status = res.data.status;

          this.setState({ prstatus: status });

          if (res.data.status == 1) {
            Auth.toastmsg(res.data.message, 'S')
          } else {
            Auth.toastmsg(res.data.message, 'E')
          }

          setTimeout(() => {
            this.setState({
              errorMessage: '',
              status: ''
            });

            this.setState({ open: false });
            this.getAllCampaignlist(1, Auth.Itemperpagecount(), 'All');

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
    } else {
      if (parseInt(fields["update_price"]) < parseInt(this.state.base_price)) {
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







  handleChangeStatus = (itemId, status) => {


    confirmAlert({
      title: 'Are You sure ?',
      message: 'You want change the status?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.changestatus(itemId, status)
        },
        {
          label: 'No'

        }
      ]
    });



  };

  changestatus(itemId, status) {

    this.setState({ load_spinner: true });
    const headers = {
      'Content-Type': 'application/json',
      'Authkey': Auth.Authkey(),
      'session': Auth.getToken()
    }

    axios.post(`${Auth.getapiurl()}/CampaignChangeStatus`,
      {
        itemId: itemId,
        status: status
      },
      {
        headers: headers
      }).then(res => {
        this.setState({ load_spinner: false });

        if (res.data.status == 1) {
          Auth.toastmsg(res.data.message, 'S')
        } else {
          Auth.toastmsg(res.data.message, 'E')
        }
        this.getAllCampaignlist(1, Auth.Itemperpagecount(), this.state.type);


        this.setState({ open_status: false });



      });
  }


  changeDisplayName(itemId, display_name) {

    this.setState({ load_spinner: true });
    const headers = {
      'Content-Type': 'application/json',
      'Authkey': Auth.Authkey(),
      'session': Auth.getToken()
    }

    axios.post(`${Auth.getapiurl()}/CampaignChangeDisplayname`,
      {
        itemId: itemId,
        display_name: display_name
      },
      {
        headers: headers
      }).then(res => {
        this.setState({ load_spinner: false });

        if (res.data.status == 1) {
          Auth.toastmsg(res.data.message, 'S')
        } else {
          Auth.toastmsg(res.data.message, 'E')
        }
        this.getAllCampaignlist(1, Auth.Itemperpagecount(), this.state.type);


        this.setState({ open_displayname: false });



      });
  }

  handlePageChange(pageNumber) {
    const perpage = Auth.Itemperpagecount();
    if (this.state.stype == 1) {
      this.getsearch(pageNumber, perpage);
    } else {
      this.getusers(pageNumber, perpage);
    }

    this.setState({ activePage: pageNumber });
  }

  getAllCampaignlist(pageNumber, perpage, type) {



    const headers = {
      'Content-Type': 'application/json',
      'Authkey': Auth.Authkey(),
      'session': Auth.getToken()
    }


    axios.post(`${Auth.getapiurl()}/getAllCampaignlist`, {
      pageNumber: pageNumber,
      perpage: perpage,
      type: type
    },
      {
        headers: headers
      })
      .then(res => {

        this.setState({ loaded: true });
        this.setState({ status: res.data.status });
        this.setState({ status_msg: res.data.message });

        if (res.data.status == 1) {
          const campaignData = res.data.responsedata.results;

          const TotalRecords = res.data.responsedata.Records;
          this.setState({ campaignData });
          this.setState({ TotalRecords });
        }


      })

  }





  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  }

  addnewhandleclick() {

    this.props.history.push('/useradd');
  }







  getsearch = (pageNumber, perpage) => {
    axios.post(`${Auth.getapiurl()}/admin/getSearchCampaignlist`, {
      session: Auth.getToken(),
      search: this.state.search,
      pageNumber: pageNumber,
      perpage: perpage
    })
      .then(res => {


        if (res.data.status == '203') {
          this.setState({ status_msg: res.data.error });
          this.setState({ status: res.data.status });
        } else {
          const campaignData = res.data.results;
          const TotalRecords = res.data.Records;
          this.setState({ campaignData });
          this.setState({ TotalRecords });
          this.setState({ status: '204' });
          this.setState({ stype: 1 });
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
          this.getsearch(1, Auth.Itemperpagecount())
          //}
        } else {
          this.setState({ status: '204' });
          this.getusers(1, Auth.Itemperpagecount());
        }
      })
    }
  }





  fieldchange(e) {


    this.setState({
      type: e.target.value
    });



    this.getAllCampaignlist(1, Auth.Itemperpagecount(), e.target.value);

  }

  render() {

    const products = this.state.campaignData;
    const columns = [{
      dataField: 'buyer_lead_type_id',
      text: 'Campaign Id',
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: '75px', textAlign: 'center' };
      }
    }, {
      dataField: 'lead_type_name',
      text: 'Line of Business',
      headerStyle: (colum, colIndex) => {
        return { width: '90px', textAlign: 'center' };
      },
      formatter: (cell, item) => {
        return <>{item.lead_type_name}
        </>
      }
    },{
      dataField: 'lead_type_name',
      text: 'Campaign Name',
      headerStyle: (colum, colIndex) => {
        return { width: '200px', textAlign: 'center' };
      },
      formatter: (cell, item) => {
        return <> <b><span className="text-danger">[{item.display_name}]</span>
          <span className="btn btn-default btn-lg"
            onClick={() => this.onOpenModal_displayname(item.buyer_lead_type_id, item.display_name)} data-toggle="tooltip" title="Change Display Name"><i className="fa fa-edit"></i></span></b>
        </>
      }
    },    
    {
      dataField: 'product',
      text: 'Product',
      headerStyle: (colum, colIndex) => {
        return { width: '60px', textAlign: 'center' };
      }
    }, {
      dataField: 'status',
      text: 'Status',
      headerStyle: (colum, colIndex) => {
        return { width: '170px', textAlign: 'center' };
      },
      formatter: (cell, item) => {
        return <>{
          item.status == 'Draft' ?
            <div>
              <span className="btn btn-info btn-lg" data-toggle="tooltip" title={item.status}><i class="fa fa-file" aria-hidden="true"></i></span>

              <span className="btn btn-default btn-lg"



                onClick={() => this.onOpenModal_status(item.buyer_lead_type_id, 'Draft')}>Change Status</span>
            </div>
            : ''}

          {
            item.status == 'Inactive' ?
              <div>

                <span className="btn btn-danger btn-lg" data-toggle="tooltip" title={item.status}>
                  <i class="fa fa-times" aria-hidden="true"></i>
                </span>

                <span className="btn btn-default btn-lg"
                  onClick={() => this.handleChangeStatus(item.buyer_lead_type_id, 'Active')}>
                  Inactive
                </span>

              </div>
              : ''}


          {
            item.status == 'Archived' ?
              <div>

                <span className="btn btn-default btn-lg" data-toggle="tooltip" title={item.status}>
                  <i class="fa fa-archive" aria-hidden="true"></i>
                </span>

                <span className="btn btn-default btn-lg">Archived</span>

              </div>
              : ''}

          {
            item.status == 'Active' ?
              <div>

                <span className="btn btn-success btn-lg" data-toggle="tooltip" title={item.status}>
                  <i class="fa fa-check" aria-hidden="true"></i>
                </span>

                <span className="btn btn-default btn-lg" onClick={() => this.handleChangeStatus(item.buyer_lead_type_id, 'Inactive')}>Active</span>

              </div>
              : ''}


          {
            item.status == 'RequestActivation' ?
              <div>

                <span className="btn btn-default btn-lg" data-toggle="tooltip" title="Request Activation">
                  <i class="fa fa-cog fa-spin" aria-hidden="true"></i>
                </span>

                <span className="btn btn-default btn-lg">Request Activation</span>

              </div>
              : ''}


          {
            item.status == 'ReadytoGoLive' ?
              <div>

                <span className="btn btn-success btn-lg" data-toggle="tooltip" title="Ready to Go Live">
                  <i class="fa fa-cog fa-spin" aria-hidden="true"></i>
                </span>

                <span className="btn btn-default btn-lg">Ready to Go Live</span>

              </div>
              : ''} </>
      }
    }, {
      dataField: 'Sys_lead_quality_type',
      text: 'Media Channel'
    }, {
      dataField: 'min_price_asked',
      text: 'Bid Amount',
      headerStyle: (colum, colIndex) => {
        return { width: '120px', textAlign: 'center' };
      },
      formatter: (cell, row) => {
        return <>{ row.bid_type == 'Fixed' ? cell : ''}
        {row.status == 'Archived' ? "" : row.bid_type == 'Fixed' ? <span className="btn btn-default btn-lg"
          onClick={() => this.onOpenModal(row.buyer_lead_type_id, row.base_price, row.min_price_asked, row.lead_type_name, row.Sys_lead_quality_type)}><i className="fa fa-edit"></i> Price</span> : row.product == "Clicks" ? <Link to={'/dynamicprice/' + row.buyer_lead_type_id} className="btn bg-blue">Dynamic Price</Link> : '' }
          
          </>
      }
    }, {
      dataField: 'base_price',
      text: 'Avg Actual Price'
    }, {
      dataField: 'buyer_lead_type_id',
      text: 'Make a Change',
      headerStyle: (colum, colIndex) => {
        return { width: '220px', textAlign: 'center' };
      },
      formatter: (cell, row) => {
        return <>
        { row.auth_token ? <Link to={'/apispecs/' + cell +'/'+ row.auth_token +'/'+ row.display_name } className="btn bg-teal" target="blank">API</Link> : ''}
        {<Link to={'/daywisecap/' + cell} className="btn bg-orange">DOW Cap</Link>}
          {<Link to={'/filter/' + cell} className="btn bg-navy">Filter</Link>}
          {row.product == "Clicks" ?
            <Link to={'/campaignads/' + cell} className="btn bg-olive">Campaign</Link>
            : ""}
          
        </>
      }


    }];




    const paginationOption = {
      custom: true,
      sizePerPage: 100,
      alwaysShowAllBtns: true
    };


    const { open, open_status,open_displayname } = this.state;

    let select_status;

    select_status = <select className="form-control" onChange={this.fieldchange} name="type">
      <option value="All">-All-</option>
      <option value="Active">Active</option>
      <option value="Inactive">In-active</option>
      <option value="Draft">Draft</option>
      <option value="Archived">Archived</option>
      <option value="ReadytoGoLive">Ready to GoLive</option>
      <option value="RequestActivation">Request Activation</option>
      <option value="SaveCampaign">Save Campaign</option>

    </select>;







    if (!Auth.getToken()) {

      return <Redirect to="/login" />;
    }

    const status = this.state.status;
    const status_msg = this.state.status_msg;





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
                    <div className="col-md-12"><h3 className="box-title">Campaigns</h3>

                      <div className="pull-right">
                        <div className="col-md-6">
                          {select_status}
                        </div>
                        <div className="col-md-6">
                          <Link to='/campaignadd' className="btn btn-info"><i className="fa fa-plus"></i> Add Campaign</Link></div>
                      </div>
                    </div>

                  </div>

                  <div className="box-body">
                    <div className="row">

                      <div className="col-md-12 table-responsive">
                        <BootstrapTable
                          keyField='id'
                          data={products}
                          columns={columns}
                          pagination={paginationFactory(paginationOption)}
                          headerClasses="thead-dark" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>

        <Modal open={open} onClose={this.onCloseModal} center classNames={{
          overlay: 'customOverlay',
          modal: 'customModal modal-lg',
        }}>
          <div className='custom-ui'>


            <h3>Campaign Price Update for {this.state.label}</h3>
            <hr />
            <h4>Quality Type : {this.state.quality_type}</h4>
            <h4>Base Price : {this.state.base_price}</h4>
            <h4>Current Price : {this.state.price}</h4>
            <input type="text" name="update_price" className="form-control" placeholder="Price" onChange={this.pricechange} onKeyUp={this.pricechange} />
            <div className="errorMsg">{this.state.errors.update_price}</div>
            <div className="text-center">
              <button
                onClick={() => {
                  this.changeprice(this.state.itemId, this.state.price);

                }}
              >
                Update
        </button>
            </div>
          </div>
        </Modal>



        <Modal open={open_status} onClose={this.onCloseModal_status} center classNames={{
          overlay: 'customOverlay',
          modal: 'customModal modal-md',
        }}>
          <div className='custom-ui'>


            <h3>Change Campaign Status</h3>
            <hr />


            <select className="form-control" onChange={this.changeStatus} name="status" value={this.state.new_status}>

              <option value="Draft" >Save Campaign</option>
              <option value="ReadytoGoLive">Ready to GoLive</option>
              <option value="RequestActivation">Request Activation</option>

            </select>





            <div className="text-center">

              {this.state.load_spinner ?
                <button>
                  <i className="fa fa-spinner fa-spin"></i>
                </button>
                :

                <button
                  onClick={() => {

                    this.changestatus(this.state.itemId, this.state.new_status);

                  }}
                >
                  Update
        </button>

              }
            </div>
          </div>
        </Modal>




        <Modal open={open_displayname} onClose={this.onCloseModal_displayname} center classNames={{
          overlay: 'customOverlay',
          modal: 'customModal modal-md',
        }}>
          <div className='custom-ui'>


            <h3>Change Campaign Display Name</h3>
            <hr />


            

            <input type="text" className="form-control"  placeholder="Display Name"  value={this.state.display_name} onChange={this.handleChangedisplayname} onKeyUp={this.handleChangedisplayname} name="display_name" />





            <div className="text-center">

              {this.state.load_spinner ?
                <button>
                  <i className="fa fa-spinner fa-spin"></i>
                </button>
                :

                <button
                  onClick={() => {

                    this.changeDisplayName(this.state.itemId, this.state.display_name);

                  }}
                >
                  Update
        </button>

              }
            </div>
          </div>
        </Modal>


      </div>
    );
  }


}

export default withRouter(Campaignlist);