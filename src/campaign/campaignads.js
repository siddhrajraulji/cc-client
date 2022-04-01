import React, { Component } from "react";
import store from "store";
import axios from "axios";
import Header from "../Header";
import { Redirect, Link } from "react-router-dom";
import Auth from "../modules/Auth";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
class Campaignads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        fromtime_Sunday_1: "01:00",
        totime_Sunday_1: "01:00",
        campaign_link: "",
        open: false,
        monthly_budget: "",
        daily_budget: "",
        display_url: "",
        headline: "",
        bullet1: "",
        bullet2: "",
        bullet3: "",
        bullet4: "",
        bullet5: "",
        campaign_ad_id: "",
        load_spinner: false,
        bid_type: "Fixed",
        delivery_checkbox_Monday: 'Yes',
        delivery_checkbox_Tuesday: 'Yes',
        delivery_checkbox_Wednesday: 'Yes',
        delivery_checkbox_Thursday: 'Yes',
        delivery_checkbox_Friday: 'Yes',
        delivery_checkbox_Saturday: 'Yes',
        delivery_checkbox_Sunday: 'Yes'
      },
      errors: {},
      errorMessage: "",
      status: "",
      status_exist: 1,
      message: "",
      campaignads_results: [],
      selectedFile: null,
      selectedOption: "None",
      Campaign_code:''
    };
    //console.log(this.props.match.params.id);

    this.getbuyeraddleadcampaigndetail();
    this.handleChange = this.handleChange.bind(this);
    this.change = this.change.bind(this);
    this.submituserRegistrationForm = this.submituserRegistrationForm.bind(
      this
    );
    this.onFileChange = this.onFileChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.applyValueChange = this.applyValueChange.bind(this);
    this.onValueStateChange = this.onValueStateChange.bind(this);
    this.handleChangeChk = this.handleChangeChk.bind(this);

  }

  handleChangeChk(event) {
    let fields = this.state.fields;
    //alert(fields[event.target.name]);
    fields[event.target.name] = fields[event.target.name] == "No" ? "Yes" : "No";
    this.setState({
      fields,
    });
  }

  onOpenModal = (itemId, base_price, price, label, quality_type) => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  applyValueChange() {
    let selectedOption = this.state.selectedOption;
    let fields = this.state.fields;

    if (selectedOption == "AllWeekdays") {
      for (var i = 1; i <= 5; i++) {
        var fromtime = fields["fromtime_Monday_" + i];
        var totime = fields["totime_Monday_" + i];

        fields["fromtime_Tuesday_" + i] = fromtime;
        fields["fromtime_Wednesday_" + i] = fromtime;
        fields["fromtime_Thursday_" + i] = fromtime;
        fields["fromtime_Friday_" + i] = fromtime;
        fields["fromtime_Saturday_" + i] = "00:00";
        fields["fromtime_Sunday_" + i] = "00:00";

        fields["totime_Tuesday_" + i] = totime;
        fields["totime_Wednesday_" + i] = totime;
        fields["totime_Thursday_" + i] = totime;
        fields["totime_Friday_" + i] = totime;
        fields["totime_Saturday_" + i] = "00:00";
        fields["totime_Sunday_" + i] = "00:00";
      }
    } else if (selectedOption == "AllDays") {
      for (var i = 1; i <= 5; i++) {
        var fromtime = fields["fromtime_Monday_" + i];
        var totime = fields["totime_Monday_" + i];

        fields["fromtime_Tuesday_" + i] = fromtime;
        fields["fromtime_Wednesday_" + i] = fromtime;
        fields["fromtime_Thursday_" + i] = fromtime;
        fields["fromtime_Friday_" + i] = fromtime;
        fields["fromtime_Saturday_" + i] = fromtime;
        fields["fromtime_Sunday_" + i] = fromtime;

        fields["totime_Tuesday_" + i] = totime;
        fields["totime_Wednesday_" + i] = totime;
        fields["totime_Thursday_" + i] = totime;
        fields["totime_Friday_" + i] = totime;
        fields["totime_Saturday_" + i] = totime;
        fields["totime_Sunday_" + i] = totime;
      }
    } else {
      for (var i = 1; i <= 5; i++) {
        fields["fromtime_Tuesday_" + i] = "00:00";
        fields["fromtime_Wednesday_" + i] = "00:00";
        fields["fromtime_Thursday_" + i] = "00:00";
        fields["fromtime_Friday_" + i] = "00:00";
        fields["fromtime_Saturday_" + i] = "00:00";
        fields["fromtime_Sunday_" + i] = "00:00";

        fields["totime_Tuesday_" + i] = "00:00";
        fields["totime_Wednesday_" + i] = "00:00";
        fields["totime_Thursday_" + i] = "00:00";
        fields["totime_Friday_" + i] = "00:00";
        fields["totime_Saturday_" + i] = "00:00";
        fields["totime_Sunday_" + i] = "00:00";
      }
    }
    this.setState({
      fields,
    });
  }
  onValueChange(event) {
    this.setState({
      selectedOption: event.target.value,
    });
  }

  onValueStateChange(event) {
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields,
    });
  }

  change(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;

    this.setState({
      fields,
    });
  }

  renderAlert() {
    if (this.state.errorMessage && this.state.status == "0") {
      return (
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-danger">
              <strong>!Opps, </strong>
              {this.state.errorMessage}
            </div>
          </div>
        </div>
      );
    } else if (this.state.status == "1") {
      return (
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-success">
              <strong>Success, </strong>
              {this.state.errorMessage}
            </div>
          </div>
        </div>
      );
    }
  }

  handleChange(e) {
    
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields,
    });
  }

  onFileChange(e) {
    this.setState({ selectedFile: e.target.files[0] });
  }

  getbuyeraddleadcampaigndetail() {
    const headers = {
      "Content-Type": "application/json",
      Authkey: Auth.Authkey(),
      session: Auth.getToken(),
    };

    axios
      .post(
        `${Auth.getapiurl()}/getbuyeraddleadcampaigndetail`,
        {
          buyer_lead_type_id: this.props.match.params.id,
        },
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res.data.status == 0) {
         
          const fields = res.data.responsedata;
          this.setState({ fields });
          const message = res.data.message;
          this.setState({ message });
        }
        const status = res.data.status;
        this.setState({ status });

        const Campaign_code = res.data.responsedata.Campaign_code;
        this.setState({Campaign_code})


      });
  }

  submituserRegistrationForm(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.setState({ load_spinner: true });

      const headers = {
        Authkey: Auth.Authkey(),
        session: Auth.getToken(),
      };

      const formData = new FormData();

      if (this.state.selectedFile) {
        formData.append(
          "campaign_logo",
          this.state.selectedFile,
          this.state.selectedFile.name
        );
      }

      formData.set("campaign_link", this.state.fields.campaign_link);
      formData.set("daily_budget", this.state.fields.daily_budget);
      formData.set("monthly_budget", this.state.fields.monthly_budget);
      formData.set("display_url", this.state.fields.display_url);
      formData.set("headline", this.state.fields.headline);
      formData.set("bullet1", this.state.fields.bullet1);
      formData.set("bullet2", this.state.fields.bullet2);
      formData.set("bullet3", this.state.fields.bullet3);
      formData.set("bullet4", this.state.fields.bullet4);
      formData.set("bullet5", this.state.fields.bullet5);
      formData.set("campaign_ad_id", this.state.fields.campaign_ad_id);
      formData.set("buyer_lead_type_id", this.props.match.params.id);
      formData.set("bid_type", this.state.fields.bid_type);

      //Sunday from - to time
      formData.set("fromtime_Sunday_1", this.state.fields.fromtime_Sunday_1);
      formData.set("totime_Sunday_1", this.state.fields.totime_Sunday_1);

      formData.set("fromtime_Sunday_2", this.state.fields.fromtime_Sunday_2);
      formData.set("totime_Sunday_2", this.state.fields.totime_Sunday_2);

      formData.set("fromtime_Sunday_3", this.state.fields.fromtime_Sunday_3);
      formData.set("totime_Sunday_3", this.state.fields.totime_Sunday_3);

      formData.set("fromtime_Sunday_4", this.state.fields.fromtime_Sunday_4);
      formData.set("totime_Sunday_4", this.state.fields.totime_Sunday_4);

      formData.set("fromtime_Sunday_5", this.state.fields.fromtime_Sunday_5);
      formData.set("totime_Sunday_5", this.state.fields.totime_Sunday_5);

      //Monday from - to time
      formData.set("fromtime_Monday_1", this.state.fields.fromtime_Monday_1);
      formData.set("totime_Monday_1", this.state.fields.totime_Monday_1);

      formData.set("fromtime_Monday_2", this.state.fields.fromtime_Monday_2);
      formData.set("totime_Monday_2", this.state.fields.totime_Monday_2);

      formData.set("fromtime_Monday_3", this.state.fields.fromtime_Monday_3);
      formData.set("totime_Monday_3", this.state.fields.totime_Monday_3);

      formData.set("fromtime_Monday_4", this.state.fields.fromtime_Monday_4);
      formData.set("totime_Monday_4", this.state.fields.totime_Monday_4);

      formData.set("fromtime_Monday_5", this.state.fields.fromtime_Monday_5);
      formData.set("totime_Monday_5", this.state.fields.totime_Monday_5);

      //Tuesday from - to time
      formData.set("fromtime_Tuesday_1", this.state.fields.fromtime_Tuesday_1);
      formData.set("totime_Tuesday_1", this.state.fields.totime_Tuesday_1);

      formData.set("fromtime_Tuesday_2", this.state.fields.fromtime_Tuesday_2);
      formData.set("totime_Tuesday_2", this.state.fields.totime_Tuesday_2);

      formData.set("fromtime_Tuesday_3", this.state.fields.fromtime_Tuesday_3);
      formData.set("totime_Tuesday_3", this.state.fields.totime_Tuesday_3);

      formData.set("fromtime_Tuesday_4", this.state.fields.fromtime_Tuesday_4);
      formData.set("totime_Tuesday_4", this.state.fields.totime_Tuesday_4);

      formData.set("fromtime_Tuesday_5", this.state.fields.fromtime_Tuesday_5);
      formData.set("totime_Tuesday_5", this.state.fields.totime_Tuesday_5);

      //Wednesday from - to time
      formData.set(
        "fromtime_Wednesday_1",
        this.state.fields.fromtime_Wednesday_1
      );
      formData.set("totime_Wednesday_1", this.state.fields.totime_Wednesday_1);

      formData.set(
        "fromtime_Wednesday_2",
        this.state.fields.fromtime_Wednesday_2
      );
      formData.set("totime_Wednesday_2", this.state.fields.totime_Wednesday_2);

      formData.set(
        "fromtime_Wednesday_3",
        this.state.fields.fromtime_Wednesday_3
      );
      formData.set("totime_Wednesday_3", this.state.fields.totime_Wednesday_3);

      formData.set(
        "fromtime_Wednesday_4",
        this.state.fields.fromtime_Wednesday_4
      );
      formData.set("totime_Wednesday_4", this.state.fields.totime_Wednesday_4);

      formData.set(
        "fromtime_Wednesday_5",
        this.state.fields.fromtime_Wednesday_5
      );
      formData.set("totime_Wednesday_5", this.state.fields.totime_Wednesday_5);

      //Thursday from - to time
      formData.set(
        "fromtime_Thursday_1",
        this.state.fields.fromtime_Thursday_1
      );
      formData.set("totime_Thursday_1", this.state.fields.totime_Thursday_1);

      formData.set(
        "fromtime_Thursday_2",
        this.state.fields.fromtime_Thursday_2
      );
      formData.set("totime_Thursday_2", this.state.fields.totime_Thursday_2);

      formData.set(
        "fromtime_Thursday_3",
        this.state.fields.fromtime_Thursday_3
      );
      formData.set("totime_Thursday_3", this.state.fields.totime_Thursday_3);

      formData.set(
        "fromtime_Thursday_4",
        this.state.fields.fromtime_Thursday_4
      );
      formData.set("totime_Thursday_4", this.state.fields.totime_Thursday_4);

      formData.set(
        "fromtime_Thursday_5",
        this.state.fields.fromtime_Thursday_5
      );
      formData.set("totime_Thursday_5", this.state.fields.totime_Thursday_5);

      //Friday from - to time
      formData.set("fromtime_Friday_1", this.state.fields.fromtime_Friday_1);
      formData.set("totime_Friday_1", this.state.fields.totime_Friday_1);

      formData.set("fromtime_Friday_2", this.state.fields.fromtime_Friday_2);
      formData.set("totime_Friday_2", this.state.fields.totime_Friday_2);

      formData.set("fromtime_Friday_3", this.state.fields.fromtime_Friday_3);
      formData.set("totime_Friday_3", this.state.fields.totime_Friday_3);

      formData.set("fromtime_Friday_4", this.state.fields.fromtime_Friday_4);
      formData.set("totime_Friday_4", this.state.fields.totime_Friday_4);

      formData.set("fromtime_Friday_5", this.state.fields.fromtime_Friday_5);
      formData.set("totime_Friday_5", this.state.fields.totime_Friday_5);

      //Saturday from - to time
      formData.set(
        "fromtime_Saturday_1",
        this.state.fields.fromtime_Saturday_1
      );
      formData.set("totime_Saturday_1", this.state.fields.totime_Saturday_1);

      formData.set(
        "fromtime_Saturday_2",
        this.state.fields.fromtime_Saturday_2
      );
      formData.set("totime_Saturday_2", this.state.fields.totime_Saturday_2);

      formData.set(
        "fromtime_Saturday_3",
        this.state.fields.fromtime_Saturday_3
      );
      formData.set("totime_Saturday_3", this.state.fields.totime_Saturday_3);

      formData.set(
        "fromtime_Saturday_4",
        this.state.fields.fromtime_Saturday_4
      );
      formData.set("totime_Saturday_4", this.state.fields.totime_Saturday_4);

      formData.set(
        "fromtime_Saturday_5",
        this.state.fields.fromtime_Saturday_5
      );
      formData.set("totime_Saturday_5", this.state.fields.totime_Saturday_5);


      formData.set("delivery_checkbox_Monday", this.state.fields.delivery_checkbox_Monday);
      formData.set("delivery_checkbox_Tuesday", this.state.fields.delivery_checkbox_Tuesday);
      formData.set("delivery_checkbox_Wednesday", this.state.fields.delivery_checkbox_Wednesday);
      formData.set("delivery_checkbox_Thursday", this.state.fields.delivery_checkbox_Thursday);
      formData.set("delivery_checkbox_Friday", this.state.fields.delivery_checkbox_Friday);
      formData.set("delivery_checkbox_Saturday", this.state.fields.delivery_checkbox_Saturday);
      formData.set("delivery_checkbox_Sunday", this.state.fields.delivery_checkbox_Sunday);

      axios
        .post(`${Auth.getapiurl()}/buyerAddupdateleadcampaign`, formData, {
          headers: headers,
        })

        .then((res) => {
          this.setState({
            errorMessage: res.data.message,
            status: res.data.status,
          });
          this.setState({ load_spinner: false });

          if (res.data.status == 1) {
            Auth.toastmsg(res.data.message, "S");
          } else {
            Auth.toastmsg(res.data.message, "E");
          }

          this.props.history.push("/campaign");
        });
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["campaign_link"]) {
      formIsValid = false;
      errors["campaign_link"] = "*Please Fill campaign Link.";
    }

    if (!fields["daily_budget"]) {
      formIsValid = false;
      errors["daily_budget"] = "*Please Fill Daily Budget.";
    }

    if (!fields["monthly_budget"]) {
      formIsValid = false;
      errors["monthly_budget"] = "*Please Fill Monthly Budget.";
    }

    if (!fields["display_url"]) {
      formIsValid = false;
      errors["display_url"] = "*Please Fill Display URL.";
    }

    if (!fields["headline"]) {
      formIsValid = false;
      errors["headline"] = "*Please Fill Headline.";
    }

    if (!fields["bullet1"]) {
      formIsValid = false;
      errors["bullet1"] = "*Please Fill Bullet 1.";
    }

    if (!fields["bullet2"]) {
      formIsValid = false;
      errors["bullet2"] = "*Please Fill Bullet 2.";
    }

    if (!fields["bullet3"]) {
      formIsValid = false;
      errors["bullet3"] = "*Please Fill Bullet 3.";
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  render() {
    const { open } = this.state;

    const fields = this.state.fields;

  //  console.log(this.state.fields);

    if (!Auth.getToken()) {
      return <Redirect to="/login" />;
    }

    var week = new Array(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    );

    var weekdays = new Array("1", "2", "3", "4", "5");

    var hoursarray = new Array(
      "00:00",
      "01:00",
      "01:30",
      "02:00",
      "02:30",
      "03:00",
      "03:30",
      "04:00",
      "04:30",
      "05:00",
      "05:30",
      "06:00",
      "06:30",
      "07:00",
      "07:30",
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
      "21:30",
      "22:00",
      "22:30",
      "23:00",
      "23:30"
    );

    let tab_week;
    tab_week = week.map((item, i) => <Tab key={i}>{week[i]}</Tab>);

    var sundayData = weekdays.map((timevalue, i) => {
      var sunday_value = "";
      var sunday_to_value = "";

      if (i + 1 == 1) {
        sunday_value = this.state.fields.fromtime_Sunday_1;
        sunday_to_value = this.state.fields.totime_Sunday_1;
      } else if (i + 1 == 2) {
        sunday_value = this.state.fields.fromtime_Sunday_2;
        sunday_to_value = this.state.fields.totime_Sunday_2;
      } else if (i + 1 == 3) {
        sunday_value = this.state.fields.fromtime_Sunday_3;
        sunday_to_value = this.state.fields.totime_Sunday_3;
      } else if (i + 1 == 4) {
        sunday_value = this.state.fields.fromtime_Sunday_4;
        sunday_to_value = this.state.fields.totime_Sunday_4;
      } else if (i + 1 == 5) {
        sunday_value = this.state.fields.fromtime_Sunday_5;
        sunday_to_value = this.state.fields.totime_Sunday_5;
      }

      return (
        <div className="form-group">
          <label className="col-sm-2 control-label">from : </label>

          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"fromtime_Sunday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option
                  key={value}
                  value={value}
                  selected={sunday_value == value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>

          <label className="col-sm-2 control-label">To : </label>

          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"totime_Sunday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option
                  key={value}
                  value={value}
                  selected={sunday_to_value == value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    });

    var mondayData = weekdays.map((timevalue, i) => {
      var day_value = "";
      var day_to_value = "";

      if (i + 1 == 1) {
        day_value = this.state.fields.fromtime_Monday_1;
        day_to_value = this.state.fields.totime_Monday_1;
      } else if (i + 1 == 2) {
        day_value = this.state.fields.fromtime_Monday_2;
        day_to_value = this.state.fields.totime_Monday_2;
      } else if (i + 1 == 3) {
        day_value = this.state.fields.fromtime_Monday_3;
        day_to_value = this.state.fields.totime_Monday_3;
      } else if (i + 1 == 4) {
        day_value = this.state.fields.fromtime_Monday_4;
        day_to_value = this.state.fields.totime_Monday_4;
      } else if (i + 1 == 5) {
        day_value = this.state.fields.fromtime_Monday_5;
        day_to_value = this.state.fields.totime_Monday_5;
      }

      return (
        <div className="form-group">
          <label className="col-sm-2 control-label">from : </label>

          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"fromtime_Monday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option key={value} value={value} selected={day_value == value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <label className="col-sm-2 control-label">To : </label>

          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"totime_Monday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option
                  key={value}
                  value={value}
                  selected={day_to_value == value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    });

    var tuesdayData = weekdays.map((timevalue, i) => {
      var day_value = "";
      var day_to_value = "";

      if (i + 1 == 1) {
        day_value = this.state.fields.fromtime_Tuesday_1;
        day_to_value = this.state.fields.totime_Tuesday_1;
      } else if (i + 1 == 2) {
        day_value = this.state.fields.fromtime_Tuesday_2;
        day_to_value = this.state.fields.totime_Tuesday_2;
      } else if (i + 1 == 3) {
        day_value = this.state.fields.fromtime_Tuesday_3;
        day_to_value = this.state.fields.totime_Tuesday_3;
      } else if (i + 1 == 4) {
        day_value = this.state.fields.fromtime_Tuesday_4;
        day_to_value = this.state.fields.totime_Tuesday_4;
      } else if (i + 1 == 5) {
        day_value = this.state.fields.fromtime_Tuesday_5;
        day_to_value = this.state.fields.totime_Tuesday_5;
      }

      return (
        <div className="form-group">
          <label className="col-sm-2 control-label">from : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"fromtime_Tuesday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option key={value} value={value} selected={day_value == value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <label className="col-sm-2 control-label">To : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"totime_Tuesday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option
                  key={value}
                  value={value}
                  selected={day_to_value == value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    });

    var wednesdayData = weekdays.map((timevalue, i) => {
      var day_value = "";
      var day_to_value = "";

      if (i + 1 == 1) {
        day_value = this.state.fields.fromtime_Wednesday_1;
        day_to_value = this.state.fields.totime_Wednesday_1;
      } else if (i + 1 == 2) {
        day_value = this.state.fields.fromtime_Wednesday_2;
        day_to_value = this.state.fields.totime_Wednesday_2;
      } else if (i + 1 == 3) {
        day_value = this.state.fields.fromtime_Wednesday_3;
        day_to_value = this.state.fields.totime_Wednesday_3;
      } else if (i + 1 == 4) {
        day_value = this.state.fields.fromtime_Wednesday_4;
        day_to_value = this.state.fields.totime_Wednesday_4;
      } else if (i + 1 == 5) {
        day_value = this.state.fields.fromtime_Wednesday_5;
        day_to_value = this.state.fields.totime_Wednesday_5;
      }
      return (
        <div className="form-group">
          <label className="col-sm-2 control-label">from : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"fromtime_Wednesday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option key={value} value={value} selected={day_value == value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <label className="col-sm-2 control-label">To : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"totime_Wednesday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option
                  key={value}
                  value={value}
                  selected={day_to_value == value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    });

    var thursdayData = weekdays.map((timevalue, i) => {
      var day_value = "";
      var day_to_value = "";

      if (i + 1 == 1) {
        day_value = this.state.fields.fromtime_Thursday_1;
        day_to_value = this.state.fields.totime_Thursday_1;
      } else if (i + 1 == 2) {
        day_value = this.state.fields.fromtime_Thursday_2;
        day_to_value = this.state.fields.totime_Thursday_2;
      } else if (i + 1 == 3) {
        day_value = this.state.fields.fromtime_Thursday_3;
        day_to_value = this.state.fields.totime_Thursday_3;
      } else if (i + 1 == 4) {
        day_value = this.state.fields.fromtime_Thursday_4;
        day_to_value = this.state.fields.totime_Thursday_4;
      } else if (i + 1 == 5) {
        day_value = this.state.fields.fromtime_Thursday_5;
        day_to_value = this.state.fields.totime_Thursday_5;
      }

      return (
        <div className="form-group">
          <label className="col-sm-2 control-label">from : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"fromtime_Thursday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option key={value} value={value} selected={day_value == value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <label className="col-sm-2 control-label">To : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"totime_Thursday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option
                  key={value}
                  value={value}
                  selected={day_to_value == value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    });

    var fridayData = weekdays.map((timevalue, i) => {
      var day_value = "";
      var day_to_value = "";

      if (i + 1 == 1) {
        day_value = this.state.fields.fromtime_Friday_1;
        day_to_value = this.state.fields.totime_Friday_1;
      } else if (i + 1 == 2) {
        day_value = this.state.fields.fromtime_Friday_2;
        day_to_value = this.state.fields.totime_Friday_2;
      } else if (i + 1 == 3) {
        day_value = this.state.fields.fromtime_Friday_3;
        day_to_value = this.state.fields.totime_Friday_3;
      } else if (i + 1 == 4) {
        day_value = this.state.fields.fromtime_Friday_4;
        day_to_value = this.state.fields.totime_Friday_4;
      } else if (i + 1 == 5) {
        day_value = this.state.fields.fromtime_Friday_5;
        day_to_value = this.state.fields.totime_Friday_5;
      }

      return (
        <div className="form-group">
          <label className="col-sm-2 control-label">from : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"fromtime_Friday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option key={value} value={value} selected={day_value == value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <label className="col-sm-2 control-label">To : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"totime_Friday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option
                  key={value}
                  value={value}
                  selected={day_to_value == value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    });

    var saturdayData = weekdays.map((timevalue, i) => {
      var day_value = "";
      var day_to_value = "";

      if (i + 1 == 1) {
        day_value = this.state.fields.fromtime_Saturday_1;
        day_to_value = this.state.fields.totime_Saturday_1;
      } else if (i + 1 == 2) {
        day_value = this.state.fields.fromtime_Saturday_2;
        day_to_value = this.state.fields.totime_Saturday_2;
      } else if (i + 1 == 3) {
        day_value = this.state.fields.fromtime_Saturday_3;
        day_to_value = this.state.fields.totime_Saturday_3;
      } else if (i + 1 == 4) {
        day_value = this.state.fields.fromtime_Saturday_4;
        day_to_value = this.state.fields.totime_Saturday_4;
      } else if (i + 1 == 5) {
        day_value = this.state.fields.fromtime_Saturday_5;
        day_to_value = this.state.fields.totime_Saturday_5;
      }

      return (
        <div className="form-group">
          <label className="col-sm-2 control-label">from : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"fromtime_Saturday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option key={value} value={value} selected={day_value == value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <label className="col-sm-2 control-label">To : </label>
          <div className="col-sm-4">
            <select
              className="form-control"
              onChange={this.change}
              name={"totime_Saturday_" + (i + 1)}
            >
              {hoursarray.map((value) => (
                <option
                  key={value}
                  value={value}
                  selected={day_to_value == value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    });

    return (
      <div>
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
                    <h3 className="box-title">Campaign Details</h3>

                    <div class="pull-right">
                    <h2 className="box-title">[ Campaign : {this.state.Campaign_code} ]</h2>
                      {this.state.status == 0 ? (
                        <span
                          className="btn btn-primary btn-lg"
                          onClick={() => this.onOpenModal()}
                        >
                          Preview
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                  </div>
                  <form
                    className="has-validation-callback"
                    onSubmit={this.submituserRegistrationForm}
                  >
                    <div className="box-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">
                              Campaign Tracking Link :{" "}
                              <span className="red">*</span>
                            </label>

                            <input
                              className="form-control"
                              placeholder="Campaign Tracking Link"
                              defaultValue={this.state.fields.campaign_link}
                              onChange={this.handleChange}
                              onKeyUp={this.handleChange}
                              name="campaign_link"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.campaign_link}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="form-group">
                            <label className="control-label">
                              Campaign Logo :{" "}
                              <span className="red">* (Size : 110 * 55)</span>
                            </label>

                            <input
                              className="form-control"
                              placeholder="Campaign Logo"
                              defaultValue={this.state.fields.campaign_logo}
                              onChange={this.onFileChange}
                              name="campaign_logo"
                              type="file"
                            />

                            <div className="errorMsg">
                              {this.state.errors.campaign_logo}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-group">
                            {this.state.fields.campaign_logo ? (
                              <img
                                src={Auth.imageCheck(
                                  this.state.fields.campaign_logo
                                )}
                                height="100px"
                                className="img-responsive"
                              />
                            ) : (
                                ""
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">
                              Daily Budget : <span className="red">*</span>
                            </label>

                            <input
                              className="form-control"
                              placeholder="Daily Budget"
                              defaultValue={this.state.fields.daily_budget}
                              onChange={this.handleChange}
                              onKeyUp={this.handleChange}
                              name="daily_budget"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.daily_budget}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">
                              Monthly Budget : <span className="red">*</span>
                            </label>

                            <input
                              className="form-control"
                              placeholder="Monthly Budget"
                              defaultValue={this.state.fields.monthly_budget}
                              onChange={this.handleChange}
                              onKeyUp={this.handleChange}
                              name="monthly_budget"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.monthly_budget}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">
                              Display Url : <span className="red">*</span>
                            </label>

                            <input
                              className="form-control"
                              placeholder="Display Url"
                              defaultValue={this.state.fields.display_url}
                              onChange={this.handleChange}
                              onKeyUp={this.handleChange}
                              name="display_url"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.display_url}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">
                              Headline : <span className="red">*</span>
                            </label>

                            <input
                              className="form-control"
                              placeholder="Headline"
                              defaultValue={this.state.fields.headline}
                              onChange={this.handleChange}
                              onKeyUp={this.handleChange}
                              name="headline"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.headline}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">
                              Bullet 1 : <span className="red">*</span>
                            </label>

                            <input
                              className="form-control"
                              placeholder="Bullet 1"
                              defaultValue={this.state.fields.bullet1}
                              onChange={this.handleChange}
                              onKeyUp={this.handleChange}
                              name="bullet1"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.bullet1}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">
                              Bullet 2 : <span className="red">*</span>
                            </label>

                            <input
                              className="form-control"
                              placeholder="Bullet 2"
                              defaultValue={this.state.fields.bullet2}
                              onChange={this.handleChange}
                              onKeyUp={this.handleChange}
                              name="bullet2"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.bullet2}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">
                              Bullet 3 : <span className="red">*</span>
                            </label>

                            <input
                              className="form-control"
                              placeholder="Bullet 3"
                              defaultValue={this.state.fields.bullet3}
                              onChange={this.handleChange}
                              onKeyUp={this.handleChange}
                              name="bullet3"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.bullet3}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">Bullet 4 : </label>

                            <input
                              className="form-control"
                              placeholder="Bullet 4"
                              defaultValue={this.state.fields.bullet4}
                              onKeyUp={this.handleChange}
                              onChange={this.handleChange}
                       
                              name="bullet4"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.bullet4}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">Bullet 5 :</label>

                            <input
                              className="form-control"
                              placeholder="Bullet 5"
                              defaultValue={this.state.fields.bullet5}
                              onChange={this.handleChange}
                              onKeyUp={this.handleChange}
                              name="bullet5"
                              type="text"
                            />
                            <div className="errorMsg">
                              {this.state.errors.bullet5}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="control-label">Bid Type :</label>

                            <div className="radio">
                              <label>
                                <input
                                  type="radio"
                                  name="bid_type"
                                  value="Fixed"
                                  checked={
                                    this.state.fields.bid_type === "Fixed"
                                  }
                                  onChange={this.onValueStateChange}
                                />
                                Fixed
                              </label>
                            </div>
                            <div className="radio">
                              <label>
                                <input
                                  type="radio"
                                  name="bid_type"
                                  value="Dynamic"
                                  checked={
                                    this.state.fields.bid_type === "Dynamic"
                                  }
                                  onChange={this.onValueStateChange}
                                />
                                Dynamic
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <p>
                            <label className="text-danger">
                              Dynamic Variables available currently: {"{StateName} , {ZipCode}"}
                            </label>
                          </p>
                          <p>
                            <label className="text-danger">
                              Allowed in : Headline ,Bullet-1 ,Bullet-2 ,Bullet-3 ,Bullet-4 ,Bullet-5.
                            </label>
                          </p>
                          <p>
                            <label className="text-danger">
                              Example : Insurance Plans in {"{StateName}"} from [site.net].
                            </label>
                          </p>
                          <p>
                            <label className="text-danger">
                              Like : Insurance Plans in California from [site.net].
                            </label>
                          </p>
                        </div>
                      </div>

                      <div className="col-md-12 alert alert-info">
                        <strong>Time of Day Detail <span class="pull-right">( Note : All times are EST )</span></strong>
                      </div>
                      <div className="col-md-12">
                        <Tabs>
                          <TabList>{tab_week}</TabList>

                          <TabPanel>
                            <div className="col-md-9">{mondayData}</div>

                            <div className="col-md-3">
                              <div class="panel panel-default">
                                <div class="panel-body">
                                  <div className="radio">
                                    <label>
                                      <input
                                        type="radio"
                                        value="AllWeekdays"
                                        checked={
                                          this.state.selectedOption ===
                                          "AllWeekdays"
                                        }
                                        onChange={this.onValueChange}
                                      />
                                      Copy to All Weekdays
                                    </label>
                                  </div>
                                  <div className="radio">
                                    <label>
                                      <input
                                        type="radio"
                                        value="AllDays"
                                        checked={
                                          this.state.selectedOption ===
                                          "AllDays"
                                        }
                                        onChange={this.onValueChange}
                                      />
                                      Copy to All Days
                                    </label>
                                  </div>
                                  <div className="radio">
                                    <label>
                                      <input
                                        type="radio"
                                        value="None"
                                        checked={
                                          this.state.selectedOption === "None"
                                        }
                                        onChange={this.onValueChange}
                                      />
                                      None
                                    </label>
                                  </div>

                                  <div
                                    className="btn btn-info"
                                    onClick={this.applyValueChange}
                                  >
                                    Apply
                                  </div>
                                </div>
                              </div>





                              <label>
                                <input type="checkbox" checked={this.state.fields.delivery_checkbox_Monday === "No"} onChange={this.handleChangeChk} name="delivery_checkbox_Monday" /> No Delivery?
                              </label>

                            </div>
                          </TabPanel>
                          <TabPanel>

                            <div className="col-md-9">{tuesdayData}</div>

                            <div className="col-md-3">
                              <label>
                                <input type="checkbox" checked={this.state.fields.delivery_checkbox_Tuesday === "No"} onChange={this.handleChangeChk} name="delivery_checkbox_Tuesday" /> No Delivery?
                              </label>

                            </div>

                          </TabPanel>

                          <TabPanel>
                            <div className="col-md-9">{wednesdayData}</div>

                            <div className="col-md-3">
                              <label>
                                <input type="checkbox" checked={this.state.fields.delivery_checkbox_Wednesday === "No"} onChange={this.handleChangeChk} name="delivery_checkbox_Wednesday" /> No Delivery?
                            </label>

                            </div>
                          </TabPanel>

                          <TabPanel>
                            <div className="col-md-9">{thursdayData}</div>

                            <div className="col-md-3">
                              <label>
                                <input type="checkbox" checked={this.state.fields.delivery_checkbox_Thursday === "No"} onChange={this.handleChangeChk} name="delivery_checkbox_Thursday" /> No Delivery?
                                  </label>

                            </div>
                          </TabPanel>

                          <TabPanel><div className="col-md-9">{fridayData}</div>

                            <div className="col-md-3">
                              <label>
                                <input type="checkbox" checked={this.state.fields.delivery_checkbox_Friday === "No"} onChange={this.handleChangeChk} name="delivery_checkbox_Friday" /> No Delivery?
  </label>

                            </div></TabPanel>

                          <TabPanel><div className="col-md-9">{saturdayData}</div>

                            <div className="col-md-3">
                              <label>
                                <input type="checkbox" checked={this.state.fields.delivery_checkbox_Saturday === "No"} onChange={this.handleChangeChk} name="delivery_checkbox_Saturday" /> No Delivery?
  </label>

                            </div></TabPanel>

                          <TabPanel><div className="col-md-9">{sundayData}</div>

                            <div className="col-md-3">
                              <label>
                                <input type="checkbox" checked={this.state.fields.delivery_checkbox_Sunday === "No"} onChange={this.handleChangeChk} name="delivery_checkbox_Sunday" /> No Delivery?
  </label>

                            </div></TabPanel>
                        </Tabs>
                      </div>
                    </div>
                    <div className="box-footer text-center">
                      <Link className="btn btn-primary" to="/campaign">
                        Back
                      </Link>
                      {this.state.status_exist == 1 ? (
                        this.state.load_spinner ? (
                          <button className="btn btn-info leftside">
                            <i className="fa fa-spinner fa-spin"></i>
                          </button>
                        ) : (
                            <button
                              type="submit"
                              className="btn btn-info leftside"
                            >
                              Save
                            </button>
                          )
                      ) : (
                          ""
                        )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Modal
          open={open}
          onClose={this.onCloseModal}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal-preview modal-lg",
          }}
        >
          <div className="preview-ui">
            <div class="row">
              <div class="col-lg-12 text-center">
                <h4>Campaign Preview</h4>
                <hr />
              </div>

              <div class="col-lg-12" id="offerdiv">
                <div class="listing">
                  <ul class="list-unstyled">
                    <li>
                      <div class="countlisting">1</div>
                      <div class="listingimg">
                        <img
                          src={Auth.imageCheck(this.state.fields.campaign_logo)}
                        />
                      </div>
                      <div class="listingtext">
                        <h4>{this.state.fields.headline}</h4>
                        <ul class="style1 ccawidgetdescul">
                          <li>
                            <i class="fa fa-check"></i>{" "}
                            {this.state.fields.bullet1}
                          </li>
                          <li>
                            <i class="fa fa-check"></i>{" "}
                            {this.state.fields.bullet2}
                          </li>
                          <li>
                            <i class="fa fa-check"></i>{" "}
                            {this.state.fields.bullet3}
                          </li>
                          {this.state.fields.bullet4 != "" ? (
                            <li>
                              <i class="fa fa-check"></i>{" "}
                              {this.state.fields.bullet4}
                            </li>
                          ) : (
                              ""
                            )}
                          {this.state.fields.bullet5 != "" ? (
                            <li>
                              <i class="fa fa-check"></i>{" "}
                              {this.state.fields.bullet5}
                            </li>
                          ) : (
                              ""
                            )}
                        </ul>
                      </div>
                      <div class="listingbutton">
                        <a href="javascript:void(0)" class="applyoffer">
                          Get Quote
                        </a>
                      </div>
                      <div class="clearfix"></div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Campaignads;
