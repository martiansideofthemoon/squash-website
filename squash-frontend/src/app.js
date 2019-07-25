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
    Table,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
    FormText
} from 'reactstrap';
import SquashForest from './forest.js';
import RequestForm from './request_form.js';
import SERVER_URL from './url.js';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet'
import Toggle from 'react-toggle'


ReactGA.initialize('UA-144025713-1');

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
                    Your document is being processed. The status will auto-refresh every 5 seconds, It typically takes about 3-6 seconds per paragraph.
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
                    Your document is in the queue, {props.queue_number - 1} document(s) before you. The status will auto-refresh every 5 seconds.
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
                'spec_frac': 0.5
            },
            ans_mode: 'original',
            forest: null,
            queue_number: null,
            input_text: null,
            status: null,
            expanded: null,
            dropdownOpen: false
        };
    }

    getSquashedDocument() {
        if (this.state.squashId && this.state.queue_number !== 0) {
            var url = SERVER_URL + "/get_squash?id=" + this.state.squashId

            fetch(url).then(res => res.json()).then((result) => {
                if (result.input_text) {
                    document.getElementById("squashInputText").value = result.input_text
                }
                var expanded = null;
                if (result.squash_data != null) {
                    expanded = result.squash_data.qa_tree.map((para, para_index) => para.binned_qas.map((qa_tree, qa_index) => false));
                }
                this.setState({
                    forest: result.squash_data,
                    queue_number: result.queue_number,
                    settings: {
                        'top_p': result.settings.top_p,
                        'gen_frac': result.settings.gen_frac,
                        'spec_frac': result.settings.spec_frac
                    },
                    status: result.status,
                    expanded: expanded
                });

            }, (error) => {
                console.log(error)
            })
        }
    }

    componentDidMount() {
        this.getSquashedDocument.bind(this)();
        ReactGA.pageview(window.location.pathname + window.location.search);
        this.interval = setInterval(this.getSquashedDocument.bind(this), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    changeSlider(e, type) {
        var new_settings = this.state.settings;
        new_settings[type] = e.target.value;
        this.setState({settings: new_settings});
    }

    toggleSpecific(para_index, qa_index) {
        var new_expanded = this.state.expanded;
        new_expanded[para_index][qa_index] = !this.state.expanded[para_index][qa_index]
        this.setState({
            expanded: new_expanded
        });
    }

    toggleAnswerMode() {
        this.setState({
            ans_mode: (this.state.ans_mode === 'original' ? 'predicted' : 'original')
        });
    }

      toggleDropDown() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
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
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>SQUASH!</title>
                </Helmet>
                <Row>
                    <Col md={{order: 2, size: 5}} xs={{order: 1}}>
                        <h5>A demo for <a href="https://arxiv.org/abs/1906.02622">Generating Question-Answer Hierarchies</a></h5>
                        <p>This system converts a sequence of paragraphs into a hierarchy of question-answer pairs, determined by the specificity of the questions.
                         Check out our <a href="http://squash.cs.umass.edu/">landing page</a> for more details.
                         Feel free to fork and use the <a href="https://github.com/martiansideofthemoon/squash-website">source code</a> for this demo.</p>

                    </Col>
                    <Col md={{order: 2, size: 7}} xs={{order: 2}}>
                        {
                        squash_loaded &&
                        <div className="switch-answer-div">
                            <hr />
                            <div className="toggle-div">
                                <div className="toggle-sub-div">
                                    <span>Original Answers</span>
                                </div>
                                <div className="toggle-sub-div">
                                    <Toggle defaultChecked={this.state.ans_mode === 'predicted'} icons={false} onChange={() => this.toggleAnswerMode()} />
                                </div>
                                <div className="toggle-sub-div">
                                    <span>Predicted Answers</span>
                                </div>
                                <br />
                            </div>
                            <div>
                            <FormText>When set to "Original Answers", the answers to the questions are the inputs
                            supplied to the question generation module. When set to "Predicted Answers", the answers are the
                            outputs of a BERT-based question answering module on our generated questions. </FormText>
                            </div>
                            <hr />
                        </div>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col md={{order: 2, size: 5}} xs={{order: 2}}>

                    <div>
                      <Dropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggleDropDown()}>
                        <DropdownToggle color="info" caret>
                          Choose pre-computed example
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem tag="a" href="/?id=04bf8a42f934944809e76ec1">Cricket</DropdownItem>
                          <DropdownItem tag="a" href="/?id=848af1edf495207591a26421">The Fellowship of the Ring</DropdownItem>
                          <DropdownItem tag="a" href="/?id=e3aa9319ffb32bc53162ba78">Walt Disney</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>

                        <hr />

                    <RequestForm
                        forest={this.state.forest}
                        settings={this.state.settings}
                        changeSliderTopP={(e) => this.changeSlider(e, 'top_p')}
                        changeSliderGenFrac={(e) => this.changeSlider(e, 'gen_frac')}
                        changeSliderSpecFrac={(e) => this.changeSlider(e, 'spec_frac')}
                        squashDoc={() => this.squashDoc()}
                    />
                    </div>
                    </Col>
                    <Col md={{order: 2, size: 7}} xs={{order: 1}}>
                        {squash_loaded && <SquashForest forest={this.state.forest}
                                                        ans_mode={this.state.ans_mode}
                                                        toggleAnswerMode={() => this.toggleAnswerMode()}
                                                        toggleSpecific={(para_index, qa_index) => this.toggleSpecific(para_index, qa_index)}
                                                        expanded={this.state.expanded}/>}
                        {this.state.queue_number !== null && this.state.queue_number !== 0 && <QueueNumber queue_number={this.state.queue_number} status={this.state.status}/>}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SquashDemo;