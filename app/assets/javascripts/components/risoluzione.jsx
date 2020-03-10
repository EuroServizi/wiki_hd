import React from 'react';
import { Form, FormControl, FormGroup, Checkbox, Button, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';

export default class Risoluzione extends React.Component {
  
    

    constructor(props){
        super(props);
        // this.state = {
        //     'nuovaRisoluzione': {
        //         'problematica': '',
        //         'testo_soluzione': '',
        //         'tags': ''
        //         //tags: [] da fare, creare array
        //     }
        // }
        this.state = {
            selectedOption: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
        this.handleChangeMulti = this.handleChangeMulti.bind(this);
                
        
    }

    /* Per react select con creazione di nuovi valori vedi */
    /* https://react-select.com/creatable */

    handleChange = selected_option => {
        this.setState({ selectedOption: selected_option });
        console.log("setto valore con handleChange: "+selected_option.label);
    };


    handleChangeMulti = (newValue: any, actionMeta: any) => {
        console.log("setto valore con handleChangeMulti: "+newValue);
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
      };

    handleSubmit(event) {
        event.preventDefault();
        //in event.target.nomecampo.value ho il valore da usare
        console.log(event.target.problematica.value);
        console.log(event.target.testo_soluzione.value);
        let tags = [];
        if(event.target.tags.length > 0){
            event.target.tags.forEach(element => {
                tags.push(element.value);
            });
        }
        console.log(tags);
       
        let axiosConfig = {
            headers: {
                //'Content-Type': 'application/json',
                'Content-Type': 'application/json',
                'Accept': 'application/json', //fa vedere a rails che e' una richiesta json!
            },
            responseType: 'json'
        };
        let postData = {
            'problematica': event.target.problematica.value,
            'testo_soluzione': event.target.testo_soluzione.value,
            'tags': tags,
            'applicazione': event.target.applicazione.value
        }
        
        //passo il csrf al controller rails che lo vuole in POST
        var csrf_key = $("meta[name='csrf-param']").attr('content');
        var csrf_val = $("meta[name='csrf-token']").attr('content');
        postData[csrf_key] = csrf_val;
        console.log(JSON.stringify(postData));
        axios.post('salva_risoluzione',postData,axiosConfig).then(create_res => {
            console.log("Creata nuova Risoluzione:", create_res);
            this.props.setMain(true,false,true);
        }).catch(err =>{
            alert(err);
        });
        
    }
  
    


    render (selectProps) {
        const selected_option = this.state.selectedOption;

        const colourOptions = [
            { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
            { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
            { value: 'purple', label: 'Purple', color: '#5243AA' },
            { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
            { value: 'orange', label: 'Orange', color: '#FF8B00' },
            { value: 'yellow', label: 'Yellow', color: '#FFC400' },
            { value: 'green', label: 'Green', color: '#36B37E' },
            { value: 'forest', label: 'Forest', color: '#00875A' },
            { value: 'slate', label: 'Slate', color: '#253858' },
            { value: 'silver', label: 'Silver', color: '#666666' },
          ];

        return (
            <Form onSubmit={this.handleSubmit} horizontal>
                <FormGroup controlId="problematica">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Problematica
                    </Col>
                    <Col sm={10} lg={8}>
                        <FormControl type="text" name="problematica" placeholder="Segnalazione/Problema" />
                    </Col>
                </FormGroup>
                <FormGroup controlId="testo_soluzione">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Info Soluzione
                    </Col>
                    <Col lg={8}>
                        <FormControl componentClass="textarea" name="testo_soluzione" placeholder="Testo"></FormControl>
                    </Col>
                </FormGroup>
                {/* <FormGroup controlId="tags">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Tags
                    </Col>
                    <Col sm={10} lg={8}>
                        <FormControl type="text" name="tags" placeholder="Tag1, Tag2..." />
                    </Col>
                </FormGroup> */}
                <FormGroup controlId="tags">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Tags
                    </Col>
                    <Col lg={8}>
                    <CreatableSelect
                        name='tags'
                        isMulti
                        onChange={this.handleChangeMulti}
                        options={colourOptions}
                    />
                    </Col>
                </FormGroup>

                <FormGroup controlId="applicazione">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Applicazione
                    </Col>
                    <Col lg={8}>
                    <Select
                        name='applicazione'
                        value={selected_option}
                        onChange={this.handleChange}
                        options={this.props.applicazioni}
                    />
                    </Col>
                </FormGroup>
                


                

                <br />
                <FormGroup>
                    <Col smOffset={1} sm={10} lg={1}>
                        <Button type="submit" >Salva</Button>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}