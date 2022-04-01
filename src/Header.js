
import React from 'react';
import store from 'store';
import { Link } from 'react-router-dom';
import Auth from './modules/Auth';
import Logout from "./component/Logout";
import Sidebar from './Sidebar';
import Moment from 'react-moment';

class Header extends React.Component {
    
	constructor(props) {
        super(props);

        this.state = {
            user: {},
            users: [],
            cdate : new Date()
        };
		
		

		
		
    }
	componentDidMount() {
        this.setState({ 
            user: JSON.parse(store.get('userdata')),
            users: { loading: true }
        });
		  

           if(Auth.getToken()!=''){
             Auth.check_auth();
          }
		
			window.scrollTo(0, 0)
		
        
    }

    render() {
	const { user } = this.state;
         
		//console.log(this.state.cdate)
		 
		 return (
			<div>
            <header className="main-header">
                <Link to="/" className="logo">
                    <span className="logo-mini"><img className="img-responsive imglogo" src={Auth.imageCheck('img/logo-icon.png')} /></span>
                    <span className="logo-lg"><img className="img-responsive imgmainlogo" src={Auth.imageCheck('img/logo-admin.png')} /></span>
                </Link>
                <nav className="navbar navbar-static-top">
                <div className="topbar">
                <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a>
                    <span className="analyticscls">Consumer Coverage Analytics <small>
                        <Moment format="dddd MMM D, YYYY" withTitle>
                {this.state.cdate}
            </Moment>
                   </small></span>
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li><Link to={'/useredit/'+user.user_id}><i className="fa fa-user"></i> {user.username}</Link></li>
                            <li className="messages-menu">
                                 <Logout/>
                               
                            </li>
                        </ul>
                    </div>
                </div>
                    
                </nav>
            </header>
			<Sidebar />
			</div>
        );
    }
}

export default  Header;
