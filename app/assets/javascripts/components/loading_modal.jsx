import React from 'react';
import Modal from 'react-awesome-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

library.add(faSpinner);

export default class LoadingModal extends React.Component{
    constructor(props){
      super(props);
    }

    render(){
      return(
        <Modal visible={this.props.visibleModal} width="360" height="120" effect="fadeInUp" className="loading_modal">
            <div className="awesome_modal">
              <FontAwesomeIcon icon="spinner" rotation={90} spin /> Caricamento...
            </div>
        </Modal>
      )
    }
  
}