import React, { Component } from "react";
import store from 'store';
import Header from './Header';
import { Redirect } from 'react-router-dom';
//import CKEditor from "react-ckeditor-component";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; 


const editorConfiguration = {
  plugins: [ Essentials, Bold, Italic, Paragraph ],
  toolbar: [ 'bold', 'italic' ]
};


class Ckeditor extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            content: 'content',
        }
		
		
    }
 
   /* updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }
    
    onChange(evt){
      console.log("onChange fired with event info: ", evt);
      var newContent = evt.editor.getData();
	 
      this.setState({
        content: newContent
      })
    }
    
    onBlur(evt){
      console.log("onBlur event called with event info: ", evt);
    }
    
    afterPaste(evt){
      console.log("afterPaste event called with event info: ", evt);
    }
 */
 
 
 
    render() {
		
	
		
        return (
            <div>
			 <CKEditor
                    editor={ ClassicEditor }
					config={ editorConfiguration }
                    data="<p>Hello from CKEditor 5!</p>"
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ editor => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ editor => {
                        console.log( 'Focus.', editor );
                    } }
                />
			
			
			
			</div> 
			
			
			 
			 
        )
    }
}

export default Ckeditor;