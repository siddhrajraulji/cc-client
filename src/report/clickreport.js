import React, { Component, useState } from "react";
import store from "store";
import axios from "axios";
import Header from "../Header";
import { Redirect, Link } from "react-router-dom";
import Auth from "../modules/Auth";
import Loader from "react-loader";
import NumberFormat from "react-number-format";
import Select from 'react-select';

import "react-datepicker/dist/react-datepicker.css";
import "./custom.css";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";

class ClickReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      errors: {},
      errorMessage: "",
      data: {},
      status: 0,
      timeframe: "",
      message: "Record not found",
      loaded: true,
      statevalue:""
    };

    this.fieldchange = this.fieldchange.bind(this);
    this.fieldchangeproduct = this.fieldchangeproduct.bind(this);

    this.fielddatechange = this.fielddatechange.bind(this);
    this.fieldpositionchange = this.fieldpositionchange.bind(this);

    this.submitForm = this.submitForm.bind(this);
    this.onValueStateChange = this.onValueStateChange.bind(this);
    this.getLOB = this.getLOB.bind(this);
  }
  componentDidMount() {
    this.getCampaign();
    this.getLOB();
  }

  getLOB = () => {
    const headers = {
      "Content-Type": "application/json",
      Authkey: Auth.Authkey(),
      session: Auth.getToken(),
    };

    axios
      .post(
        `${Auth.getapiurl()}/lineofbusiness`,
        {},
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res.data.status == 1) {
          this.setState({ loblist: res.data.responsedata });
        }
      });
  };

  onValueStateChange(event) {
    this.setState({
      report_type: event.target.value,
      data: [],
      status: 0,
    });
  }

  fieldchange(e) {
    this.setState({
      state_name: e.target.value,
    });
  }
  fieldpositionchange(e) {
    this.setState({
      position: e.target.value,
    });
  }
  fieldchangeproduct(e) {
    this.setState({
      selectedlob: e.target.value,
    });
  }

  fielddatechange(e) {
    this.setState({
      date: e.target.value,
    });
  }

  getCampaign() {
    const headers = {
      "Content-Type": "application/json",
      Authkey: Auth.Authkey(),
      session: Auth.getToken(),
    };

    axios
      .post(
        `${Auth.getapiurl()}/getCampaign`,
        {
          type: "Active",
        },
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res.data.status == 1) {
          const campaign = res.data.responsedata.results;
          this.setState({ campaign });
        }
      });
  }

  submitForm(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.setState({ loaded: false });
      const headers = {
        "Content-Type": "application/json",
        Authkey: Auth.Authkey(),
        session: Auth.getToken(),
      };
      let state = "";
      const  selectedstate = this.state.statevalue
      
      for(let i=0;i<selectedstate.length;i++){
        if(i==0){
          state = selectedstate[i].value;
        }
        else{
          state = state + "," + selectedstate[i].value;

        }
      }
      axios
        .post(
          `${Auth.getapiurl()}/getEstimate`,
          {
            lead_type_id: this.state.selectedlob,
            state:state,
            time_period: this.state.date,
            postion: this.state.position,
          },

          {
            headers: headers,
          }
        )
        .then((res) => {
          this.setState({ loaded: true });
          const status = res.data.status;
          this.setState({ status });

          if (res.data.status == 1) {
            let responsedata = res.data.responsedata;
            let data = [];

            data.push({
              id: 1,
              CTR: responsedata.CTR,
              BID_PRICE: responsedata.BID_PRICE,
              CPC: responsedata.CPC,
              CLICK_VOLUME: responsedata.CLICK_VOLUME,
              SEARCH_VOLUME: responsedata.SEARCH_VOLUME,
            });

            this.setState({
              data,
            });
          } else {
            Auth.toastmsg(res.data.message, "E");
            const message = res.data.message;
            this.setState({ message });
          }
        });
    }
  }

  validateForm() {
    let fields = this.state;
    let errors = {};
    let formIsValid = true;
 

    if (!fields["selectedlob"] || fields["selectedlob"] == "") {
      formIsValid = false;
      errors["selectedlob"] = "*Please Select LOB.";
    }

    
    // if (this.state.statevalue == "") {
    //   formIsValid = false;
    //   errors["state_name"] = "*Please Select State.";
    // }
    if (!fields["date"] || fields["date"] == "") {
      formIsValid = false;
      errors["date"] = "*Please Select Time Frame.";
    }
    if (!fields["position"] || fields["position"] == "") {
      formIsValid = false;
      errors["position"] = "*Please Select Position";
    }
    this.setState({
      errors: errors,
    });
    return formIsValid;
  }
  render() {
    const options = [
      { value: "chocolate", label: "Chocolate" },
      { value: "strawberry", label: "Strawberry" },
      { value: "vanilla", label: "Vanilla" },
    ];

    var statelist = [
      // { name: "-All State-", abbreviation: "All" },

      { name: "ALABAMA", abbreviation: "AL" },
      { name: "ALASKA", abbreviation: "AK" },
      { name: "AMERICAN SAMOA", abbreviation: "AS" },
      { name: "ARIZONA", abbreviation: "AZ" },
      { name: "ARKANSAS", abbreviation: "AR" },
      { name: "CALIFORNIA", abbreviation: "CA" },
      { name: "COLORADO", abbreviation: "CO" },
      { name: "CONNECTICUT", abbreviation: "CT" },
      { name: "DELAWARE", abbreviation: "DE" },
      { name: "DISTRICT OF COLUMBIA", abbreviation: "DC" },
      { name: "FEDERATED STATES OF MICRONESIA", abbreviation: "FM" },
      { name: "FLORIDA", abbreviation: "FL" },
      { name: "GEORGIA", abbreviation: "GA" },
      { name: "GUAM", abbreviation: "GU" },
      { name: "HAWAII", abbreviation: "HI" },
      { name: "IDAHO", abbreviation: "ID" },
      { name: "ILLINOIS", abbreviation: "IL" },
      { name: "INDIANA", abbreviation: "IN" },
      { name: "IOWA", abbreviation: "IA" },
      { name: "KANSAS", abbreviation: "KS" },
      { name: "KENTUCKY", abbreviation: "KY" },
      { name: "LOUISIANA", abbreviation: "LA" },
      { name: "MAINE", abbreviation: "ME" },
      { name: "MARSHALL ISLANDS", abbreviation: "MH" },
      { name: "MARYLAND", abbreviation: "MD" },
      { name: "MASSACHUSETTS", abbreviation: "MA" },
      { name: "MICHIGAN", abbreviation: "MI" },
      { name: "MINNESOTA", abbreviation: "MN" },
      { name: "MISSISSIPPI", abbreviation: "MS" },
      { name: "MISSOURI", abbreviation: "MO" },
      { name: "MONTANA", abbreviation: "MT" },
      { name: "NEBRASKA", abbreviation: "NE" },
      { name: "NEVADA", abbreviation: "NV" },
      { name: "NEW HAMPSHIRE", abbreviation: "NH" },
      { name: "NEW JERSEY", abbreviation: "NJ" },
      { name: "NEW MEXICO", abbreviation: "NM" },
      { name: "NEW YORK", abbreviation: "NY" },
      { name: "NORTH CAROLINA", abbreviation: "NC" },
      { name: "NORTH DAKOTA", abbreviation: "ND" },
      { name: "NORTHERN MARIANA ISLANDS", abbreviation: "MP" },
      { name: "OHIO", abbreviation: "OH" },
      { name: "OKLAHOMA", abbreviation: "OK" },
      { name: "OREGON", abbreviation: "OR" },
      { name: "PALAU", abbreviation: "PW" },
      { name: "PENNSYLVANIA", abbreviation: "PA" },
      { name: "PUERTO RICO", abbreviation: "PR" },
      { name: "RHODE ISLAND", abbreviation: "RI" },
      { name: "SOUTH CAROLINA", abbreviation: "SC" },
      { name: "SOUTH DAKOTA", abbreviation: "SD" },
      { name: "TENNESSEE", abbreviation: "TN" },
      { name: "TEXAS", abbreviation: "TX" },
      { name: "UTAH", abbreviation: "UT" },
      { name: "VERMONT", abbreviation: "VT" },
      { name: "VIRGIN ISLANDS", abbreviation: "VI" },
      { name: "VIRGINIA", abbreviation: "VA" },
      { name: "WASHINGTON", abbreviation: "WA" },
      { name: "WEST VIRGINIA", abbreviation: "WV" },
      { name: "WISCONSIN", abbreviation: "WI" },
      { name: "WYOMING", abbreviation: "WY" },
    ];
    const option = []
    for(let i=0;i<statelist.length;i++){
      let obj = {
        label:statelist[i].name,
        value:statelist[i].abbreviation
      }
      option.push(obj)
    }
    const { ExportCSVButton } = CSVExport;

    const paginationOption = {
      custom: true,
      sizePerPage: 100,
      alwaysShowAllBtns: true,
    };
    const fields = this.state.fields;

    if (!Auth.getToken()) {
      return <Redirect to="/login" />;
    }

    let table;
    let exceltable;
    if (this.state.status == 0) {
      table = <div className="col-md-12"></div>;
    } else {
      const columns = [
        {
          dataField: "BID_PRICE",
          text: "Estimated Bid Price",
          headerStyle: (colum, colIndex) => {
            return { textAlign: "center" };
          },
          style: { textAlign: "center" },
          formatter: (cell, item) => {
            return (
              <>
                {
                  <NumberFormat
                    value={item.BID_PRICE}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                }
              </>
            );
          },
          //    sort: true
        },
        {
          dataField: "CPC",
          text: "Estimated Actual CPC",
          headerStyle: (colum, colIndex) => {
            return { textAlign: "center" };
          },
          style: { textAlign: "center" },
          formatter: (cell, item) => {
            return (
              <>
                {
                  <NumberFormat
                    value={item.CPC}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                }
              </>
            );
          },
        },
        {
          dataField: "CTR",
          text: "Estimated CTR",
          headerStyle: (colum, colIndex) => {
            return { textAlign: "center" };
          },
          style: { textAlign: "center" },

          //   sort: true
        },
        {
          dataField: "CLICK_VOLUME",
          text: "Estimated Click Volume",
          headerStyle: (colum, colIndex) => {
            return { textAlign: "center" };
          },
          style: { textAlign: "center" },
          // sort: true
        },
      ];
      table = (
        <div>
          <BootstrapTable
            headerClasses="thead-dark"
            footerClasses="thead-dark"
            wrapperClasses="table-responsive"
            striped
            bootstrap4
            keyField="id"
            data={this.state.data}
            columns={columns}
            pagination={paginationFactory(paginationOption)}
          />
        </div>
      );
    }
    let select_campaign;

    select_campaign = (
      // <select
      //   className="form-control"
      //   onChange={this.fieldchange}
      //   name="campaign_name"
      //   disabled={this.state.disabled}
      // >
      //   <option value="">-Select State-</option>

      //   <option value="All">All States</option>
      //   {statelist.map((state) => (
      //     <option value={state.abbreviation}>{state.name}</option>
      //   ))}
      // </select>
      <Select
      value = {this.state.statevalue}
      isMulti
      options = {option}
      placeholder="-Select All-"
      onChange = {(current_value)=>{
       
          this.setState({
            statevalue:current_value
          })

       
       
      }}
      ></Select>
    );

    let select_product;

    select_product = (
      <select
        className="form-control"
        onChange={this.fieldchangeproduct}
        name="product"
      >
        <option value="">-Select LOB-</option>
        {/* {this.state.loblist.map(loblist=>(
            <option value="Calls">{loblist.lead_type_name}</option>
        ))} */}
        <option value="1">Auto insurance</option>
        <option value="2">Life insurance</option>
        <option value="3">Health insurance (U65)</option>
        <option value="4">Home insurance</option>
        <option value="10">Medicare insurance</option>
      </select>
    );

    return (
      <div>
        <Loader loaded={this.state.loaded}></Loader>
        <div>
          <Header />
        </div>
        <div className="content-wrapper">
          <section className="content">
            <div className="row">
              <div className="col-md-12 text-center"></div>

              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header with-border">
                    <h3 className="box-title">Estimated Bidding Report</h3>
                  </div>

                  <form
                    className="has-validation-callback"
                    onSubmit={this.submitForm}
                  >
                    <div className="box-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Select LOB: <span className="red">*</span>
                            </label>

                            {select_product}

                            <div className="errorMsg">
                              {this.state.errors.selectedlob}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              States:
                            </label>

                            {select_campaign}

                            <div className="errorMsg">
                              {this.state.errors.state_name}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Time Frame: <span className="red">*</span>
                            </label>

                            <select
                              name="timeframe"
                              className="form-control"
                              onChange={this.fielddatechange}
                            >
                              {/* <option value="today">Select</option> */}
                              <option value="">-Select Time Frame-</option>

                              <option value="7">Last 7 Days</option>
                              <option value="14">Last 14 Days</option>
                              <option value="30">Last 30 Days</option>
                            </select>
                            <div className="errorMsg">
                              {this.state.errors.date}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Position: <span className="red">*</span>{" "}
                            </label>

                            <select
                              name="position"
                              className="form-control"
                              onChange={this.fieldpositionchange}
                            >
                              {/* <option value="g">Select Position</option> */}
                              <option value="">-Select Position-</option>

                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                            </select>
                            <div className="errorMsg">
                              {this.state.errors.position}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="box-footer text-center col-md-5"></div>
                      <div className="box-footer text-center col-md-2">
                        <button type="submit" className="btn btn-info leftside">
                          <i className="fa fa-send"></i> Generate
                        </button>
                      </div>
                      <div className="box-footer text-center col-md-5"></div>
                    </div>

                    <div className="row">
                      <div className="col-md-12">{table}</div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default ClickReport;
