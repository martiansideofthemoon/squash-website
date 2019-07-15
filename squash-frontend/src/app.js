import React from 'react';
import {
    Badge,
    Container,
    Col,
    Row,
    Button,
    Form,
    Input,
    Card,
    Table
} from 'reactstrap';
import SquashForest from './forest.js';
import RequestForm from './request_form.js';
import SERVER_URL from './url.js';


function cellCompleted(status) {
    if (status) {
        return <td className="cell-completed">COMPLETED</td>
    } else {
        return <td className="cell-pending">PENDING</td>
    }
}

function makeTable(status) {
    return (
        <Table className="status-table">
            <thead>
                <tr>
                    <th>Step</th><th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Answer Extraction</td>{cellCompleted(status.answers_extracted)}
                </tr>
                <tr>
                    <td>Question Generation</td>{cellCompleted(status.questions_generated)}
                </tr>
                <tr>
                    <td>Answer Generation</td>{cellCompleted(status.answers_generated)}
                </tr>
                <tr>
                    <td>Question Filtering</td>{cellCompleted(status.questions_filtered)}
                </tr>
            </tbody>
        </Table>
    )
}


function QueueNumber(props) {
    var status_table = makeTable(props.status)
    if (props.queue_number === 1) {
        return (
            <div>
                <div>
                    <h5>Your document is being processed, please refresh this link after a few minutes.</h5>
                </div>
                <br />
                <div>
                    {status_table}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div>
                    <h5>Your document is in the queue, {props.queue_number - 1} document(s) before you. Please refresh this link after a few minutes.</h5>
                </div>
                <br />
                <div>
                    {status_table}
                </div>
            </div>
        )
    }
}

class SquashDemo extends React.Component {
    constructor(props) {
        super(props);
        const urlParams = new URLSearchParams(window.location.search);
        const squashId = urlParams.get('id');
        this.state = {
            squashId: squashId,
            settings: {
                'top_p': 0.9,
                'gen_frac': 0.5,
                'spec_frac': 0.8
            },
            forest: null,
            queue_number: null,
            input_text: null,
            status: null
        };
    }

    buildInputString(squash_data) {
        var elements = squash_data.qa_tree.map((para) => {return para.para_text});
        return elements.join('\n\n');
    }

    componentDidMount() {
        if (this.state.squashId) {
            var url = SERVER_URL + "/get_squash?id=" + this.state.squashId

            fetch(url).then(res => res.json()).then((result) => {
                if (result.input_text) {
                    document.getElementById("squashInputText").value = result.input_text
                }
                this.setState({
                    forest: result.squash_data,
                    queue_number: result.queue_number,
                    settings: {
                        'top_p': result.settings.top_p,
                        'gen_frac': result.settings.gen_frac,
                        'spec_frac': result.settings.spec_frac
                    },
                    status: result.status
                });

            }, (error) => {
                console.log(error)
            })
        }
    }

    changeSlider(e, type) {
        var new_settings = this.state.settings;
        new_settings[type] = e.target.value;
        this.setState({settings: new_settings});
    }

    squashDoc() {
        var url = SERVER_URL + "/request_squash";
        var flags = {
            method: 'POST',
            body: JSON.stringify({
                settings: this.state.settings,
                input_text: document.getElementById('squashInputText').value
            })
        };
        fetch(url, flags).then(res => res.json()).then((result) => {
            window.location.href = '/?id=' + result.new_id;
        }, (error) => {
            console.log(error);
        })
    }

    render() {
        var squash_loaded = false;
        if (this.state.forest != null) {
            squash_loaded = true;
        }
        return (
            <div className="container-fluid">
                <Row>
                    <Col xs="5">
                    <RequestForm
                        forest={this.state.forest}
                        settings={this.state.settings}
                        changeSliderTopP={(e) => this.changeSlider(e, 'top_p')}
                        changeSliderGenFrac={(e) => this.changeSlider(e, 'gen_frac')}
                        changeSliderSpecFrac={(e) => this.changeSlider(e, 'spec_frac')}
                        squashDoc={() => this.squashDoc()}
                    />
                    </Col>
                    <Col xs="7">
                        {squash_loaded && <SquashForest forest={this.state.forest}/>}
                        {this.state.queue_number !== null && this.state.queue_number !== 0 && <QueueNumber queue_number={this.state.queue_number} status={this.state.status}/>}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SquashDemo;