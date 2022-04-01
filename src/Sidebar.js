
import React from 'react';
import store from 'store';
//import { AuthConsumer } from './AuthContext'
import { Link,withRouter } from 'react-router-dom'
import $ from "jquery";


class Sidebar extends React.Component {
   constructor(props) {
        super(props);

        this.state = {
            user: {},
            users: []
        };
    }
	componentDidMount() {
        this.setState({ 
            user: JSON.parse(store.get('userdata')),
            users: { loading: true }
        });




$(document).ready(() => {

$('ul li.treeview').click(function(){

        //$('ul li.treeview ul.treeview-menu').hide('1000'); 
        $(this).find('ul.treeview-menu').slideToggle();
       

});


});

        
    }

getActive(ItemArray)
{
  //  console.log(ItemArray.indexOf(this.props.location.pathname));
  const path = this.props.location.pathname.split('/')[1];
    
      return ItemArray.indexOf(path) >= 0 ? "treeview-menu active-menu" : "treeview-menu";
}

getActiveColor(ItemArray)
{
  //  console.log(ItemArray.indexOf(this.props.location.pathname));
  const path = this.props.location.pathname.split('/')[1];
    
      return ItemArray.indexOf(path) >= 0 ? "treeview menu-open" : "treeview";
}


getActiveMenu(ItemArray)
{
  //  console.log(ItemArray.indexOf(this.props.location.pathname));
  const path = this.props.location.pathname.split('/')[1];
    
      return ItemArray.indexOf(path) >= 0 ? "active" : "";
}

	
    render() {

  
	
	
        	
	const { user } = this.state;
         return (
		 
		  <div>
          <aside className="main-sidebar">
                <section className="sidebar">
                    
                    
                    <ul className="sidebar-menu" data-widget="tree">
                        <li className="header">MAIN NAVIGATION</li>
                        <li>
                            <Link to="/">
                                <i className="fa fa-dashboard"></i>
                                <span>Dashboard</span>
                                
                            </Link>
						 </li>

            

             <li>
                            <Link to="/campaign">
                                <i className="fa fa-free-code-camp"></i>
                                <span>Campaigns</span>
                                
                            </Link>
             </li>


              <li>
                            <Link to="/report-state">
                                <i className="fa fa-globe"></i>
                                <span>Geo Activity Map</span>
                                
                            </Link>
             </li>


             <li>
                            <Link to="/report">
                                <i className="fa fa-line-chart"></i>
                                <span>Analytics</span>
                                
                            </Link>
             </li>


             
					   
						
						
						
						
						
						
						
						
						

                        
						
						

						
								
						
						
						
					   
					   

                        
                    </ul>

                       
                </section>
            </aside>
		</div>	
            
        );
    }
}

export default withRouter(Sidebar);
