// import {csvUrl, mapUrl,useData,useMap,SymbolMap,Tooltip,SymmetricAreaChart,SymmetricBarChart} from './modules/functions.js';

const csvUrl = 'https://gist.githubusercontent.com/hogwild/3b9aa737bde61dcb4dfa60cde8046e04/raw/citibike2020.csv';
const mapUrl = "https://gist.githubusercontent.com/hogwild/6784f0d85e8837b9926c184c65ca8ed0/raw/2040d6883cf822817e34b5bda885348ec6214572/jerseyCity_geojson.json";

function useData(csvUrl){

}

function useMap(jsonPath) {
 
}
 function Maps(props) {
     // use hook: selectedc, time
     // this function displays the whole map
   
   
}

function Tooltip(props) {
    // uses hook: selectedc
 
}
 function LineChart(props) {
     //uses hook: selectedc

}
 function ParallelChart(props) {
     //uses hook: selectedc, selectedcs, 

}



const CitiBike = () => {
    
    //the time on the slider 
    //  link the : map 
    //  controlled by : slider
    const [time, setTime] = React.useState('');

    //continent selected
    //  controlled by: the dropdown
    //  linked with: parrallel chart
    const [continent,setContinent]= React.useState('');

    //One specific country
    //  controlled by: country dropdown , click event in the map
    //  linked with: linechart and tooltip, and parrallel chart
    const [selectedc, setSelectedc] = React.useState(null);

    //a list of countries - （used to compare in the parrallel chart)  
    //  controlled by : brush event in the parrallel chart, selected in the map , country drop down
    //  linked with: parrallel chart
    const [selectedcs, setSelectedcs]=React.useState(null);

    const dataAll = useData(csvUrl);
    const map = useMap(mapUrl);
    //const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (!map || !dataAll) {
            return <pre>Loading...</pre>;
        };
    const WIDTH = 1200;
    const HEIGHT = 800;
    const margin = { top: 20, right: 40, bottom: 160, left: 40, gap:40 };
    const innerWidth = WIDTH - margin.left - margin.right - margin.gap;
    const innerHeight = HEIGHT - margin.top - margin.bottom - margin.gap;
    const data = dataAll.filter( d => {
        return d.month === MONTH[month];
    });
    const maxnum=d3.max(data, d => d.start);

    // Note: stationYearData is the data of the year of a seleted station. 
    const stationYearData = dataAll.filter( d=> {
        return d.station == selectedStation;
    }); 

    //////handler:
    //1. change month
    const changeHandler = (event) => {
        setMonth(event.target.value);
    }
    //2. change selectedpoint
    

    //pass in selected Point
    const selectedPoint = dataAll.filter(d => d.station===selectedStation)[0];
    
    
    return <div>
        <div>
            <input key="slider" type='range' min='0' max='11' value={month} step='1' onChange={changeHandler}/>
            <input key="monthText" type="text" value={MONTH[month]} readOnly/>
        </div>
            <svg width={WIDTH} height={HEIGHT}>
                <g>
 
                </g>
        
            </svg>
        <div style={{position: "absolute", textAlign: "left", width: "240px",left:"40px", top:"40px"}}>
            <h3>Citi bike 2020</h3>
            <p>A visualization of the numbers of citi bike riders over 2020.</p>
        </div>
        
    </div>
}
ReactDOM.render( <CitiBike />, document.getElementById('root'));

