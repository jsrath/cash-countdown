import React, { Component } from 'react';
import { Button, Card, Container, Fa, Row } from 'mdbreact';
import { LineChart } from 'react-d3-components';

class Inputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthsLeft: '',
      daysLeft: '',
      exiry: '',
      total: '',
      spend: '',
      graph: false,
      data: [{ key: 'Cash', values: [] }],
    };
  }

  handleResize = () => {
    const width = document.querySelector('.mainCard').getBoundingClientRect().width;
    this.setState({ width });
  };

  updateTime = () => {
    if (this.state.total && this.state.spend) {
      const months = Math.round((this.state.total / this.state.spend) * 10) / 10;
      this.setState({ monthsLeft: months });
      this.setState({ daysLeft: months * 30 }, () => this.updateExpiry());
    }
  };

  updateExpiry = () => {
    let today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    today.setDate(today.getDate() + this.state.daysLeft);
    today = today.toLocaleDateString('en-GB', options);
    this.setState({ expiry: today });
  };

  updateTotal = event => {
    if (!isNaN(event.target.value)) {
      const numeric = Number(event.target.value);
      this.setState({ total: numeric }, () => this.updateTime());
    }
  };

  updateSpend = event => {
    if (!isNaN(event.target.value)) {
      const numeric = Number(event.target.value);
      this.setState({ spend: numeric }, () => this.updateTime());
    }
  };

  showGraph = () => {
    const updatedValues = [];
    let total = this.state.total;
    const cashIncrement = this.state.total / 50;
    const timeIncrement = this.state.daysLeft / 50;

    for (let i = 1; i <= 50; i++) {
      total = total - cashIncrement;
      let date = new Date().setDate(new Date().getDate() + timeIncrement * i);
      date = new Date(date);
      updatedValues.push({ x: date, y: total });
    }
    this.setState({ data: [{ key: 'Cash', values: updatedValues }], graph: true });
  };

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const tooltipLine = (label, data) => {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return `${data.x.toLocaleDateString('en-GB', options)} \r\n ${parseInt(data.y).toLocaleString()}`;
    };
    return (
      <div className="Inputs">
        <Container className="m-auto p-5">
          <Card className="mb-5 mainCard">
            <h3 className="title">
              Cash Countdown
              <Fa className="title-icon" icon="money" />
            </h3>
            <span className="heading">
              <h5 className="d-inline w-25">Inputs</h5>
            </span>
            <Row className="mt-4">
              <div className="col-sm-4 value">
                <p className="input-label">Current Cash on Hand</p>
                <div className="input-container">
                  <Fa icon="money" />
                  <input className="my-2 w-100" type="text" value={this.state.total} onChange={this.updateTotal} />
                </div>
              </div>
              <div className="col-sm-4 spend">
                <p className="input-label">Monthly Spending</p>
                <div className="input-container">
                  <Fa icon="share-square-o" />
                  <input className="my-2 w-100" type="text" value={this.state.spend} onChange={this.updateSpend} />
                </div>
              </div>
            </Row>

            <span className="heading">
              <h5 className="d-inline w-25">Results</h5>
            </span>

            <Row className="my-4">
              <div className="col-sm-4">
                <p className="result-label">Months Left</p>
                <div className="input-container">
                  <Fa icon="calendar" />
                  <p className="result-box w-100">{this.state.monthsLeft}</p>
                </div>
              </div>
              <div className="col-sm-4">
                <p className="result-label">Days Left</p>
                <div className="input-container">
                  <Fa icon="calendar-o" />
                  <p className="result-box w-100">{this.state.daysLeft}</p>
                </div>
              </div>
              <div className="col-sm-4">
                <p className="result-label">Cash Runs Out</p>
                <div className="input-container">
                  <Fa icon="calendar-times-o" />
                  <p className="result-box w-100">{this.state.expiry}</p>
                </div>
              </div>
            </Row>
            <span onClick={this.showGraph} className="heading clickable mb-5">
              <h5 className="d-inline w-25">Show Graph</h5>
            </span>
            {this.state.graph ? (
              <div className="chart w-100">
                <LineChart
                  data={this.state.data}
                  width={this.state.width}
                  height={400}
                  margin={{ top: 10, bottom: 60, left: 80, right: 40 }}
                  tooltipHtml={tooltipLine}
                  tooltipOffset={{ top: -70, left: 0 }}
                  xAxis={{ innerTickSize: 6, label: 'Time' }}
                  yAxis={{ label: 'Cash' }}
                  stroke={{ strokeDasharray: '5', strokeWidth: '2' }}
                />
              </div>
            ) : null}
          </Card>
        </Container>
      </div>
    );
  }
}

export default Inputs;
