import React, { Component } from 'react';
import './App.css';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,ArcElement,
	Title,
	Tooltip,
	Legend,
  } from 'chart.js';
import { Container, Row, Col, Form, FormGroup,FormControl, OverlayTrigger, FormLabel, Button, Table } from 'react-bootstrap'
import { Line, Pie } from 'react-chartjs-2' ;

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,ArcElement,
	LineElement,
	Title,
	Tooltip,
	Legend
  );

class App extends Component {
	constructor(props){
        super(props);
        this.state = {
			ArrayToSend		:[],
		   	capDep 			:0,TraderLevel 	:"",GainRate    	:0,period      	:0,
			nbDayTrade  	:0,apport			:0,nbPerdu     	:0,nbWin       	:0,           currCap 		:0,
			message			:"Not Simulated",simulationDone	:false,datasLine		:{},datasPie		:{}
        };
        this.handleChangeCapDep     = this.handleChangeCapDep.bind(this);
		this.handleChangeTraderLevel= this.handleChangeTraderLevel.bind(this);
		this.handleChangeGainRate	= this.handleChangeGainRate.bind(this);
		this.handleChangePeriod		= this.handleChangePeriod.bind(this);
		this.handleChangeNbDayTrade	= this.handleChangeNbDayTrade.bind(this);
		this.handleChangeIntake		= this.handleChangeIntake.bind(this);
        this.LaunchSimulation       = this.LaunchSimulation.bind(this);
    }

	handleChangeCapDep(event){this.setState({capDep: event.target.value  });this.setState({currCap: event.target.value  });}
	handleChangeTraderLevel(event){this.setState({TraderLevel: event.target.value  });}
	handleChangeGainRate(event){this.setState({GainRate: event.target.value  });}
	handleChangePeriod(event){this.setState({period: event.target.value  });}
	handleChangeNbDayTrade(event){this.setState({nbDayTrade: event.target.value  });}
	handleChangeIntake(event){this.setState({apport: event.target.value  });}
	GetTraderLevel(){
		var Namedlevels = ["Bronze","Silver","Gold","Platinum","Diamond","Master","Grand Master","Challenger"];
		return (Namedlevels.indexOf(this.state.TraderLevel) + 2)/10
	}




	LaunchSimulation(){
		//MODIFICATION DES VARIABLES INTERNES A LA FONCTION 
		//POUR CREATION D'UN TABLEAU DE DONNEES 
		var arrayToSend		=[]; 				var lineArray	=[];					var	coef =0.0;
		var     currCap     =this.state.currCap;var	GainRate    =this.state.GainRate;
		var     period      =this.state.period; var	nbDayTrade  =this.state.nbDayTrade; var apportt=this.state.apport 
		var     nbPerdu     =0; 				var	nbWin       =0; 					var i=0,j=0;

		for(i=1;i<=period;i++){
			for(j=0;j <nbDayTrade;j++){
				coef = Math.random();
				if( coef < this.GetTraderLevel() ){
					currCap = Number(currCap) + Number((currCap*GainRate)/100);
					nbWin++;
					lineArray=[ "Mois #"+i , "Jour #"+j , Number(Number(currCap).toFixed(2)) , coef.toFixed(5) , "WIN" ]
				}else{
					currCap = Number(currCap) - Number((currCap*GainRate)/100);
					nbPerdu++;
					lineArray=[ "Mois #"+i , "Jour #"+j , Number(Number(currCap).toFixed(2)) , coef.toFixed(5) , "LOSS" ]
				}
				arrayToSend[arrayToSend.length]=lineArray
			}
			currCap = Number(currCap) + Number(apportt);
		}
		this.setState({ArrayToSend:arrayToSend});
		this.LineRendering(arrayToSend);
		this.PieRendering(nbWin,nbPerdu);
	}
/*********************RENDERING CHARTJS**************************/
	PieRendering(nbWin,nbLoss){
		this.setState(
		{
			simulationDone	:true,
			datasPie		:{
				labels:['Win Trades','Loss Trades'],
				datasets:[
					{
						label:'Win Loss Repartition',
						data:[nbWin,nbLoss],
						borderColor:["wheat"],
						backgroundColor:["cyan","red"]
					}
				]
			}
		});
	}

	LineRendering(ArrayReceived){
		var labelsGeneratedLine =[]; var datasGeneratedLine	=[] ; var colorBoard=[];
		labelsGeneratedLine[0]="Month #"+ 0; 
		datasGeneratedLine[0]=this.state.currCap;
		var i=0;

		for(i=1;i<=this.state.period;i++){
			labelsGeneratedLine[i]	="Month #"+i;
			var indexCurrCap=(i*this.state.nbDayTrade)-1
			datasGeneratedLine[i]	= Number(ArrayReceived[indexCurrCap][2].toFixed(2))
			if (datasGeneratedLine[i]>this.state.capDep){ colorBoard[i]="cyan"; }else{ colorBoard[i]="red"; }
		}
		this.setState(
		{
			simulationDone	:true,
			datasLine		: {
				labels : labelsGeneratedLine,
				datasets :[
						{
							label:'Capital Evolution',
							data : datasGeneratedLine,
							borderColor:"wheat",
							backgroundColor:"white"
						}
					]
			}
		});
	}

	render(){

		const lineOptions = {
			labels:{
				fontColor:"white"
			}
		}
		const pieOptions = {
			labels:{
				fontColor:"white"
			}
		}

		return (
			<Container className="">
				<Row className="justify-content-center" style={{textAlign:"center"}}>
						<h1>Gain Potential V 1.0</h1>
						<p>Projections of Gains related to your Own trading level.</p>
				</Row>
				<Row className="justify-content-center parallax">
					<Col className="" md="4">
						<h1>Settings</h1>
						<Form>
							<FormGroup controlId="simulationNumbers" >
								<p>
									<OverlayTrigger placement="right" overlay={<p style={{background:"wheat",color:"black"}}>How much Starting capital<br/> You want to invest?</p>}>
										<FormControl type="number" step="50" min="0" value={this.state.capDep} onChange={this.handleChangeCapDep} placeholder="Starting Capital" /> 
									</OverlayTrigger>
									
								</p>
								<p>
									<OverlayTrigger placement="right" overlay={<p style={{background:"wheat",color:"black"}}>How much of the capital<br/> each day you want to win or lose?</p>}>
										<FormControl value={this.state.GainRate} min="0" onChange={this.handleChangeGainRate} type="number"  placeholder="Money Management" /> 
									</OverlayTrigger>
								</p>
								<p>
									  <OverlayTrigger placement="right" overlay={<p style={{background:"wheat",color:"black"}}>On hom many months do you want <br/>the simulation to run?</p>}>
										<FormControl type="number" min="0" value={this.state.period} onChange={this.handleChangePeriod} max={24} placeholder="Simulation Period" /> 
									</OverlayTrigger>
								</p>
								<p>
									  <OverlayTrigger placement="right" overlay={
										<p style={{background:"wheat",color:"black"}}> 
											Bronze Win about 20% of your trades<br/>
											Silver Win about 30% of your trades<br/>
											Gold Win about 40% of your trades<br/>
											Platinum Win about 50% of your trades<br/>
											Diamond Win about 60% of your trades<br/>
											Master Win about 70% of your trades<br/>
											Grand Master Win about 80% of your trades<br/>
											Challenger Win about 90% of your trades<br/>
										</p>}>
										<FormControl as="select" value={this.state.TraderLevel} onChange={this.handleChangeTraderLevel} placeholder="Your Trader Level">
											<option>Bronze</option>
											<option>Silver</option>
											<option>Gold</option>
											<option>Platinum</option>
											<option>Diamond</option>
											<option>Master</option>
											<option>Grand Master</option>
											<option>Challenger</option>
										</FormControl>
									</OverlayTrigger>
								</p>
								<p className="card" style={{textAlign:"center",color:"black"}}>
									<FormLabel id="RangeValue">Number of trading days in the month : {this.state.nbDayTrade} </FormLabel>
									  <OverlayTrigger placement="right" overlay={<p style={{background:"wheat",color:"black"}}>Lets Go with 20 days max as Markets are closed the week-ends</p>}>
										<FormControl value={this.state.nbDayTrade} style={{background:"wheat"}} onChange={this.handleChangeNbDayTrade} type="range" min="0" max="20" placeholder="Simulation Period" /> 
									</OverlayTrigger>
								</p>
								<p className="">
									<OverlayTrigger placement="right" overlay={<p style={{background:"wheat",color:"black"}}>Do you Add to your Capital Monthly From <br/> other income Source in your Trading Capital?</p>}>
										<FormControl type="number" min="0" value={this.state.apport} onChange={this.handleChangeIntake} step="50" placeholder="Mensual Intake" /> 
									</OverlayTrigger>
								</p>
								<p>
									<Button onClick={this.LaunchSimulation} >Simulate</Button> 
								</p>
							</FormGroup>
						</Form>
					</Col>
					<Col className="" md="8">
						<h1 style={{textAlign:"center"}}>
							Simulation
						</h1>
						<Row>
							<Col>
								{
									this.state.simulationDone ? <Line options={lineOptions} data={this.state.datasLine} /> : ""
								}								
							</Col>
						</Row>
						<Row>
							<Col>	
									{
									this.state.simulationDone ? <Pie options={pieOptions} data={this.state.datasPie} /> : ""
									}	
								
							</Col>
						</Row>
					</Col>
				</Row>
				{
					this.state.simulationDone ? 
					<Row className="justify-content-center">
						<Col md={12}><h1 style={{textAlign:"center",color:"wheat"}}>Simulation Day by Day</h1></Col>
						<Table striped bordered hover variant>
							<tr style={{color:"wheat"}}><td>N° Day Traded</td><td>Month</td><td>Current Capital $</td> <td>Probability</td> <td> Win or Loss </td>  </tr>
							{
								this.state.ArrayToSend.map( (tuple,index) => 
									(	tuple[4]==="WIN" ?
											index%this.state.nbDayTrade===0?
												<tr className="bg-light" style={{color:"blue"}}>
													<td>Jour #{ index+1 }</td>
													<td>{tuple[0]}</td>
													<td>{tuple[2]}</td>
													<td>{tuple[3]}</td>
													<td>{tuple[4]}</td>
												</tr>
											:
												<tr className="primary" style={{color:"blue"}}>
													<td>Jour #{ index+1 }</td>
													<td>{tuple[0]}</td>
													<td>{tuple[2]}</td>
													<td>{tuple[3]}</td>
													<td>{tuple[4]}</td>
												</tr>
										:	
											index%this.state.nbDayTrade===0?
												<tr className="bg-light" style={{color:"red"}}>
													<td>Jour #{ index+1 }</td>
													<td>{tuple[0]}</td>
													<td>{tuple[2]}</td>
													<td>{tuple[3]}</td>
													<td>{tuple[4]}</td>
												</tr>
											:
												<tr className="primary" style={{color:"red"}}>
													<td>Jour #{ index+1 }</td>
													<td>{tuple[0]}</td>
													<td>{tuple[2]}</td>
													<td>{tuple[3]}</td>
													<td>{tuple[4]}</td>
												</tr>
									)
								)
							}
						</Table>
					</Row>
					: ""
				}
				<div class="py-3 bg-dark text-white">
					<div class="row">
						<div class="col-md-4 offset-md-1 text-center text-md-left">
							<p class="mb-0">Copyright &copy; AggelosQubit { new Date().getFullYear() }</p>
						</div>
						<div class="col-md-2 text-center text-md-right">
							<a href="https://github.com/AggelosQubit" class="text-white" >
								<i class="fab fa-github mr-2"></i>GitHub
							</a>
						</div>
						<div class="col-md-2 text-center text-md-right">
							<a href="https://drum.io/aggelosqubit" class="text-white">
								<i class="fab fa-github mr-2"></i> Drum Page
							</a>
						</div>
						<div class="col-md-2 text-center text-md-right">
							<a href="https://www.instagram.com/theintrovertedprogrammer/" class="text-white" >
								<i class="fab fa-github mr-2"></i>Instagram
							</a>
						</div>
					</div>
				</div>
			</Container>
		);
	}
}

export default App;