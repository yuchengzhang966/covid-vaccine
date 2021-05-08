// import {csvUrl, mapUrl,useData,useMap,SymbolMap,Tooltip,SymmetricAreaChart,SymmetricBarChart} from './modules/functions.js';
const csv1 = "https://raw.githubusercontent.com/jane-yucheng/covid-vaccine/main/dataset/covid1.csv";
const csv2 = "https://raw.githubusercontent.com/jane-yucheng/covid-vaccine/main/dataset/covid2.csv"
//const mapUrl = "https://gist.githubusercontent.com/hogwild/6784f0d85e8837b9926c184c65ca8ed0/raw/2040d6883cf822817e34b5bda885348ec6214572/jerseyCity_geojson.json";
const csvUrl = "https://raw.githubusercontent.com/jane-yucheng/covid-vaccine/main/dataset/covid1.csv";
// const mapUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";
const mapUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
const isoCode = "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.csv";

//////use Data
function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        d3.json(mapUrl).then(topoJsonData => {
            setData(
                topojson.feature(topoJsonData, topoJsonData.objects.countries),
              )});
    }, []);
    return data; 
}

function useData1(csv1) {
    const [data1, setData] = React.useState(null);
    React.useEffect(() => {
        d3.csv(csv1).then(data => {
            data.forEach(d => {
                d.total_cases_per_million = + d.total_cases_per_million;
                d.total_vaccinations_per_hundred = + d.total_vaccinations_per_hundred;
                d.month = + d.month;
            });
            setData(data);
        });
    }, []);
    return data1;
}

function useData2(csv2) {
    const [data2, setData2] = React.useState(null);
    React.useEffect(() => {
        d3.csv(csv2).then(data => {
            data.forEach(d => {
                d.population_density = + d.population_density;
                d.median_age = + d.median_age;
                d.aged_65_older = + d.aged_65_older;
                d.gdp_per_capita = + d.gdp_per_capita;
                d.extreme_poverty = + d.extreme_poverty;
                d.cardiovasc_death_rate = + d.cardiovasc_death_rate;
                d.female_smokers = + d.female_smokers;
                d.handwashing_facilities = + d.handwashing_facilities;
                d.male_smokers = + d.male_smokers;

            });
            setData2(data);
        });
    }, []);
    return data2;
}

function useData(csvPath1, csvPath2){
    const [dataAll, setData] = React.useState([]);
    React.useEffect(() => {
        Promise.all([d3.csv(csvPath1), d3.csv(csvPath2)]).then(datasets => {
            datasets[0].forEach(d => {
                d.total_cases_per_million = + d.total_cases_per_million;
                d.total_vaccinations_per_hundred = + d.total_vaccinations_per_hundred;
                d.new_cases_per_million = + d.new_cases_per_million;
                d.stringency_index = + d.stringency_index;
                d.cases_growth_rate = d.new_cases_per_million/d.total_cases_per_million;
                d.time = new Date(d.month+'/1/'+d.year);
                const match = datasets[1].filter(entry=> entry['alpha-3'] === d.iso_code);
                if(match[0]){
                    d.iso_numeric = match[0]['country-code'];
                }
          
            });

            setData({dataset1:datasets[0], dataset2:datasets[1]});
        });
    }, []);
    return dataAll;}

function Y(props) {
    const { dim, yScale, height } = props;
    var ticks = yScale.ticks();
    var dim1 = dim.replace(/[\W_]/g, ' ')
    if(dim=="population_density"){
        ticks=yScale.ticks([5])
    }
    if (dim1.length > 20) {
        var array = dim1.split(' ');
        var s1;
        var s2;
        s1 = array.slice(0, array.length / 2)
        s2 = array.slice(array.length / 2)
        s1 = s1.join(' ')
        s2 = s2.join(' ')
        return <g>
            <g transform={`translate(30, -10)`}>
                <text style={{ textAnchor: 'middle', fontSize: '14px', fontFamily: "Verdana" }} transform={`translate(-30, -10)`}>
                    {s1}
                </text>
                <g transform={`translate(0, 15)`}>
                    <text style={{ textAnchor: 'middle', fontSize: '14px', fontFamily: "Verdana" }} transform={`translate(-30, -10)`}>
                        {s2}
                    </text>
                </g>
            </g>
            <g transform={`translate(0, 10)`}>
                <line y2={height} stroke={`black`} />
                {ticks.map(tickValue => {
                    return <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                        <line x2={10} stroke={"black"} />
                        <text style={{ textAnchor: 'end', fontSize: '12px' }}>
                            {tickValue = (tickValue == 0) ? 'undefined' : tickValue}
                        </text>
                    </g>
                })}
            </g>
        </g>
    }
    return <g>
        <g transform={`translate(30, -10)`}>
            <text style={{ textAnchor: 'middle', fontSize: '14px', fontFamily: "Verdana" }} transform={`translate(-30, -10)`}>
                {dim1}
            </text>
        </g>
        <g transform={`translate(0, 10)`}>
            <line y2={height} stroke={`black`} />
            {ticks.map(tickValue => {
                return <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                    <line x2={10} stroke={"black"} />
                    <text style={{ textAnchor: 'end', fontSize: '12px' }}>
                        {tickValue = (tickValue == 0) ? 'undefined' : tickValue}
                    </text>
                </g>
            })}
        </g>
    </g>
}
var pointArray = {}

function X(props) {
    const { country,data, dim_array, dimensions, gap,selectedCountry, setSelectedCountry,dd } = props;
    //this function generate the lines and red points
    var one=countrydata.filter(c => c["iso_code"] ==country)
    var c=one[0]["iso_numeric"]
//what is countrydata?
//array: 
//"": "0"
// cases_growth_rate: 1
// continent: "Asia"
// iso_code: "AFG"
// iso_numeric: "004"
// location: "Afghanistan"
// month: "2"
// new_cases_per_million: 0.026
// new_deaths_per_million: ""
// new_tests_per_thousand: ""
// people_vaccinated: ""
// people_vaccinated_per_hundred: ""
// positive_rate: ""
// stringency_index: "8.33"
// tests_units: ""
// time: Sat Feb 01 2020 00:00:00 GMT+0800 (China Standard Time) {}
// total_cases: "1.0"
// total_cases_per_million: 0.026
// total_deaths: ""
// total_deaths_per_million: ""
// total_tests: ""
// total_tests_per_thousand: ""
// total_vaccinations: ""
// total_vaccinations_per_hundred: 0
// year: "2020"
    pointArray = {}
    function color(country){
        if(dd==true){return "red"}if (country == selectedCountry){return "black"}else{return "#CECECE"}}
    function stroke(country){
         if(dd==true){return "3px"}   if (country == selectedCountry){return "5px"}else{return "1px"}}

    // calculate the stringency, death rate, Total cases per million
    var total_stringency=0;
    one.forEach(function(time,index){
        total_stringency+=time["stringency_index"];
    })
    var stringency=total_stringency/one.length;

    var total_death = one[one.length-1]["total_deaths_per_million"]
    var total_cases = one[one.length-1]["total_cases_per_million"]
    
    var death_rate=0;
    if(total_cases!=0 && total_death!=0){
        death_rate=total_death/total_cases;
    }
    
    

//data is the non time data for a country

    return <g >
        {dimensions.map(function (dim, index) {
                var obj = dim_array[dim];
                //console.log(obj(data[dim]))
                var x1 = gap * index;
                var y1 
                if (dim=="stringency_index" || dim=="death_rate" || dim=="total_cases_per_million"){ 
                    if (dim=="stringency_index"){y1=obj(stringency)}
                    if (dim=="death_rate"){y1=obj(death_rate)}
                    if (dim=="total_cases_per_million"){y1=obj(total_cases)}
                    
                }else{
                    y1= obj(data[dim])
                }
                
                pointArray[dim] = { x1, y1 };
                return <g key={'X' + dim} transform={`translate(${x1}, ${y1})`}>
                    <circle key={'line' + dim} r='2' fill={"#FF8EC7"}></circle>
                </g>
            })
        }
        {dimensions.map(function (dim, index) {
                if (index != dimensions.length - 1) {
                    var x1 = pointArray[dim].x1
                    var y1 = pointArray[dim].y1
                    var x2 = pointArray[dimensions[index + 1]].x1
                    var y2 = pointArray[dimensions[index + 1]].y1
                    //onMouseOut={()=>{setSelectedCountry(null)}}
                    return <g key={"paths" + dim}>
                        <line key={'path' + dim} x1={x1} y1={y1} x2={x2} y2={y2} 
                        stroke={color(c)} strokeWidth={stroke(c)} 
                        onMouseOver={()=>{setSelectedCountry(c)}}
                        />
                        
                    </g>}})}</g>
}

function ParallelChart(props) {
    const { data2, selectedCountry, setSelectedCountry,selectedCountryDD } = props;
    var dimensions = ['population_density', 'median_age', 'gdp_per_capita',
        'male_smokers', 'handwashing_facilities'
        , 'hospital_beds_per_thousand']
    var dim_array = {}
    dimensions.forEach(function (item, index) {
        var max = d3.max(data2, d => d[item])
        if (item == 'hospital_beds_per_thousand') {
            max = 13.8
        }
        var min = d3.min(data2, d => d[item])
        var scale = d3.scaleLinear()
            .domain([min, max])
            .range([HEIGHT, 0]).nice();
        if (item == "population_density") {
            scale = d3.scalePow()
                .exponent(0.1)
                .domain([min, max])
                .range([HEIGHT, 0]).nice();
        }
        dim_array[item] = scale;
    })
// stringency

var scale = d3.scaleLinear()
            .domain([0, 100])
            .range([HEIGHT, 0]).nice();
dim_array["stringency_index"]=scale
dimensions.push("stringency_index")

var scale = d3.scaleLinear()
            .domain([0, 0.2])
            .range([HEIGHT, 0]).nice();
dim_array["death_rate"]=scale
dimensions.push("death_rate")

var scale = d3.scaleLinear()
            .domain([0, 170000])
            .range([HEIGHT, 0]).nice();
dim_array["total_cases_per_million"]=scale
dimensions.push("total_cases_per_million")



   
    var one=countrydata.filter(c => c["iso_numeric"] ==selectedCountry)
    var c="c"
    if (one[0]!=undefined){
        c=one[0]["iso_code"]
        var dataset_for_one=data2.filter(x=>x["iso_code"]==c)
        dataset_for_one=dataset_for_one[0]
    }
    var ddone=countrydata.filter(c => c["iso_numeric"] ==selectedCountryDD)
    var dd="c"
    if (ddone[0]!=undefined){
        dd=ddone[0]["iso_code"]
        var dataset_for_dd=data2.filter(x=>x["iso_code"]==dd)
        dataset_for_dd=dataset_for_dd[0]
    }
    //c: the iso_code of the selected country
    //var dataset_for_one=data2.filter(x=>x["iso_code"]==c)
    var gap = WIDTH / dimensions.length;

    ///brush/////////////////////////////////////////////////////////////////////////////////////
    // React.useEffect(()=>{
    //     var brush = d3
    //      .brushX()
    //      .extent([
    //        [margin.left, margin.top],
    //        [WIDTH - margin.right, HEIGHT - margin.bottom]
    //      ])
    //      .on("end", brushEnd);
    //    d3.select(brush).call(brush);
       
    // var brushEnd = () => {
    //     if (!d3.event.selection) {
    //       this.props.updateRange([]);
    //       return;
    //     }
    //     const [x1, x2] = d3.event.selection;
    //     const range = [this.state.xScale.invert(x1), this.state.xScale.invert(x2)];
    //     this.props.updateRange(range);
    //   };
    // }
    // )
    
/////////////////////////////////////////////////////////////////////////////////////

        return <g key={"parrallelchart"}>{
            //generate the data points
            //loop every country
                    data2.map(function (d, index) {
                        return <g key={'data2' + index} transform={`translate(0, 10)`}>
                            <X country={d["iso_code"]} data={data2[index]} 
                            dim_array={dim_array} dimensions={dimensions} 
                            gap={gap} selectedCountry={selectedCountry} 
                            setSelectedCountry={setSelectedCountry} 
                            dd={false}/>
                        </g>
                    })
                }
                {//generate y axis: loop the dimensions
                    dimensions.map(function (dim, index) {
                        //var name = dimensions[index];
                        var yScale = dim_array[dim]
                        return <g key={"y" + index} transform={`translate(${gap * index}, 0)`}>
                            <Y dim={dim} yScale={yScale} height={HEIGHT} />
                        </g>
                    })}
                {//rerender the selected point so that it stands out
                    data2.filter(x=>x["iso_code"]==c).map(function(){
                        
                        return <g key={"selectedcountry"}transform={`translate(0, 10)`}> 
                        <X country={c} data={dataset_for_one} 
                        dim_array={dim_array} dimensions={dimensions} 
                        gap={gap} selectedCountry={selectedCountry} 
                        setSelectedCountry={setSelectedCountry} 
                        dd={false}/>
                        </g>})
                }
                {
                    data2.filter(x=>x["iso_code"]==dd).map(function(){
                     
                        return <g key={"dd"}transform={`translate(0, 10)`}> 
                        <X country={dd} data={dataset_for_dd} dim_array={dim_array} 
                        dimensions={dimensions} gap={gap} selectedCountry={selectedCountry} 
                        setSelectedCountry={setSelectedCountry} 
                        dd={true}/>
                        </g>})
                }
            </g>
 
}
function Tooltip(props){
    
    var {selectedCountry, data2, dataset1}=props
    if (selectedCountry == null) {
        return <span > .  </span>
    }
  
    //data set 1
    var  selectedCountryData = dataset1.filter(d=> d["iso_numeric"] === selectedCountry);
    const divStyle = {
        position: 'absolute',
        textalign: 'center',
        width: '400px',
        height: '350px',
        padding: '4px',
        left:"700px",
        top:"720px",
    };
    
    // total_cases: "57898.0"total_cases_per_million: 
    // 1487.297total_deaths: "2546.0"total_deaths_per_million:
    //  "65.402"total_tests: ""total_tests_per_thousand: 
    // ""total_vaccinations: ""total_vaccinations_per_hundred: 0
    var obj=selectedCountryData[selectedCountryData.length-1]
    var location=obj["location"]
    var total_cases=obj["total_cases"]
    var total_cases_per_million = obj["total_cases_per_million"]
    var total_death=obj["total_deaths_per_million"]
    var total_tests,total_vaccinations
    if(selectedCountryData.length-2<=0){total_tests=obj["total_tests"]; total_vaccinations=obj["total_vaccinations"]}
    else{
        total_tests=selectedCountryData[selectedCountryData.length-2]["total_tests"];
        total_vaccinations=selectedCountryData[selectedCountryData.length-2]["total_vaccinations"]
    }
    
    var death_rate=(total_death/total_cases_per_million).toFixed(3);
    var iso=obj["iso_code"]
    var  d2 = data2.filter(d=> d["iso_code"] === iso);

    var population_density = d2[0]["population_density"]
    var gdp=d2[0]
    
        return<span >
        <div style={divStyle}>
            {/* <h4>You have selected <h3> {location}</h3>, 
                up until April 2020, it has <h3> {total_cases_per_million}</h3> 
                confirmed COVID cases per million,
                 and has performed <h3> {total_vaccinations}</h3> vaccine injections
                  on a population density of <h3> {population_density}</h3>  of 
                 its citizens, ...</h4> */}
             <h3 > {location}</h3>
            <p >corresponds to the black line in the parrallel chart, while the red line encodes the country defined in the dropdown </p>
            
            <h3 fontSize="20px"> total_cases:{total_cases }</h3>
            <h3 > total_cases_per_million:{total_cases_per_million }</h3>
            <h3 > total_deaths_per_million:{(total_death) }</h3>
            <h3 > total_tests:{total_tests}</h3>
            <h3 > total_vaccinations:{(total_vaccinations) }</h3>
            <h3 > death_rate:{death_rate}</h3> 
            <h3 > population_density:{population_density}</h3> 
        </div>

        
    </span>
      
    
}

//public data
var YearMonth = ['2020/2', '2020/3', '2020/4', '2020/5', '2020/6', '2020/7', '2020/8', '2020/9', '2020/10', '2020/11', '2020/12', '2021/1', '2021/2', '2021/3', '2021/4']
var data1;
var data2;
const WIDTH = 1200;
const HEIGHT = 800;
const margin = { top: 20, right: 40, bottom: 20, left: 40 };
    const offSet = 30;
    const LineChartoffsetX = WIDTH/2+ 50;
    const LineChartoffsetY = 0;
    const LineChartHeight = 250;
    const LineChartWidth = 300;


const margin1 = { top: 50, right: 50, bottom: 160, left: 150, gap: 40 };
var countrydata 
// this generate the whole graph
const CitiBike = () => {

//set up the states
    const [selectedMonth, setSelectedMonth] = React.useState('4');
    const [selectedYear, setSelectedYear] = React.useState('2020');
    const [selectedCountry, setSelectedCountry] = React.useState(null);//this is the state for map
    const [selectedContinent, setSelectedContinent] = React.useState("Asia");//
    const [selectedCountryDD, setSelectedCountryDD] = React.useState("004");// use iso_numeric to identify country; DD is short for DropDown
    const [selectedAttribute, setSelectedAttribute] = React.useState("Vaccinations");

//Use the data
    const rawData = useData(csvUrl, isoCode);
    const { dataset1, dataset2 } = rawData
    const map = useMap(mapUrl);
    
    data2 = useData2(csv2);
    if (!map || !dataset1||!dataset2 || !data2) {
            return <pre>Loading...</pre>;
        };
                    const continents = dataset1.filter(d=> d.iso_code.slice(0,4)==="OWID").map(d=>d.location);//continents categorization by the first dataset
                    const continents2 = dataset2.map(d=> d.region);//continents categorization by the second dataset; we follow this typology
                    const unique_continents2 = continents2.filter((a, b) => continents2.indexOf(a) === b);
                
                    const collection = []
                    unique_continents2.map(continent=> {
                        let related_countries = dataset2.filter(d => d.region === continent)
                                                        .map(d=> {return {'iso_numeric': d["country-code"], 'country': d.name, 'continent': d.region}});//an array of object
                    
                        collection.push({"continent": continent, "countries": related_countries})
                    });
                    countrydata = dataset1.filter(d=> d.iso_code.slice(0,4)!=="OWID")
                    const continentdata = dataset1.filter(d=> d.iso_code.slice(0,4)==="OWID")//we will use only country-specific data otherwise there will be bug
                    const changeHandler = (event) => {
                        setSelectedMonth(event.target.value);
                                }
                    const options1=[{"value":"2020","label":"2020"}, {"value":"2021","label":"2021"}];
                    const options2=[ {"value":"Vaccinations","label":"Vaccinations"}, {"value":"GrowthRate","label":"Growth Rate of New Cases"},];
                    const selectedCountryData = dataset1.filter(d=> d.iso_numeric === selectedCountryDD);
                
    
    const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    

    return <div>
        {/* <div>
            <input key="slider" type='range' min='0' max='11' value={month} step='1' onChange={changeHandler}/>
            <input key="monthText" type="text" value={MONTH[month]} readOnly/>
        </div> */}

            <div>
                <input key="slider" type='range' min='0' max='11' value={selectedMonth} step='1' onChange={changeHandler}/>
                <input key="monthText" type="text" value={MONTH[selectedMonth]} readOnly/>
                <Dropdown options={options1} id={"dropdown1"} selectedValue={selectedYear} onSelectedValueChange={setSelectedYear}/>
                <Dropdown options={options2} id={"dropdown2"} selectedValue={selectedAttribute} onSelectedValueChange={setSelectedAttribute}/>
                <BigDropdown options={collection} id={"dropdown3"} selectedValue1={selectedContinent} onSelectedValueChange1={setSelectedContinent}
                selectedValue2={selectedCountryDD} onSelectedValueChange2={setSelectedCountryDD}/>
            </div>
            <svg width={WIDTH} height={HEIGHT}>
                <CasesMap map={map} data={countrydata} collection = {collection} month={selectedMonth} year = {selectedYear} type={"Cases"} 
                selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} 
                selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD}/>
                <VaccinationsMap map={map} data={countrydata} collection = {collection} month={selectedMonth} year = {selectedYear} type={selectedAttribute} 
                selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} 
                selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD}/>
                <LineChart selectedCountry={selectedCountryDD} selectedCountryData={selectedCountryData}/>
                <rect x="650" y="340" width="450" height="450" fill="white" stroke="purple"/>
                
            </svg> 
           

        <svg width={WIDTH + margin1.left + margin1.right} height={HEIGHT + margin1.top + margin1.bottom}>
            <g transform={`translate(${margin1.left},${margin1.top} )`}>
                <ParallelChart data2={data2} selectedCountry={selectedCountry} 
                setSelectedCountry={setSelectedCountry} 
                selectedCountryDD={selectedCountryDD}/>
            </g>
        </svg>
        <Tooltip selectedCountry={selectedCountry} data2={data2} 
                dataset1={dataset1}/>
        
        {/* <div style={{position: "absolute", textAlign: "left", width: "240px",left:"40px", top:"40px"}}>
            <h3>Citi bike 2020</h3>
<Tooltip selectedCountry={selectedCountry} data2={data2} 
                selectedCountryData={selectedCountryData} />

            <p>A visualization of the numbers of citi bike riders over 2020.</p>
        </div> 
        */}

    </div>

}







function LineChart(props){
    const {selectedCountry, selectedCountryData} = props;
    //console.log(selectedCountry);
    const xValue = d => d.time;
    const yValue1 = d => d.new_cases_per_million;
    const yValue2 = d => d.new_deaths_per_million;
    const xScale = d3.scaleTime()
        .domain(d3.extent(selectedCountryData, xValue))
        .range([0, LineChartWidth])
        .nice();
   const max_cases = d3.max(selectedCountryData,  yValue1);
   const max_deaths = d3.max(selectedCountryData,  yValue2);
   const yScale = d3.scaleLinear()
        .domain([0, d3.max([max_cases, max_deaths])])
        .range([LineChartHeight, 0])
        .nice();

    const line1 = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.new_cases_per_million))
        .curve(d3.curveBasis)(selectedCountryData);
    
    const line2 = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.new_deaths_per_million))
        .curve(d3.curveBasis)(selectedCountryData);
    const formatTime = d3.timeFormat("%B, %Y");
    const parseTime = d3.timeParse("%B, %Y");

    const ticks = xScale.ticks(5).map(d => {
     
        return formatTime(d)});
   
    return <g transform={`translate(${LineChartoffsetX}, ${LineChartoffsetY})`}>
            <path className={"line-path"} id={'cases'} d={line1} fill={"None"} stroke={"black"}  strokeWidth={'2px'} />
            <path className={'line-path'} id={"deaths"} d={line2} fill={"None"} stroke={"red"} strokeWidth={'2px'} />
          
            {ticks.map(tickValue => {
                <g key={tickValue} transform={`translate(${30}, ${10})`}>
                    <rect x={0} y={0} width={20} height={20} fill={'red'}/>
                    <line y2={10} stroke='black'/>
                    <text style={{textAnchor: 'middle', fontSize:'10px' }} >
                            {tickValue}
                    </text>
                </g>
            })}
           
            {<line x1={0} y1={LineChartHeight} x2={LineChartWidth} y2={LineChartHeight} stroke='black'/>}
            {<line y2={LineChartHeight} stroke='black'/>}
            
            {yScale.ticks().map(tickValue => 
                <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                    
                    <line x2={10} stroke='black' />
                    <text style={{ textAnchor:'end', fontSize:'10px' }} >
                        {tickValue}
                    </text>
                </g>
            )}        
        </g>
} 
    


function TheMap(props) {
const {map, data, collection, cScale, month, year, countries, type, selectedCountry, setSelectedCountry, selectedCountryDD, setSelectedCountryDD} = props;
const filteredData = data.filter(d => d.month === month && d.year === year);
//console.log(filteredData);

const opacity = d => d.iso_numeric === selectedCountry? 1: 0.6;
const fill = function(d, cScale, type){
    if(type === 'Vaccinations'){
        return cScale(d.total_vaccinations_per_hundred)
    }if(type =="Cases"){
        return cScale(d.total_cases_per_million)
    }if(type =="GrowthRate")
        return cScale(d.cases_growth_rate)
};
if(type ==='Cases'){
    const projection = d3.geoEqualEarth().fitExtent([[margin.left,margin.top],[WIDTH/2, HEIGHT/2-offSet]] ,map);

    const path = d3.geoPath(projection);

    return <g>
    <path className={'sphere'} d={path({type: 'Sphere'})} />
    {map.features.map(feature => { 
        const country = filteredData.filter(d => d.iso_numeric === feature.id);
        if(country[0]){ 
           //console.log(country[0])
            return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                d = {path(feature)} style={{ "fill" : fill(country[0], cScale, type)}}
                onMouseOver={()=>{setSelectedCountry(country[0].iso_numeric);setSelectedCountryDD(country[0].iso_numeric)} }
                onMouseOut={()=>setSelectedCountry(null)} opacity={opacity((country[0]))}/>

    }else{
        return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                d = {path(feature)} style={{ "fill" : "#aba8a1"}} 
                onMouseOver={()=>{setSelectedCountry(feature.id); setSelectedCountryDD(feature.id)}} 
                onMouseOut={()=>setSelectedCountry(null)} opacity={0.6}/>
    }})}
    </g>
}if(type ==="Vaccinations"|| type==="GrowthRate"){
    const projection = d3.geoEqualEarth().fitExtent([[margin.left, HEIGHT/2+offSet/2],[WIDTH/2, HEIGHT-margin.bottom-offSet/2]] ,map);

    const path = d3.geoPath(projection);

    return <g>
    <path className={'sphere'} d={path({type: 'Sphere'})} />
    {map.features.map(feature => { 
        const country = filteredData.filter(d => d.iso_numeric === feature.id);
       
        if (country[0]){  
          
            return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                d = {path(feature)} style={{ "fill" : fill(country[0], cScale, type)}} 
                onMouseOver={()=>{setSelectedCountry(country[0].iso_numeric); setSelectedCountryDD(country[0].iso_numeric)}}
                onMouseOut={()=>setSelectedCountry(null)} opacity={opacity(country[0])}/>       
    }else{
        return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                d = {path(feature)} style={{ "fill" : "#aba8a1"}} 
                onMouseOver={()=>{setSelectedCountry(feature.id); setSelectedCountryDD(feature.id)}} 
                onMouseOut={()=>setSelectedCountry(null)} opacity={0.6} />
    }})}
  </g>}}


  function Legend(props){
    const {type} = props;
    const xScale = d3.scaleLinear().domain([0,99]).range([0, WIDTH/2-margin.left-margin.right]);
    var data = Array.from(Array(100).keys());
 
    if(type==='Cases'){
        const interpolator = d3.interpolateYlOrRd;
        const cScale = d3.scaleSequential().interpolator(interpolator).domain([0,99]);
        return <g transform = {`translate(${margin.left},${HEIGHT/2-margin.bottom})`}>

          {data.map(d=> {
            return <rect x = {(Math.floor(xScale(d)))} y = {0} height={20} width={d==99? 6: (Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1)}
           fill={cScale(d)} />})}

        </g>
    }if(type==="Vaccinations"){
        const interpolator = d3.interpolateBlues;
        const cScale = d3.scaleSequential().interpolator(interpolator).domain([0,99]);
        return <g transform = {`translate(${margin.left},${HEIGHT-margin.bottom})`}>
          {data.map(d=> {
            return <rect x = {(Math.floor(xScale(d)))} y = {0} height={20} width={d==99? 6: (Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1)}
           fill={cScale(d)}/>})}
        </g>
}if(type==="GrowthRate"){
        const interpolator = d3.interpolateOranges;
        const cScale = d3.scaleSequential().interpolator(interpolator).domain([0,99]);
        return <g transform = {`translate(${margin.left},${HEIGHT-margin.bottom})`}>
          {data.map(d=> {
            return <rect x = {(Math.floor(xScale(d)))} y = {0} height={20} width={d==99? 6: (Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1)}
           fill={cScale(d)}/>})}

        </g>
}
}
function VaccinationsMap(props){
    const{map, data, collection, month, year, type, selectedCountry, setSelectedCountry, selectedCountryDD, setSelectedCountryDD} = props
    const countries = data.filter(d=> d.iso_code.slice(0,4)!=="OWID").map(d=>d.location);
    const continents = data.filter(d=> d.iso_code.slice(0,4)==="OWID").map(d=>d.location);
  
    const unique_countries = countries.filter((a, b) => countries.indexOf(a) === b);
    const unique_continents = continents.filter((a, b) => continents.indexOf(a) === b);
    if(type==="Vaccinations"){
    const total_vaccinations = data.map(d=> d.total_vaccinations_per_hundred);
    
    const colorScale = d3.scaleSequentialSymlog().interpolator(d3.interpolateBlues).domain([d3.min(total_vaccinations),d3.max(total_vaccinations)]);

    return <g>

            <TheMap map={map} data={data} cScale={colorScale} month={month} year = {year} countries={countries} type={"Vaccinations"} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}/>
            <Legend  type={"Vaccinations"}/>
        </g>
}else{
    const cases_growth_rate = data.map(d => d.cases_growth_rate);
    const colorScale = d3.scaleSequentialSymlog().interpolator(d3.interpolateOranges).domain([d3.min(cases_growth_rate),d3.max(cases_growth_rate)]);
    return <g>
            <TheMap map={map} data={data} collection={collection} cScale={colorScale} month={month} year = {year} countries={countries} type={"GrowthRate"} 
            selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
            selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD}/>
            <Legend  type={"GrowthRate"}/>
        </g>
}};

function CasesMap(props){
    const{map, data, collection, month, year, type, selectedCountry, setSelectedCountry, selectedCountryDD, setSelectedCountryDD} = props;
    const countries = data.filter(d=> d.iso_code.slice(0,4)!=="OWID").map(d=>d.location);
    const continents = data.filter(d=> d.iso_code.slice(0,4)==="OWID").map(d=>d.location);
    const unique_countries = countries.filter((a, b) => countries.indexOf(a) === b);
    const unique_continents = continents.filter((a, b) => continents.indexOf(a) === b);
    const total_cases = data.map(d=> d.total_cases_per_million);
    const colorScale = d3.scaleSequentialSymlog().interpolator(d3.interpolateYlOrRd).domain([d3.min(total_cases),d3.max(total_cases)]);
    return<g>
        <TheMap map={map} data={data} collection={collection} cScale={colorScale} month={month} year = {year} countries={countries} type={"Cases"} 
        selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
        selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD}/>
        <Legend type={"Cases"}/>
        </g>
}

function Dropdown (props){
    const {options, id, selectedValue, onSelectedValueChange} = props;
    return <div id={id}>
        <select  defaultValue={selectedValue} 
        onChange={event => {onSelectedValueChange(event.target.value)}}>
        {options.map( ({value, label}) => {
            return <option key={label} value={value} >
                {label}
            </option>
        })}
    </select>
    </div>
}
function BigDropdown (props) {
    const {options, id, selectedValue1, selectedValue2, onSelectedValueChange1, onSelectedValueChange2} = props;
    const mainOptions = options.map(d=> d.continent);
    //console.log(mainOptions);// an array of continents
    const subOptionsPairs = options.filter(d => d.continent === selectedValue1)[0].countries
                                   .map(d=> {return {"value": d.iso_numeric, "label": d.country}});//an array of objects {iso_numeric: xxx, country: xxx}, can be directly used as value-lable pair
    const mainOptionsPairs = mainOptions.map(d=> {return {'value': d, 'label': d}});
    return <div id={id} transform={`translate(${LineChartoffsetX}, ${LineChartoffsetY})`}>
         <Dropdown options={mainOptionsPairs} id={"contitent"} selectedValue={selectedValue1} onSelectedValueChange={onSelectedValueChange1}/>
         <Dropdown options= {subOptionsPairs} id={"country"} selectedValue={selectedValue2} onSelectedValueChange={onSelectedValueChange2}/>
       </div>
}

ReactDOM.render(<CitiBike />, document.getElementById('root'));

