import React, { Component } from 'react';
import { Card, Container, Fa, Row } from 'mdbreact';
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
      income: '',
      graph: false,
      data: [{ key: 'Cash', values: [] }],
    };
  }

  handleResize = () => {
    const width = document.querySelector('.mainCard').getBoundingClientRect().width;
    this.setState({ width });
  };

  updateTime = () => {
    if (this.state.total && this.state.spend && this.state.income) {
      const months = Math.round((this.state.total / (this.state.spend - this.state.income)) * 10) / 10;
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
    event.target.value = Number(event.target.value.split(',').join(''));
    if (!isNaN(event.target.value)) {
      const numeric = Number(event.target.value);
      this.setState({ total: numeric }, () => this.updateTime());
    }
  };

  updateSpend = event => {
    event.target.value = Number(event.target.value.split(',').join(''));
    if (!isNaN(event.target.value)) {
      const numeric = Number(event.target.value);
      this.setState({ spend: numeric }, () => this.updateTime());
    }
  };

  updateIncome = event => {
    event.target.value = Number(event.target.value.split(',').join(''));
    if (!isNaN(event.target.value)) {
      const numeric = Number(event.target.value);
      this.setState({ income: numeric }, () => this.updateTime());
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
        <Container className="m-auto p-5 container-fluid">
          <Card className="mb-5 mainCard">
            <h3 className="title">
              Cash Countdown
              <Fa className="title-icon" icon="money" />
            </h3>
            <span className="heading heading-inputs">
              <h5 className="d-inline w-25">Inputs</h5>
            </span>
            <Row className="mt-4">
              <div className="col-lg-4 value">
                <p className="input-label">Current Cash on Hand</p>
                <div className="input-container">
                  <Fa icon="money" />
                  <input className="my-2 w-100" type="text" value={this.state.total.toLocaleString()} onChange={this.updateTotal} />
                </div>
              </div>
              <div className="col-lg-4 spend">
                <p className="input-label">Monthly Spending</p>
                <div className="input-container">
                  <Fa icon="share-square-o" />
                  <input className="my-2 w-100" type="text" value={this.state.spend.toLocaleString()} onChange={this.updateSpend} />
                </div>
              </div>
              <div className="col-lg-4 income">
                <p className="input-label">Monthly Income</p>
                <div className="input-container">
                  <Fa icon="sign-in" />
                  <input className="my-2 w-100" type="text" value={this.state.income.toLocaleString()} onChange={this.updateIncome} />
                </div>
              </div>
            </Row>

            <span className="heading result-color">
              <h5 className="d-inline w-25">Results</h5>
            </span>

            <Row className="my-4">
              <div className="col-lg-4">
                <p className="result-label">Months Left</p>
                <div className="input-container">
                  <Fa icon="calendar" className="result-color" />
                  <p className="result-box w-100">{this.state.monthsLeft}</p>
                </div>
              </div>
              <div className="col-lg-4">
                <p className="result-label">Days Left</p>
                <div className="input-container">
                  <Fa icon="calendar-o" className="result-color" />
                  <p className="result-box w-100">{this.state.daysLeft}</p>
                </div>
              </div>
              <div className="col-lg-4">
                <p className="result-label">Cash Runs Out</p>
                <div className="input-container">
                  <Fa icon="calendar-times-o" className="result-color" />
                  <p className="result-box w-100">{this.state.expiry}</p>
                </div>
              </div>
            </Row>
            <span className="heading graph-color mb-5">
              <h5 className="d-inline w-25">Graph</h5>
            </span>
            <Row>
              <div className="col-lg-4">
                <div onClick={this.showGraph} className="graph-button">
                  Show Graph
                </div>
              </div>
            </Row>
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
                  shapeColor="#c5cae9"
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
