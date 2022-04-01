import React, { Component, useState } from "react";
import store from "store";
import axios from "axios";
import Header from "../Header";
import { Redirect, Link } from "react-router-dom";
import Auth from "../modules/Auth";

import { Multiselect } from "multiselect-react-dropdown";
import DatePicker from "react-datepicker";
import moment from "moment"; 
import Loader from "react-loader";
import NumberFormat from "react-number-format";
import "react-datepicker/dist/react-datepicker.css";
import "./custom.css";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      totalresults: {},
      errors: {},
      campaign: [],
      errorMessage: "",
      startDate: "",
      endDate: "",
      campaign_name: "All",
      product: "",
      data: [],
      exceldata:[],
      Detaildata: [],
      status: 0,
      timeframe: "",
      message: "Record not found",
      loaded: true,
      disabled: false,
      detail_id: "",
      report_type:"summary"

    };

    this.fieldchange = this.fieldchange.bind(this);
    this.fieldchangeproduct = this.fieldchangeproduct.bind(this);

    this.handleChangestart = this.handleChangestart.bind(this);
    this.handleChangeend = this.handleChangeend.bind(this);
    this.fielddatechange = this.fielddatechange.bind(this);

    this.submitForm = this.submitForm.bind(this);
    this.getDetailData = this.getDetailData.bind(this);
    this.onValueStateChange = this.onValueStateChange.bind(this);
  }
  componentDidMount() {
    this.getCampaign();
  }

  onValueStateChange(event) {
   
    
    this.setState({
      report_type:event.target.value,
      data:[],
      status: 0
    });
  }

  fieldchange(e) {
    this.setState({
      campaign_name: e.target.value,
      data: [],
      status: 0,
    });
  }
  fieldchangeproduct(e) {
    const disabled = e.target.value == "All" ? true : false;

    this.setState({
      product: e.target.value,
      data: [],
      status: 0,
      disabled: disabled,
    });
  }

  fielddatechange(e) {
    var timeframe = e.target.value;

    Auth.fielddatechange(timeframe);

    var formdate = store.get("fromdate");
    var todate = store.get("todate");
    formdate = new Date(formdate);
    todate = new Date(todate);

    this.setState({
      startDate: formdate,
      endDate: todate,
    });
  }

  handleChangestart = (date) => {
    this.setState({
      startDate: date,
    });
  };
  handleChangeend = (date) => {
    this.setState({
      endDate: date,
    });
  };

  getDetailData(detail_id, product) {
    const headers = {
      "Content-Type": "application/json",
      Authkey: Auth.Authkey(),
      session: Auth.getToken(),
    };

    axios
      .post(
        `${Auth.getapiurl()}/getBuyerAnalyticsDetail`,
        {
          campaign_id: detail_id,
          product: product,
          from_date: moment(new Date(this.state.startDate)).format(
            "YYYY-MM-DD"
          ),
          to_date: moment(new Date(this.state.endDate)).format("YYYY-MM-DD"),
        },
        {
          headers: headers,
        }
      )
      .then((res) => {
        this.setState({ detail_id });

        const status = res.data.status;
        this.setState({ status });

        if (res.data.status == 1) {
          const Detaildata = res.data.responsedata.results;

          this.setState({ Detaildata });

          var questionNodes = this.state.data.map((question, i) => {
            var stateCopy = Object.assign({}, this.state);

            if (stateCopy.data[i].id == detail_id) {
              stateCopy.data[i].detail = this.state.Detaildata;
              this.setState(stateCopy);
              console.log(this.state.data);
            }
          });
        } else {
          Auth.toastmsg(res.data.message, "E");
          const message = res.data.message;
          this.setState({ message });
        }
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

      axios
        .post(
          `${Auth.getapiurl()}/getBuyerAnalytics`,
          {
            product: this.state.product,
            campaign_id: this.state.campaign_name,
            from_date: moment(new Date(this.state.startDate)).format(
              "YYYY-MM-DD"
            ),
            to_date: moment(new Date(this.state.endDate)).format("YYYY-MM-DD"),
            report_type:this.state.report_type
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
            const data = res.data.responsedata.results;
            const totalresults = res.data.responsedata.totalresults;
            
            const exceldata = res.data.responsedata.excelresult;
            this.setState({ data });
            this.setState({ totalresults });
            this.setState({ exceldata });
            
          } else {
            Auth.toastmsg(res.data.message, "E");
            const message = res.data.message;
            this.setState({ message });
          }
        });

      this.setState({
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      });
    }
  }

  validateForm() {
    let fields = this.state;
    let errors = {};
    let formIsValid = true;

    if (!fields["product"]) {
      formIsValid = false;
      errors["product"] = "*Please Select Product.";
    }

    if (!fields["campaign_name"]) {
      formIsValid = false;
      errors["campaign_name"] = "*Please Select campaign.";
    }

    if (!fields["startDate"]) {
      formIsValid = false;
      errors["startDate"] = "*Please Select Start Date.";
    }

    if (!fields["endDate"]) {
      formIsValid = false;
      errors["endDate"] = "*Please Select End Date.";
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  render() {
    const { ExportCSVButton } = CSVExport;

    const paginationOption = {
      custom: false,
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
      if (this.state.product === "Leads") {
        const products = this.state.data;
        const columns = [{
          dataField: 'report_date',
          text: 'Date',
          hidden:this.state.report_type == "summary" ? true : false,
          footer: "",
            footerAlign: 'center',
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: 'center' }
        },
          {
            dataField: "product",
            text: "Product",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "80px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "lead_type_name",
            text: "L.O.B",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "150px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "leadquality",
            text: "Media Type",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "80px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "lead_type_name",
            text: "Campaign",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "165px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            formatter: (cell, item) => {
              return (
                <>
                  {item.product}-{item.lead_type_name}-{item.leadquality}
                </>
              );
            },
            footerFormatter: (cell, row, rowIndex) => `Total :`,
          },
          {
            dataField: "totalsold",
            text: "Total # of Actions",
            footer: "footer 3",
            footerAlign: "center",
            sort: true,
            headerStyle: (colum, colIndex) => {
              return { width: "150px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `${this.state.totalresults.totalsold}`,
          },
          {
            dataField: "soldamount",
            text: "Total Cost",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "120px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalsoldamount}`,
            formatter: (cell, item) => {
              return (
                <>
                  {
                    <NumberFormat
                      value={item.soldamount}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  }
                </>
              );
            },
            csvFormatter: (cell, row, rowIndex) => `$${row.soldamount}`,
          },
          {
            dataField: "avgCPL",
            text: "Avg CPL",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalavgCPL}`,
            formatter: (cell, item) => {
              return (
                <>
                  {
                    <NumberFormat
                      value={item.avgCPL}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  }
                </>
              );
            },
            csvFormatter: (cell, row, rowIndex) => `$${row.avgCPL}`,
          },
          {
            dataField: "WinRate",
            text: "Win Rate",
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footer: this.state.totalresults.totalWinRate,
            footerAlign: "center",
          },
        ];


        let detail_table;
        const { detail_id } = this.state;

        detail_table = (
          <div className="table table-striped table-responsive">
            {this.state.data
              .filter((item) => item.id == detail_id)
              .map((item) => (
                <div>
                  {item.detail.map(function (itemdetail, index) {
                    return (
                      <ul>
                        <li style={{ width: "583px" }}>
                          {itemdetail.date_report}
                        </li>

                        <li style={{ width: "152px" }}>{itemdetail.totalsold}</li>
                        <li style={{ width: "121px" }}>
                          ${itemdetail.soldamount}
                        </li>
                        <li style={{ width: "100px" }}>${itemdetail.avgCPL}</li>
                        <li style={{ width: "100px" }}>{itemdetail.WinRate}</li>
                        
                      </ul>
                    );
                  })}
                </div>
              ))}
          </div>
        );




        const expandRow = {
          className: "",
          renderer: (row) => <div>{detail_table}</div>,
          onlyOneExpanding: true,
          onExpand: (row, isExpand, rowIndex, e) => {
           
            if (isExpand == true) {
              this.getDetailData(row.id, row.product);
            }
          },
        };


        if(this.state.report_type == "detail"){
          exceltable = (<ExcelFile element={<button className="react-bs-table-csv-btn btn btn-default">Export Excel</button>} filename="Leads-detail">
                      <ExcelSheet data={this.state.exceldata} name="Leads">
  
                     
                    
                      <ExcelColumn label="Date" value="report_date"/>
                      <ExcelColumn label="Product" value="product" />                   
                     
                      
                      <ExcelColumn label="L.O.B" value="lead_type_name"/>
                      <ExcelColumn label="Media Type" value="leadquality"/>
                      <ExcelColumn label="Campaign"
                                   value="Campaign_code"/>
                      
                      <ExcelColumn label="Total # of Actions" value="totalsold"/>
                      <ExcelColumn label="Total Cost" value={(col) => "$"+col.soldamount}/>
                     
                      
                      
                      <ExcelColumn label="Avg CPL" value={(col) => "$"+col.avgCPL}/>
                      <ExcelColumn label="Win Rate" value={(col) => col.WinRate}/>
                                                       
                  </ExcelSheet>
     
              </ExcelFile> );
  
            }else{
              exceltable = (<ExcelFile element={<button className="react-bs-table-csv-btn btn btn-default">Export Excel</button>} filename="Leads-summary">
                      <ExcelSheet data={this.state.exceldata} name="Leads">
  
                      <ExcelColumn label="Product" value="product" />
                     
                      <ExcelColumn label="L.O.B" value="lead_type_name"/>
                      <ExcelColumn label="Media Type" value="leadquality"/>
                      <ExcelColumn label="Campaign"
                                   value="Campaign_code"/>
                     
                      <ExcelColumn label="Total # of Actions" value="totalsold"/>
                      <ExcelColumn label="Total Cost" value={(col) => "$"+col.soldamount}/>
                     
                      
                      
                      <ExcelColumn label="Avg CPL" value={(col) => "$"+col.avgCPL}/>
                      <ExcelColumn label="Win Rate" value={(col) => col.WinRate}/>
                    
                                                       
                  </ExcelSheet>
     
              </ExcelFile> );
          }



        table = (
          <div className="col-md-12">
            <ToolkitProvider
              keyField="id"
              data={products}
              columns={columns}
              exportCSV={{
                ignoreFooter: false,
                fileName: this.state.product + ".csv",
              }}
            >
              {(props) => (
                <div>
                  <div className="text-right">
                    {exceltable}
                    <ExportCSVButton {...props.csvProps}>
                      Export CSV
                    </ExportCSVButton>
                  </div>
                  <hr />
                  <BootstrapTable
                  
                   keyField="id"
                    {...props.baseProps}
                    headerClasses="thead-dark"
                    footerClasses="thead-dark"
                    wrapperClasses="table-responsive"
                    striped
                   
                  />
                </div>
              )}
            </ToolkitProvider>
          </div>
        );
      } else if (this.state.product === "Clicks") {
        let detail_table;
        const { detail_id } = this.state;

        detail_table = (
          <div className="table table-striped table-responsive">
            {this.state.data
              .filter((item) => item.id == detail_id)
              .map((item) => (
                <div>
                  {item.detail.map(function (itemdetail, index) {
                    return (
                      <ul>
                        <li style={{ width: "484px" }}>
                          {itemdetail.date_report}
                        </li>

                        <li style={{ width: "152px" }}>{itemdetail.Clicks}</li>
                        <li style={{ width: "121px" }}>
                          ${itemdetail.Revenue}
                        </li>
                        <li style={{ width: "100px" }}>${itemdetail.CPC}</li>
                        <li style={{ width: "100px" }}>{itemdetail.CTR}</li>
                        <li style={{ width: "100px" }}>
                          {itemdetail.avgposcal}
                        </li>
                      </ul>
                    );
                  })}
                </div>
              ))}
          </div>
        );

        const products = this.state.data;
        const columns = [
          {
            dataField: 'report_date',
            text: 'Date',
            hidden:this.state.report_type == "summary" ? true : false,
            footer: "",
              footerAlign: 'center',
              headerStyle: (colum, colIndex) => {
                return { width: "100px", textAlign: "center" };
              },
              style: { textAlign: 'center' }
          },
          {
            dataField: "product",
            text: "Product",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "lead_type_name",
            text: "L.O.B",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "150px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "leadquality",
            text: "Media Type",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "88px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "Campaign_code",
            text: "Campaign",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "120px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            formatter: (cell, item) => {
              return (
                <>
                  {item.Campaign_code}
                </>
              );
            },
            footerFormatter: (cell, row, rowIndex) => `Total :`,
          },
          {
            dataField: "Clicks",
            text: "Total # of Actions",
            footer: "footer 3",
            footerAlign: "center",
            sort: true,
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `${this.state.totalresults.totalClicks}`,
          },
          {
            dataField: "soldamount",
            text: "Total Cost",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "120px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalRevenue}`,
            formatter: (cell, item) => {
              return (
                <>
                  {
                    <NumberFormat
                      value={item.Revenue}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  }
                </>
              );
            },
            csvFormatter: (cell, row, rowIndex) => `$${row.Revenue}`,
          },
          {
            dataField: "avgCPL",
            text: "Avg CPC",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalcpc}`,
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
            csvFormatter: (cell, row, rowIndex) => `$${row.CPC}`,
          },
          {
            dataField: "CTR",
            text: "CTR",
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footer: this.state.totalresults.totalctr,
            footerAlign: "center",
          },
          {
            dataField: "avgposcal",
            text: "Avg POS",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `${this.state.totalresults.totalpos}`,
            formatter: (cell, item) => {
              return <>{item.avgposcal}</>;
            },
            csvFormatter: (cell, row, rowIndex) => `$${row.avgposcal}`,
          },
        ];

        const expandRow = {
          className: "",
          renderer: (row) => <div>{detail_table}</div>,
          onlyOneExpanding: true,
          onExpand: (row, isExpand, rowIndex, e) => {
           
            if (isExpand == true) {
              this.getDetailData(row.id, row.product);
            }
          },
        };


        if(this.state.report_type == "detail"){
          exceltable = (<ExcelFile element={<button className="react-bs-table-csv-btn btn btn-default">Export Excel</button>} filename="Clicks-detail">
                      <ExcelSheet data={this.state.exceldata} name="Clicks">
  
                     
                    
                      <ExcelColumn label="Date" value="report_date"/>
                      <ExcelColumn label="Product" value="product" />                   
                     
                      
                      <ExcelColumn label="L.O.B" value="lead_type_name"/>
                      <ExcelColumn label="Media Type" value="leadquality"/>
                      <ExcelColumn label="Campaign"
                                   value="Campaign_code"/>
                      <ExcelColumn label="Total # of Actions" value="Clicks"/>
                      <ExcelColumn label="Total Cost" value={(col) => "$"+col.Revenue}/>
                     
                      
                      
                      <ExcelColumn label="Avg CPC" value={(col) => "$"+col.CPC}/>
                      <ExcelColumn label="CTR" value={(col) => col.CTR}/>
                      <ExcelColumn label="Avg POS" value="avgposcal"/>
                                                       
                  </ExcelSheet>
     
              </ExcelFile> );
  
            }else{
              exceltable = (<ExcelFile element={<button className="react-bs-table-csv-btn btn btn-default">Export Excel</button>} filename="Clicks-summary">
                      <ExcelSheet data={this.state.exceldata} name="Clicks">
  
                      <ExcelColumn label="Product" value="product" />
                     
                      <ExcelColumn label="L.O.B" value="lead_type_name"/>
                      <ExcelColumn label="Media Type" value="leadquality"/>
                      <ExcelColumn label="Campaign"
                                   value="Campaign_code"/>
                      <ExcelColumn label="Total # of Actions" value="Clicks"/>
                      <ExcelColumn label="Total Cost" value={(col) => "$"+col.Revenue}/>
                     
                      
                      
                      <ExcelColumn label="Avg CPC" value={(col) => "$"+col.CPC}/>
                      <ExcelColumn label="CTR" value={(col) => col.CTR}/>
                      <ExcelColumn label="Avg POS" value="avgposcal"/>
                                                       
                  </ExcelSheet>
     
              </ExcelFile> );
          }



        table = (
          <div className="col-md-12">
            <ToolkitProvider
              keyField="id"
              data={products}
              columns={columns}
              exportCSV={{
                ignoreFooter: false,
                fileName: this.state.product + ".csv",
              }}
            >
              {(props) => (
                <div>
                  <div className="text-right">
                    {exceltable}
                    <ExportCSVButton {...props.csvProps}>
                      Export CSV
                    </ExportCSVButton>
                  </div>
                  <hr />
                  <BootstrapTable
                    keyField="id"
                    {...props.baseProps}
                    headerClasses="thead-dark"
                    footerClasses="thead-dark"
                    wrapperClasses="table-responsive"
                    striped
                   
                  />
                </div>
              )}
            </ToolkitProvider>
          </div>
        );
      } else if (this.state.product === "All") {
        const products = this.state.data;
        const columns = [{
          dataField: 'report_date',
          text: 'Date',
          hidden:this.state.report_type == "summary" ? true : false,
          footer: "",
            footerAlign: 'center',
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: 'center' }
        },
          {
            dataField: "product",
            text: "Product",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "62px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "lead_type_name",
            text: "L.O.B",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "80px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "leadquality",
            text: "Media Type",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "Campaign_code",
            text: "Campaign",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "120px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            formatter: (cell, item) => {
              return (
                <>
                  {item.Campaign_code}
                </>
              );
            },
            footerFormatter: (cell, row, rowIndex) => `Total :`,
          },
          {
            dataField: "totalsold",
            text: "Total # of Actions Leads",
            footer: "footer 3",
            footerAlign: "center",
            sort: true,
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `${this.state.totalresults.totalsold}`,
          },
          {
            dataField: "avgCPL",
            text: "Avg CPL",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalavgCPL}`,
            formatter: (cell, item) => {
              return (
                <>
                  {
                    <NumberFormat
                      value={item.avgCPL}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  }
                </>
              );
            },
            csvFormatter: (cell, row, rowIndex) => `$${row.avgCPL}`,
          },
          {
            dataField: "WinRate",
            text: "Win Rate",
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footer: this.state.totalresults.totalWinRate,
            footerAlign: "center",
          },
          {
            dataField: "Clicks",
            text: "Total # of Actions Clicks",
            footer: "footer 3",
            footerAlign: "center",
            sort: true,
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `${this.state.totalresults.totalClicks}`,
          },
          {
            dataField: "avgCPL",
            text: "Avg CPC",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalcpc}`,
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
            csvFormatter: (cell, row, rowIndex) => `$${row.CPC}`,
          },
          {
            dataField: "avgposcal",
            text: "Avg Pos",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "50px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `${this.state.totalresults.totalpos}`,
            formatter: (cell, item) => {
              return <>{item.avgposcal}</>;
            },
            csvFormatter: (cell, row, rowIndex) => `${row.avgposcal}`,
          },

          {
            dataField: "CTR",
            text: "CTR",
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footer: this.state.totalresults.totalctr,
            footerAlign: "center",
          },

          {
            dataField: "totalbillable",
            text: "Total # of Actions Calls",
            footer: "footer 3",
            footerAlign: "center",
            sort: true,
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `${this.state.totalresults.totalbillable}`,
          },

          {
            dataField: "CPQC",
            text: "CPQC",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalCPQC}`,
            formatter: (cell, item) => {
              return (
                <>
                  {
                    <NumberFormat
                      value={item.CPQC}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  }
                </>
              );
            },
            csvFormatter: (cell, row, rowIndex) => `$${row.CPQC}`,
          },

          {
            dataField: "avgDuration",
            text: "Avg Duration",
            headerStyle: (colum, colIndex) => {
              return { width: "70px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footer: this.state.totalresults.totalcallLengthInSeconds,
            footerAlign: "center",
          },

          {
            dataField: "soldamount",
            text: "Total Cost",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalsoldamount}`,
            formatter: (cell, item) => {
              return (
                <>
                  {
                    <NumberFormat
                      value={item.soldamount}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  }
                </>
              );
            },
            csvFormatter: (cell, row, rowIndex) => `$${row.soldamount}`,
          },
        ];


        let detail_table;
        const { detail_id } = this.state;

        detail_table = (
          <div className="table table-striped table-responsive">
            {this.state.data
              .filter((item) => item.id == detail_id)
              .map((item) => (
                <div>
                  {item.detail.map(function (itemdetail, index) {
                    return (
                      <ul>
                        <li style={{ width: "362px" }}>
                          {itemdetail.date_report}
                        </li>

                        <li style={{ width: "60px" }}>{itemdetail.totalsold ? itemdetail.totalsold : "0"}</li>
                        <li style={{ width: "60px" }}>${itemdetail.avgCPL ? itemdetail.avgCPL : "0"}</li>
                        <li style={{ width: "60px" }}>{itemdetail.WinRate ? itemdetail.WinRate : "0%"}</li>
                        
                        <li style={{ width: "60px" }}>{itemdetail.Clicks ? itemdetail.Clicks : "0"}</li>
                        <li style={{ width: "60px" }}>${itemdetail.CPC ? itemdetail.CPC : "0"}</li>
                        <li style={{ width: "50px" }}>{itemdetail.avgposcal ? itemdetail.avgposcal : "0"}</li>
                        <li style={{ width: "60px" }}>{itemdetail.CTR ? itemdetail.CTR : "0%"}</li>
                        <li style={{ width: "60px" }}>{itemdetail.totalbillable ? itemdetail.totalbillable : "0"}</li>
                        <li style={{ width: "60px" }}>${itemdetail.CPQC ? itemdetail.CPQC : "0"}</li>
                        <li style={{ width: "70px" }}>{itemdetail.avgDuration ? itemdetail.avgDuration : "00:00:00"}</li>
                        {itemdetail.product =="Leads" ?
                        <li style={{ width: "96px" }}>${itemdetail.soldamount ? itemdetail.soldamount : "0"}</li>
                        : itemdetail.product =="Clicks" ?
                            <li style={{ width: "96px" }}>${itemdetail.Revenue ? itemdetail.Revenue : "0"}</li>
                          :
                          <li style={{ width: "96px" }}>${itemdetail.totalrevenue ? itemdetail.totalrevenue : "0"}</li>

                        }

                        
                        
                        
                        
                      </ul>
                    );
                  })}
                </div>
              ))}
          </div>
        );


        if(this.state.report_type == "detail"){
          exceltable = (<ExcelFile element={<button className="react-bs-table-csv-btn btn btn-default">Export Excel</button>} filename="All-product-detail">
                      <ExcelSheet data={this.state.exceldata} name="All Product">
  
                     
                    
                      <ExcelColumn label="Date" value="report_date"/>
                      <ExcelColumn label="Product" value="product" />                   
                     
                      
                      <ExcelColumn label="L.O.B" value="lead_type_name"/>
                      <ExcelColumn label="Media Type" value="leadquality"/>
                      <ExcelColumn label="Campaign"
                                   value="Campaign_code"/>
                      
                      <ExcelColumn label="Total # of Actions Leads" value="totalsold"  />
                      <ExcelColumn label="Avg CPL" value={(col) => "$"+col.avgCPL}/>
                      <ExcelColumn label="Win Rate" value={(col) => col.WinRate}/>

                     
                    
                      <ExcelColumn label="Total # of Actions Clicks" value="Clicks" numFmt="0"/>
                      <ExcelColumn label="Avg CPC" value={(col) => "$"+col.CPC}/>
                      <ExcelColumn label="Avg Pos" value={(col) => col.avgposcal}/>
                      <ExcelColumn label="CTR" value={(col) => col.CTR}/>


                      <ExcelColumn label="Total # of Actions Calls" value="totalbillable" numFmt="0"/>
                      <ExcelColumn label="CPQC" value={(col) => "$"+col.CPQC}/>
                      <ExcelColumn label="Avg Duration" value={(col) => col.avgDuration}/>
                      <ExcelColumn label=" Total Cost" value={(col) => "$"+col.soldamount}/>
                                                       
                  </ExcelSheet>
     
              </ExcelFile> );
  
            }else{
              exceltable = (<ExcelFile element={<button className="react-bs-table-csv-btn btn btn-default">Export Excel</button>} filename="All-product-summary">
                      <ExcelSheet data={this.state.exceldata} name="All Product">
  
                      <ExcelColumn label="Product" value="product" />
                     
                      <ExcelColumn label="L.O.B" value="lead_type_name"/>
                      <ExcelColumn label="Media Type" value="leadquality"/>
                      <ExcelColumn label="Campaign"
                                   value="Campaign_code"/>
                     
                     <ExcelColumn label="Total # of Actions Leads" value="totalsold"/>
                      <ExcelColumn label="Avg CPL" value={(col) => "$"+col.avgCPL}/>
                      <ExcelColumn label="Win Rate" value={(col) => col.WinRate}/>

                     
                    
                      <ExcelColumn label="Total # of Actions Clicks" value="Clicks"/>
                      <ExcelColumn label="Avg CPC" value={(col) => "$"+col.CPC}/>
                      <ExcelColumn label="Avg Pos" value={(col) => col.avgposcal}/>
                      <ExcelColumn label="CTR" value={(col) => col.CTR}/>


                      <ExcelColumn label="Total # of Actions Calls" value="totalbillable"/>
                      <ExcelColumn label="CPQC" value={(col) => "$"+col.CPQC}/>
                      <ExcelColumn label="Avg Duration" value={(col) => col.avgDuration}/>
                      <ExcelColumn label=" Total Cost" value={(col) => "$"+col.soldamount}/>
                    
                                                       
                  </ExcelSheet>
     
              </ExcelFile> );
          }


        const expandRow = {
          className: "",
          renderer: (row) => <div>{detail_table}</div>,
          onlyOneExpanding: true,
          onExpand: (row, isExpand, rowIndex, e) => {
           
            if (isExpand == true) {
              this.getDetailData(row.id, row.product);
            }
          },
        };

        table = (
          <div className="col-md-12">
            <ToolkitProvider
              keyField="id"
              data={products}
              columns={columns}
              exportCSV={{
                ignoreFooter: false,
                fileName: this.state.product + ".csv",
              }}
            >
              {(props) => (
                <div>
                  <div className="text-right">
                    {exceltable}
                    <ExportCSVButton {...props.csvProps}>
                      Export CSV
                    </ExportCSVButton>
                  </div>
                  <hr />
                  <BootstrapTable
                  id="all-products"
                  keyField="id"
                    {...props.baseProps}
                    headerClasses="thead-dark"
                    footerClasses="thead-dark"
                    wrapperClasses="table-responsive"
                    striped
                   
                    
                  />
                </div>
              )}
            </ToolkitProvider>
          </div>
        );
      } else {

        

        const products = this.state.data;
        const columns = [
          {
          dataField: 'report_date',
          text: 'Date',
          hidden:this.state.report_type == "summary" ? true : false,
          footer: "",
            footerAlign: 'center',
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: 'center' }
        },
          {
            dataField: "product",
            text: "Product",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "60px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "lead_type_name",
            text: "L.O.B",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "150px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "leadquality",
            text: "Media Type",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "80px", textAlign: "center" };
            },
            style: { textAlign: "center" },
          },
          {
            dataField: "Campaign_code",
            text: "Campaign",
            footer: "",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "165px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            formatter: (cell, item) => {
              return (
                <>
                  {item.Campaign_code}
                </>
              );
            },
            footerFormatter: (cell, row, rowIndex) => `Total :`,
          },
          {
            dataField: "totalbillable",
            text: "Total # of Actions",
            footer: "footer 3",
            footerAlign: "center",
            sort: true,
            headerStyle: (colum, colIndex) => {
              return { width: "150px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `${this.state.totalresults.totalbillable}`,
          },
          {
            dataField: "soldamount",
            text: "Total Cost",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "120px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalrevenue}`,
            formatter: (cell, item) => {
              return (
                <>
                  {
                    <NumberFormat
                      value={item.totalrevenue}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  }
                </>
              );
            },
            csvFormatter: (cell, row, rowIndex) => `$${row.totalrevenue}`,
          },
          {
            dataField: "CPQC",
            text: "CPQC",
            footer: "Footer 3",
            footerAlign: "center",
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footerFormatter: (cell, row, rowIndex) =>
              `$${this.state.totalresults.totalCPQC}`,
            formatter: (cell, item) => {
              return (
                <>
                  {
                    <NumberFormat
                      value={item.CPQC}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  }
                </>
              );
            },
            csvFormatter: (cell, row, rowIndex) => `$${row.CPQC}`,
          },
          {
            dataField: "avgDuration",
            text: "Avg Duration",
            headerStyle: (colum, colIndex) => {
              return { width: "100px", textAlign: "center" };
            },
            style: { textAlign: "center" },
            footer: this.state.totalresults.totalcallLengthInSeconds,
            footerAlign: "center",
          },
        ];

        let detail_table;
        const { detail_id } = this.state;

        detail_table = (
          <div className="table table-striped table-responsive">
            {this.state.data
              .filter((item) => item.id == detail_id)
              .map((item) => (
                <div>
                  {item.detail.map(function (itemdetail, index) {
                    return (
                      <ul>
                        <li style={{ width: "583px" }}>
                          {itemdetail.date_report}
                        </li>

                        <li style={{ width: "152px" }}>{itemdetail.totalbillable}</li>
                        <li style={{ width: "121px" }}>
                          ${itemdetail.totalrevenue}
                        </li>
                        <li style={{ width: "100px" }}>${itemdetail.CPQC}</li>
                        <li style={{ width: "100px" }}>{itemdetail.avgDuration}</li>
                        
                      </ul>
                    );
                  })}
                </div>
              ))}
          </div>
        );




        const expandRow = {
          className: "",
          renderer: (row) => <div>{detail_table}</div>,
          onlyOneExpanding: true,
          onExpand: (row, isExpand, rowIndex, e) => {
            
            if (isExpand == true) {
              this.getDetailData(row.id, row.product);
            }
          },
        };

        if(this.state.report_type == "detail"){
        exceltable = (<ExcelFile element={<button className="react-bs-table-csv-btn btn btn-default">Export Excel</button>} filename="Calls-detail">
                    <ExcelSheet data={this.state.exceldata} name="Calls">

                   
                  
                    <ExcelColumn label="Date" value="report_date"/>
                    <ExcelColumn label="Product" value="product" />                   
                   
                    
                    <ExcelColumn label="L.O.B" value="lead_type_name"/>
                    <ExcelColumn label="Media Type" value="leadquality"/>
                    <ExcelColumn label="Campaign"
                                   value="Campaign_code"/>
                    <ExcelColumn label="Total # of Actions" value="totalbillable"/>
                    <ExcelColumn label="Total Cost" value={(col) => "$"+col.totalrevenue}/>
                    <ExcelColumn label="CPQC" value={(col) => "$"+col.CPQC}/>
                    <ExcelColumn label="Avg Duration" value="avgDuration"/>
                                                     
                </ExcelSheet>
   
            </ExcelFile> );

}else{
  exceltable = (<ExcelFile element={<button className="react-bs-table-csv-btn btn btn-default">Export Excel</button>} filename="Calls-summary">
                    <ExcelSheet data={this.state.exceldata} name="Calls">

                    <ExcelColumn label="Product" value="product" />
                   
                    <ExcelColumn label="L.O.B" value="lead_type_name"/>
                    <ExcelColumn label="Media Type" value="leadquality"/>
                    <ExcelColumn label="Campaign"
                                   value="Campaign_code"/>
                    <ExcelColumn label="Total # of Actions" value="totalbillable"/>
                    <ExcelColumn label="Total Cost" value={(col) => "$"+col.totalrevenue}/>
                    <ExcelColumn label="CPQC" value={(col) => "$"+col.CPQC}/>
                    <ExcelColumn label="Avg Duration" value="avgDuration"/>
                                                     
                </ExcelSheet>
   
            </ExcelFile> );
}

        table = (
          <div className="col-md-12">
            <ToolkitProvider
              keyField="id"
              data={products}
              columns={columns}
              exportCSV={{
                ignoreFooter: false,
                fileName: this.state.product + ".csv",
              }}
            >



              {(props) => (
                <div>
                  <div className="text-right">
                    {exceltable}
                    <ExportCSVButton {...props.csvProps}>
                      Export CSV
                    </ExportCSVButton>
                  </div>
                  <hr />
                  <BootstrapTable
                   keyField="id"
                    {...props.baseProps}
                    headerClasses="thead-dark"
                    footerClasses="thead-dark"
                    wrapperClasses="table-responsive"
                    striped
                    
                  />
                </div>
              )}
            </ToolkitProvider>
          </div>
        );
      }
    }

    let select_campaign;

    select_campaign = (
      <select
        className="form-control"
        onChange={this.fieldchange}
        name="campaign_name"
        disabled={this.state.disabled}
      >
        <option value="All">-All Campaigns-</option>
        {this.state.campaign.length > 0
          ? this.state.campaign
              .filter(
                (item) =>
                  !this.state.product || item.product === this.state.product
              )
              .map((item) => (
                <option
                  key={item.campaign_name}
                  value={item.buyer_lead_type_id}
                >
                  {item.display_name}
                </option>
              ))
          : ""}
      </select>
    );

    let select_product;

    select_product = (
      <select
        className="form-control"
        onChange={this.fieldchangeproduct}
        name="product"
      >
        <option value="">-Select Product-</option>
        <option value="All">All Products</option>
        <option value="Calls">Calls</option>
        <option value="Clicks">Clicks</option>
        <option value="Leads">Leads</option>
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
                    <h3 className="box-title">Analytics</h3>
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
                              Product: <span className="red">*</span>
                            </label>

                            {select_product}

                            <div className="errorMsg">
                              {this.state.errors.product}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Campaigns: <span className="red">*</span>
                            </label>

                            {select_campaign}

                            <div className="errorMsg">
                              {this.state.errors.campaign_name}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Time Frame: </label>

                            <select
                              name="timeframe"
                              className="form-control"
                              onChange={this.fielddatechange}
                            >
                              <option value="today">Select</option>
                              <option value="today">Today</option>
                              <option value="yesterday">Yesterday</option>
                              <option value="day_bef_yest">
                                Day Before Yesterday
                              </option>
                              <option value="last_week">Last Week</option>
                              <option value="this_week">This Week</option>
                              <option value="this_month">This Month</option>
                              <option value="last_month">Last month</option>
                              <option value="this_year">YTD</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="form-group">
                            <label>
                              From Date: <span className="red">*</span>
                            </label>

                            <DatePicker
                              selected={this.state.startDate}
                              onChange={this.handleChangestart}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              showMonthDropdown
                              useShortMonthInDropdown
                              className="form-control"
                              placeholderText="Click to select a From date"
                              dateFormat="MM-dd-yyyy"
                              showYearDropdown
                            />

                            <div className="errorMsg">
                              {this.state.errors.startDate}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="form-group">
                            <label>
                              To Date: <span className="red">*</span>
                            </label>

                            <DatePicker
                              selected={this.state.endDate}
                              onChange={this.handleChangeend}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              minDate={this.state.startDate}
                              showMonthDropdown
                              useShortMonthInDropdown
                              className="form-control"
                              placeholderText="Click to select a To date"
                              dateFormat="MM-dd-yyyy"
                              showYearDropdown
                            />

                            <div className="errorMsg">
                              {this.state.errors.endDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                          <div className="form-group">
                          

                            <div className="radio">
                              <label>
                                <input
                                  type="radio"
                                  name="report_type"
                                  value="summary"
                                  checked={
                                    this.state.report_type === "summary"
                                  }
                                  onChange={this.onValueStateChange}
                                />
                                Summary Report
                              </label>
                            </div>
                            <div className="radio">
                              <label>
                                <input
                                  type="radio"
                                  name="report_type"
                                  value="detail"
                                  checked={
                                    this.state.report_type === "detail"
                                  }
                                  onChange={this.onValueStateChange}
                                />
                                Detail Report
                              </label>
                            </div>
                          </div>
                        </div>
                      <div className="box-footer text-center col-md-6">

                        <button type="submit" className="btn btn-info leftside">
                          <i className="fa fa-send"></i> Generate
                        </button>
                      </div>
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

export default Report;
