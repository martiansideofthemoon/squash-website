import React from 'react';
import {
    Badge,
    Container,
    Col,
    Input,
    Form,
    FormText,
    Button,
    Row
} from 'reactstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';

function RequestForm(props) {
    // Build a default text object for the text area

    return (
        <Form>
            top-p sampling value = {props.settings.top_p} <br/> <ReactBootstrapSlider
                value={props.settings.top_p}
                change={props.changeSliderTopP}
                id="top-p-slider"
                step={0.01}
                max={1.0}
                min={0.0}
                orientation="horizontal"/>
            <br />
            fraction of general questions retained = {props.settings.gen_frac} <br/> <ReactBootstrapSlider
                value={props.settings.gen_frac}
                change={props.changeSliderGenFrac}
                id="general-slider"
                step={0.01}
                max={1.0}
                min={0.0}
                orientation="horizontal"/>
            <br />
            fraction of specific questions retained = {props.settings.spec_frac} <br/> <ReactBootstrapSlider
                value={props.settings.spec_frac}
                change={props.changeSliderSpecFrac}
                id="specific-slider"
                step={0.01}
                max={1.0}
                min={0.0}
                orientation="horizontal"/>
            <br />
            Enter input text
            <FormText>(Note - Separate paragraphs with newline characters. Do not insert any sensitive information.)</FormText>
            <Input type="textarea" name="text" id="squashInputText" rows="10" /> <br />
            <Button color="primary"  onClick={props.squashDoc}><span className="squashtitleemph">SQUASH</span></Button>
        </Form>
    );
}

export default RequestForm;