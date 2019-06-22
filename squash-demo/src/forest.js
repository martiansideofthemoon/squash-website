import React from 'react';
import {
    Badge,
    Container,
    Col,
    Row
} from 'reactstrap';

function SpecificQA(props) {
    return (
        <Row>
            <Col xs="2"></Col>
            <Col xs="10">
                <div className='specific-qa-view'>
                    <p className='specific-qa-text'>
                        <span className='specific-question'><b>{'SQ: ' + props.specific_qa.question}</b></span><br/>
                        <span className='specific-answer'>{'SA-orig: ' + props.specific_qa.answers[0].text}</span><br/>
                        <span className='specific-answer'>{'SA-pred: ' + props.specific_qa.predicted_answer}</span>
                    </p>
                </div>
            </Col>
        </Row>
    );
}

function QATree(props) {
    const specific_list = props.qa_tree.children.map((specific_qa, index) => {
        return <SpecificQA specific_qa={specific_qa} key={specific_qa.id} />
    })

    return (
        <div>
        <Row>
            <Col xs="1"></Col>
            <Col xs="11">
                <div className='general-qa-view'>
                    <p className='general-qa-text'>
                        <span className='general-question'><b>{'GQ: ' + props.qa_tree.question}</b></span><br/>
                        <span className='general-answer'>{'GA-orig: ' + props.qa_tree.answers[0].text}</span><br/>
                        <span className='general-answer'>{'GA-pred: ' + props.qa_tree.predicted_answer}</span>
                    </p>
                </div>
            </Col>
        </Row>
        {specific_list}
        </div>
    );
}

function ParagraphForest(props) {
    const qa_list = props.para_forest.binned_qas.map(qa_tree => {
        return <QATree qa_tree={qa_tree} key={qa_tree.id}/>
    })
    return (
        <div className='para-view'>
            <div className='para-text-div'>
                <p className='para-text'>{props.para_forest.para_text}</p>
            </div>
            <div className="para-forest">{qa_list}</div>
            <br />
        </div>
    );
}

function SquashForest(props) {
    const para_list = props.forest.qa_tree.map((para, index) => {
        return <ParagraphForest para_forest={para} key={'para_num_' + index} />
    })
    return (
        <div className="squash-forest">{para_list}</div>
    );
}

export default SquashForest;