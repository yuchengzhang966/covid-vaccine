// import {csvUrl, mapUrl,useData,useMap,SymbolMap,Tooltip,SymmetricAreaChart,SymmetricBarChart} from './modules/functions.js';
//import Button from 'react-bootstrap/Button';

const csv1 = "https://raw.githubusercontent.com/jane-yucheng/covid-vaccine/main/dataset/covid1.csv";
const csv2 = "https://raw.githubusercontent.com/jane-yucheng/covid-vaccine/main/dataset/covid2.csv";
const csv3 = "https://raw.githubusercontent.com/jane-yucheng/covid-vaccine/main/dataset/covid3.csv";
//const mapUrl = "https://gist.githubusercontent.com/hogwild/6784f0d85e8837b9926c184c65ca8ed0/raw/2040d6883cf822817e34b5bda885348ec6214572/jerseyCity_geojson.json";
// const csvUrl = "https://raw.githubusercontent.com/jane-yucheng/covid-vaccine/main/dataset/covid1.csv";
// const mapUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";
const mapUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
const isoCode = "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.csv";
//public data
var YearMonth = ['2020/2', '2020/3', '2020/4', '2020/5', '2020/6', '2020/7', '2020/8', '2020/9', '2020/10', '2020/11', '2020/12', '2021/1', '2021/2', '2021/3', '2021/4']
const WIDTH = 1200;
const HEIGHT = 800;
const margin = { top: 20, right: 40, bottom: 20, left: 40 };
const offSet = 30;
const LineChartoffsetX = WIDTH / 2 + 50;
const LineChartoffsetY = 160;
const LineChartHeight = 250;
const LineChartWidth = 300;
var setAxisArray;
var countrydata;
const margin1 = { top: 50, right: 50, bottom: 30, left: 100, gap: 40 };
var pwidth = 1200
var pheight = 400
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//////use Data
function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        d3.json(mapUrl).then(topoJsonData => {
            setData(
                topojson.feature(topoJsonData, topoJsonData.objects.countries),
            )
        });
    }, []);
    return data;
}
function useData(csvPath1, csvPath2, csvPath3) {
    const [dataAll, setData] = React.useState([]);
    React.useEffect(() => {
        console.log('Loading data from:', csvPath1, csvPath2, csvPath3);
        Promise.all([d3.csv(csvPath1), d3.csv(csvPath2), d3.csv(csvPath3)])
            .then(datasets => {
                console.log('Data loaded successfully:', datasets.length, 'datasets');
                console.log('Dataset 1 length:', datasets[0] ? datasets[0].length : 0);
                console.log('Dataset 2 length:', datasets[1] ? datasets[1].length : 0);
                console.log('Dataset 3 length:', datasets[2] ? datasets[2].length : 0);
            console.log('Processing dataset 1...');
            datasets[0].forEach(d => {
                try {
                    d.total_cases_per_million = +d.total_cases_per_million || 0;
                    d.total_vaccinations_per_hundred = +d.total_vaccinations_per_hundred || 0;
                    d.new_cases_per_million = +d.new_cases_per_million || 0;
                    d.stringency_index = +d.stringency_index || 0;
                    d.cases_growth_rate = d.total_cases_per_million > 0 ? d.new_cases_per_million / d.total_cases_per_million : 0;
                    d.time = new Date(d.month + '/1/' + d.year);
                    
                    if (datasets[2] && datasets[2].length > 0) {
                        const match = datasets[2].filter(entry => entry['alpha-3'] === d.iso_code);
                        if (match[0]) {
                            d.iso_numeric = match[0]['country-code'];
                        }
                    }
                } catch (error) {
                    console.error('Error processing row:', d, error);
                }
            });
            console.log('Filtering dataset 1...');
            const filtered = datasets[0].filter(d => !(d.month == 1 && d.year == 2020));
            console.log('Filtered dataset 1 length:', filtered.length);
            
            console.log('Processing dataset 2...');
            datasets[1].forEach(d => {
                try {
                    d.population_density = +d.population_density || 0;
                    d.median_age = +d.median_age || 0;
                    d.aged_65_older = +d.aged_65_older || 0;
                    d.gdp_per_capita = +d.gdp_per_capita || 0;
                    d.extreme_poverty = +d.extreme_poverty || 0;
                    d.cardiovasc_death_rate = +d.cardiovasc_death_rate || 0;
                    d.female_smokers = +d.female_smokers || 0;
                    d.handwashing_facilities = +d.handwashing_facilities || 0;
                    d.male_smokers = +d.male_smokers || 0;
                } catch (error) {
                    console.error('Error processing dataset 2 row:', d, error);
                }
            });

            console.log('Setting data state...');
            console.log('Final filtered dataset 1 length:', filtered.length);
            console.log('Final dataset 2 length:', datasets[1].length);
            console.log('Final dataset 3 length:', datasets[2].length);
            setData({ dataset1: filtered, dataset2: datasets[1], dataset3: datasets[2]});
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
    }, []);
    return dataAll;
}
//components
function Y(props) {
    const { dim, yScale, height } = props;
    var ticks = yScale.ticks();
    var dim1 = dim.replace(/[\W_]/g, ' ')
    if (dim == "population_density") {
        ticks = yScale.ticks([5])
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
                <text style={{ textAnchor: 'middle', fontSize: '12px', fontFamily: "Verdana" }} transform={`translate(-30, -10)`}>
                    {s1}
                </text>
                <g transform={`translate(0, 15)`}>
                    <text style={{ textAnchor: 'middle', fontSize: '12px', fontFamily: "Verdana" }} transform={`translate(-30, -10)`}>
                        {s2}
                    </text>
                </g>
            </g>
            <g transform={`translate(0, 10)`}>
                <line y2={height} stroke={`black`} />
                {ticks.map(tickValue => {
                    return <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                        <line x2={10} stroke="black" />
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
            <text style={{ textAnchor: 'middle', fontSize: '12px', fontFamily: "Verdana" }} transform={`translate(-30, -10)`}>
                {dim1}
            </text>
        </g>
        <g transform={`translate(0, 10)`}>
            <line y2={height} stroke={`black`} />
            {ticks.map(tickValue => {//render ticks
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
    const { country, data, dim_array, display_dimensions, gap, selectedCountry, setSelectedCountry, dd } = props;
    //this function generate the lines and red points
    var one = countrydata.filter(c => c["iso_code"] == country)
    var c = one[0]["iso_numeric"]
  
    pointArray = {}
    function color(country) {
        if (dd == true) { return "purple" } if (country == selectedCountry) { return "#BD3D22" } else { return "#CECECE" }
    }
    function stroke(country) {
        if (dd == true) { return "3px" } if (country == selectedCountry) { return "3px" } else { return "1px" }
    }

    // calculate the stringency, death rate, Total cases per million
    var total_stringency = 0;
    one.forEach(function (time, index) {
        total_stringency += time["stringency_index"];
    })
    var stringency = total_stringency / one.length;

    var total_death = one[one.length - 1]["total_deaths_per_million"]
    var total_cases = one[one.length - 1]["total_cases_per_million"]

    var death_rate = 0;
    if (total_cases != 0 && total_death != 0) {
        death_rate = total_death / total_cases;
    }
    //data is the non time data for a country
    return <g >
        {display_dimensions.map(function (dim, index) {
            var obj = dim_array[dim];
            //console.log(obj(data[dim]))
            var x1 = gap * index;
            var y1
            if (dim == "stringency_index" || dim == "death_rate" || dim == "total_cases_per_million") {
                if (dim == "stringency_index") { y1 = obj(stringency) }
                if (dim == "death_rate") { y1 = obj(death_rate) }
                if (dim == "total_cases_per_million") { y1 = obj(total_cases) }
            } else {
                y1 = obj(data[dim])
            }
            pointArray[index] = { x1, y1 };
            return <g key={'X' + dim + index} transform={`translate(${x1}, ${y1})`}>
                <circle key={'line' + dim} r='2.8' opacity="0.7" fill={"#FF8EC7"}></circle>
            </g>
        })
        }
        {display_dimensions.map(function (dim, index) {
            if (index != display_dimensions.length - 1) {
                var x1 = pointArray[index].x1
                var y1 = pointArray[index].y1
                var x2 = pointArray[index + 1].x1
                var y2 = pointArray[index + 1].y1
                //onMouseOut={()=>{setSelectedCountry(null)}}
                return <g key={"paths" + dim + index}>
                    <line key={'path' + dim} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={color(c)} strokeWidth={stroke(c)}
                        onMouseOver={() => { setSelectedCountry(c) }}
                    />

                </g>
            }
        })}</g>
}
var dimensions = ['population_density', 'median_age', 'gdp_per_capita',
    'male_smokers', "female_smokers", 'handwashing_facilities', 'diabetes_prevalence', 'cardiovasc_death_rate'
    , 'hospital_beds_per_thousand', "stringency_index", "death_rate", "total_cases_per_million"]
var display_dimensions = [dimensions[0], dimensions[dimensions.length - 1], dimensions[1], dimensions[dimensions.length - 2], dimensions[2], dimensions[dimensions.length - 3]]

function ParallelChart(props) {
    const { data2, selectedCountry, setSelectedCountry, selectedCountryDD } = props;


    //dim_array: {dimension: dimension scale}
    var dim_array = {}
    dimensions.forEach(function (item, index) {
        if (index <= dimensions.length - 4) {
            var max = d3.max(data2, d => d[item])
            if (item == 'hospital_beds_per_thousand') { max = 13.8 }
            if (item == 'diabetes_prevalence') { max = 31 }
            var min = d3.min(data2, d => d[item])
            var scale = d3.scaleLinear()
                .domain([min, max])
                .range([pheight, 0]).nice();
            if (item == "population_density") {
                scale = d3.scalePow()
                    .exponent(0.1)
                    .domain([min, max])
                    .range([pheight, 0]).nice();
            }

            dim_array[item] = scale;
        }

    })
    //now, add dimensions that are not present on data2
    // stringency
    var scale = d3.scaleLinear()
        .domain([0, 100])
        .range([pheight, 0]).nice();
    dim_array["stringency_index"] = scale


    var scale = d3.scaleLinear()
        .domain([0, 0.2])
        .range([pheight, 0]).nice();
    dim_array["death_rate"] = scale


    var scale = d3.scaleLinear()
        .domain([0, 170000])
        .range([pheight, 0]).nice();
    dim_array["total_cases_per_million"] = scale


    var length = dimensions.length
    //display_dimensions is the order by which the coordinates are organized

    var one = countrydata.filter(c => c["iso_numeric"] == selectedCountry)
    var c = "c"
    if (one[0] != undefined) {
        c = one[0]["iso_code"]
        var dataset_for_one = data2.filter(x => x["iso_code"] == c)
        dataset_for_one = dataset_for_one[0]
    }
    var ddone = countrydata.filter(c => c["iso_numeric"] == selectedCountryDD)
    var dd = "c"
    if (ddone[0] != undefined) {
        dd = ddone[0]["iso_code"]
        var dataset_for_dd = data2.filter(x => x["iso_code"] == dd)
        dataset_for_dd = dataset_for_dd[0]
    }
    //c: the iso_code of the selected country
    //var dataset_for_one=data2.filter(x=>x["iso_code"]==c)
    var gap = pwidth / display_dimensions.length;


    return <g key={"parrallelchart"}  >{
        //generate the data points
        //loop every country

        data2.map(function (d, index) {
            return <g key={'data2' + index} transform={`translate(0, 10)`}>
                <X country={d["iso_code"]} data={data2[index]}
                    dim_array={dim_array} display_dimensions={display_dimensions}
                    gap={gap} selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    dd={false} />
            </g>
        })
    }
        {//generate y axis: loop the dimensions
            display_dimensions.map(function (dim, index) {
                //var name = dimensions[index];
                var yScale = dim_array[dim]
                return <g key={"y" + index} transform={`translate(${gap * index}, 0)`}>

                    <Y dim={dim} yScale={yScale} height={pheight} />
                </g>
            })}
        {//rerender the selected point so that it stands out
            data2.filter(x => x["iso_code"] == c).map(function () {

                return <g key={"selectedcountry"} transform={`translate(0, 10)`}>
                    <X country={c} data={dataset_for_one}
                        dim_array={dim_array} display_dimensions={display_dimensions}
                        gap={gap} selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        dd={false} />
                </g>
            })
        }
        {
            data2.filter(x => x["iso_code"] == dd).map(function () {

                return <g key={"dd"} transform={`translate(0, 10)`}>
                    <X country={dd} data={dataset_for_dd} dim_array={dim_array}
                        display_dimensions={display_dimensions} gap={gap} selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        dd={true} />
                </g>
            })
        }
        
        {/* Country Name Labels on the Right Side */}
        {data2.map(function (d, index) {
            // Get the last point position for each country
            var lastDim = display_dimensions[display_dimensions.length - 1];
            var lastIndex = display_dimensions.length - 1;
            var xPos = gap * lastIndex;
            
            // Calculate y position based on the last dimension value
            var yPos;
            if (lastDim == "stringency_index" || lastDim == "death_rate" || lastDim == "total_cases_per_million") {
                var one = countrydata.filter(c => c["iso_code"] == d["iso_code"]);
                if (lastDim == "stringency_index") {
                    var total_stringency = 0;
                    one.forEach(function (time, idx) {
                        total_stringency += time["stringency_index"];
                    });
                    var stringency = total_stringency / one.length;
                    yPos = dim_array[lastDim](stringency);
                } else if (lastDim == "death_rate") {
                    var total_death = one[one.length - 1]["total_deaths_per_million"];
                    var total_cases = one[one.length - 1]["total_cases_per_million"];
                    var death_rate = 0;
                    if (total_cases != 0 && total_death != 0) {
                        death_rate = total_death / total_cases;
                    }
                    yPos = dim_array[lastDim](death_rate);
                } else if (lastDim == "total_cases_per_million") {
                    var total_cases = one[one.length - 1]["total_cases_per_million"];
                    yPos = dim_array[lastDim](total_cases);
                }
            } else {
                yPos = dim_array[lastDim](d[lastDim]);
            }
            
            // Determine text color based on selection
            var textColor = "#666666";
            var fontWeight = "normal";
            if (d["iso_code"] == c) {
                textColor = "#BD3D22";
                fontWeight = "bold";
            } else if (d["iso_code"] == dd) {
                textColor = "purple";
                fontWeight = "bold";
            }
            
            return <g key={'label' + index} transform={`translate(0, 10)`}>
                <text 
                    x={xPos + 20} 
                    y={yPos} 
                    style={{
                        fontSize: '12px',
                        fontFamily: 'var(--font-family)',
                        fill: textColor,
                        fontWeight: fontWeight,
                        textAnchor: 'start',
                        alignmentBaseline: 'middle'
                    }}
                    onMouseOver={() => { setSelectedCountry(d["iso_numeric"]) }}
                    onMouseOut={() => { setSelectedCountry(null) }}
                >
                    {d["name"]}
                </text>
            </g>
        })}
   
    </g>

}
function Tooltip(props) {
    var { selectedCountry, data2, dataset1 } = props
    if (selectedCountry == null) {
        return <span > .  </span>
    }
    var selectedCountryData = dataset1.filter(d => d["iso_numeric"] === selectedCountry);
    if (selectedCountryData.length == 0) {
        return <g transform={`translate(620,450 )`}>
            <rect x="0" y="0" width="550" height="300" fill="white" stroke="purple" />
            <g transform={`translate(35,30 )`}>
                <text fontFamily="Verdana" fontSize="15px">We don't have information about this region </text>
            </g>
        </g>
    }

    var obj = selectedCountryData[selectedCountryData.length - 1]
    var location = obj["location"]
    var total_cases =  new Intl.NumberFormat().format(Math.round(obj["total_cases"]));
    var total_cases_per_million = obj["total_cases_per_million"]
    var total_death = new Intl.NumberFormat().format(Math.round(obj["total_deaths_per_million"]*1000000));
    var cases_growth_rate = obj["cases_growth_rate"].toFixed(3)

    var total_tests, total_vaccinations
    if (selectedCountryData.length - 2 <= 0) { total_tests = obj["total_tests"]; total_vaccinations = obj["total_vaccinations"] }
    else {
        total_tests = selectedCountryData[selectedCountryData.length - 2]["total_tests"];
        total_vaccinations = new Intl.NumberFormat().format(selectedCountryData[selectedCountryData.length - 2]["total_vaccinations"]);
    }

    // var death_rate = parseFloat((obj["total_deaths_per_million"] / total_cases_per_million)*100).toFixed(2)+'%';
    //  const upperbound_2 = parseFloat(upperbound).toFixed(2)+"%";
    // console.log(death_rate);
    var iso = obj["iso_code"]
    var d2 = data2.filter(d => d["iso_code"] === iso);
    var death_rate = obj["total_deaths_per_million"] / total_cases_per_million;
    var population_density = d2[0]["population_density"];
    var gdp = new Intl.NumberFormat().format(Math.round(d2[0]["gdp_per_capita"]));
    var continent = d2[0]["continent"];
    console.log(death_rate);
    console.log(isNaN(death_rate));


if(isNaN(death_rate)){
    return<g transform={`translate(620,450)`}>
    <rect x="0" y="0" width="550" height="300" fill="white" stroke="purple" />
    <foreignObject x={20} y={0} width={480} height={350}> 
    <p style={{fontFamily: "Verdana", fontSize:"25px"}}> {`${location}`}</p>
    <p style={{fontFamily: "Verdana", fontSize:"18px"}} > {`is in ${continent}. It has a
    population density of ${population_density} people/square kilometers, and a  gdp per capita of ${gdp} dollars.`}</p>
    <p>{'Up until mid April, 2021, '}<br></br>{'it has  '}<strong>{`${total_cases}`}</strong>{"  confirmed COIVD cases,"}
    <br></br>{'and  '}<strong>{`${(total_death)}`}</strong>{"  of its citizens have lost their lives in the pandemic"}
    <br></br>{'So far, '}<strong>{` ${total_vaccinations}`}</strong>{"  doses of vaccine injections are recorded"}</p>
    </foreignObject>
    </g>

}else{
    var death_rate_new = parseFloat(death_rate*100).toFixed(2)+'%';
    return <g transform={`translate(620,450)`}>
    <rect x="0" y="0" width="550" height="300" fill="white" stroke="purple" />
    <foreignObject x={20} y={0} width={480} height={350}> 
    <p style={{fontFamily: "Verdana", fontSize:"25px"}}> {`${location}`}</p>
    <p style={{fontFamily: "Verdana", fontSize:"18px"}} > {`is in ${continent}. It has a
    population density of ${population_density} people/square kilometers, and a  gdp per capita of ${gdp} dollars.`}</p>
    <p>{"Up until mid April, 2021,"}<br></br>{"it has   "}<strong>{`${total_cases}`}</strong>{"   confirmed COIVD cases,"}
    <br></br>{'and  '}<strong>{`${(total_death)}`}</strong>{"  of its citizens have lost their lives in the pandemic; the death rate is  "}
    <strong>{`${death_rate_new}`}</strong>
    <br></br>{'So far, '}<strong>{`${total_vaccinations}`}</strong> {"  doses of vaccine injections are recorded"}</p>
    </foreignObject>

</g>

}
}

// this generate the whole graph


function Tooltip1({ left, top, selectedCountry, selectedMonth,selectedYear, selectedAttribute, dataset1 ,t}) {
    //console.log(left,top,selected)
    const divStyle1 = {
        position: 'absolute',
        textalign: 'center',
        width: '240px',
        height: '100px',
        left: 0 +'px',
        top: (200) +'px',
        padding: '4px',
        font: '7px sans - serif',
        
        border: '0px',
        borderRadius: '8px',
        pointerEvents: 'none',
        opacity:"0.6"
    };
    const divStyle2 = {
        position: 'absolute',
        textalign: 'center',
        width: '300px',
        height: '100px',
        left: (0) +'px',
        top: (550) +'px',
        padding: '4px',
        font: '7px sans - serif',
       
        border: '0px',
        borderRadius: '8px',
        pointerEvents: 'none',
        opacity:"0.6"
    };
    const textStyle = {
        textIndent: '9px',
        font: "8px sans - serif",
        letterSpacing: '0.3px',
        lineSpacing : '1px',
        position: 'relative',
        left: '25px',
    }
    if (selectedCountry ==null || left == 0  ) {
        return <div >   </div>
    }
    let da = dataset1.filter(d => d.iso_numeric === selectedCountry)
    
     da = da.filter(d => d.month === selectedMonth)
    da = da.filter(d => d.year=== selectedYear)
    if (da[0]==null){
        return <div > </div>
    };
    if(t=="Vaccinations" && da[0]["total_vaccinations_per_hundred"]==0) {
        return <div > </div>
    }
    let countrydata = da[0]['location']
    let title;
    let get;
    if (t=="Cases"){
        title="total cases per million"
        get= new Intl.NumberFormat().format(Math.round((da[0]["total_cases_per_million"])))
        // const lowerbound = new Intl.NumberFormat().format(colorScale.domain()[0]);
    }if(t=="Vaccinations"){
        title="total vaccinations per hundred"
        get = da[0]["total_vaccinations_per_hundred"]
    }if(t=="GrowthRate"){
        title="new cases per million"
        get = new Intl.NumberFormat().format(((da[0]["new_cases_per_million"])))
    }

    //console.log(da[get])
    if(t=="Cases"){
        return <div >
        <div style={divStyle1} key="tool" >
            <p stlye={textStyle } > {countrydata} <br></br>
             {MONTH[selectedMonth-1]+",  "+selectedYear}<br></br>{title+":  "+get}
            </p>
        </div>
    </div>
}else{

    
    return <div >
    <div style={divStyle2} key="tool" >
        <p stlye={textStyle } > {countrydata} <br></br>
         {MONTH[selectedMonth-1]+",  "+selectedYear}<br></br>{title+":  "+get}
        </p>
    </div>
</div>
}}

function P_dropdown(props) {
    const { data2, selectedCountry, setSelectedCountry, selectedCountryDD } = props;
    let emoji = ["1️⃣ ", "2️⃣ ", "3️⃣ ", "4️⃣ ", "5️⃣ ", "6️⃣ "]
    //setAxisArray

    return <div>

        {
            //loop for six times, generate dd for each axis
            display_dimensions.map((display, index) => {
                //each display is the name of the axis
                return <span key={"span" + index}>
                    {emoji[index]
                        // the real dropdown
                    }
                    <select name={"dd." + index} id={"dd." + index} style={{fontSize:'10px'}}
                        defaultValue={display}
                        onChange={event => {

                            let f = setAxisArray[index]
                            f(event.target.value)
                        }}>
                        {////then generate the dimensions inside dd
                            dimensions.map((di, index) => {
                                return <option key={"axis" + index + "option" + di} value={di}>{di}</option>
                            })
                        }
                    </select>
                </span>
            })
        }
    </div>
}

function LineChart(props){
    const {selectedCountry, selectedCountryDD, selectedCountryData, selectedCountryDDData}  = props;
    // console.log(selectedCountry);
    // console.log(selectedCountryDD);
    const xValue = d => d.time;
    const yValue1 = d => d.new_cases_per_million;
    const yValue2 = d => d.new_deaths_per_million;
    const concat =  selectedCountryData.concat(selectedCountryDDData);
    // console.log("hihi");
    // console.log(concat);
    // const yValue3 = d=> d.stringency_index;
    //concatanate two datasets
    const xScale = d3.scaleTime()
        .domain(d3.extent(concat, xValue))
        .range([0, LineChartWidth])
        .nice();
    const max_cases = d3.max(concat,  yValue1);
    const max_deaths = d3.max(concat,  yValue2);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max([max_cases, max_deaths])])
        .range([LineChartHeight, 0])
        .nice();
    const yScale2 = d3.scaleLinear()
        .domain([0,100])
        .range([LineChartHeight, 0]);
    const line1 = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.new_cases_per_million))
        .curve(d3.curveBasis)(selectedCountryDDData);
    
    const line2 = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.new_deaths_per_million))
        .curve(d3.curveBasis)(selectedCountryDDData);

    const line3 = d3.line()
        .x(d=> xScale(d.time))
        .y(d=> yScale2(d.stringency_index))
        .curve(d3.curveBasis)(selectedCountryDDData);
    
    const line1_map = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.new_cases_per_million))
        .curve(d3.curveBasis)(selectedCountryData);
    
    const line2_map= d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.new_deaths_per_million))
        .curve(d3.curveBasis)(selectedCountryData);

    const line3_map = d3.line()
        .x(d=> xScale(d.time))
        .y(d=> yScale2(d.stringency_index))
        .curve(d3.curveBasis)(selectedCountryData);
    
    // console.log("hi");
    // console.log(selectedCountryData);
    // console.log(selectedCountryDDData);
    // console.log(1);
    // console.log(line1);
    // console.log(2);
    // console.log(line2);
    // console.log(3);
    // console.log(line3);
    // console.log(line3_map);
    
    const formatTime = d3.timeFormat("%B, %Y");
    const parseTime = d3.timeParse("%B, %Y");
    const ticks = xScale.ticks(5).map(d => {
    
    return formatTime(d)});  
    // const divStyle = {
    //                 position: "absolute",
    //                 textAlign: "left",
    //                 width: `${LineChartWidth+50}`,
    //                 height: "80px",
    //                 padding: "2px",
    //                 font: "12px sans-serif",
    //                 // background: "lightgreen",
    //                 border: "3px",
    //                 borderRadius: "8px",
    //                 pointerEvents: "none",
    //                 // stroke: "blue"
    //             };

    return <g transform={`translate(${LineChartoffsetX}, ${LineChartoffsetY})`}>
            <path className={"line-path"} id={'cases'} d={line1} fill={"None"} stroke={"black"}  strokeWidth={'2px'} />
            <path className={'line-path'} id={"deaths"} d={line2} fill={"None"} stroke={"red"} strokeWidth={'2px'} />
            <path className={"line-path"} id={'stringency'} d={line3} fill={"None"} stroke={"green"}  strokeWidth={'2px'} />
  
            <path className={"line-path"} id={'cases'} d={line1_map} fill={"None"} stroke={"black"}  strokeWidth={'2px'} style={{'strokeDasharray': 4} }/>
            <path className={'line-path'} id={"deaths"} d={line2_map} fill={"None"} stroke={"red"} strokeWidth={'2px'} style={{'strokeDasharray': 4} }/>
            <path className={"line-path"} id={'stringency'} d={line3_map} fill={"None"} stroke={"green"}  strokeWidth={'2px'} style={{'strokeDasharray': 4} }/>

            
            <line x1={0} y1={LineChartHeight} x2={LineChartWidth} y2 = {LineChartHeight} stroke='black' strokeWidth={'2px'}/>
            <line y2={LineChartHeight} stroke='black' strokeWidth={'2px'}/>
            <line x1={LineChartWidth} x2={LineChartWidth} y2={LineChartHeight} stroke={'green'} strokeWidth={'2px'} />
            <text x={LineChartWidth} y={-10} style={{ textAnchor:'middle', font: 'italic 15px serif', fill: 'green'}} >
                    {'strictest'}
            </text>
            <foreignObject x= {-50} y={LineChartHeight+20} width={150} height={200}>       
                <p style={{fontSize:"10px", 'textAlign': "center",fontFamily: 'Verdana'}}>Number of new cases per million</p>
                <p style={{'fontSize':"10px", 'textAlign': "center", 'color': 'red', 'fontFamily': 'Verdana'}}>Number of new deaths per million</p>
            </foreignObject> 
            <foreignObject x= {LineChartWidth-80} y={LineChartHeight+35} width={150} height={200}>  
                <p style={{'fontSize':"10px", 'textAlign': "center", 'color': 'green', 'fontFamily': 'Verdana'}}>monthly avergae stringency index</p>
            </foreignObject> 
            
            {/* <rect x={0} y={-200} width={350} height={90} fill="none" stroke="black"/> */}
            <line x1={LineChartWidth/3} y1={LineChartHeight+LineChartHeight/6} x2={LineChartWidth/2} y2 = {LineChartHeight+LineChartHeight/6} stroke='black' strokeWidth={'5px'}/>
            <line x1={LineChartWidth/3} y1={LineChartHeight+LineChartHeight/4+5} x2={LineChartWidth/2} y2 = {LineChartHeight+LineChartHeight/4+5} stroke='red' strokeWidth={'5px'}/>
            <line x1={LineChartWidth/2+30} y1={LineChartHeight+LineChartHeight/5} x2={LineChartWidth/2+30+LineChartWidth/2-LineChartWidth/3} y2 = {LineChartHeight+LineChartHeight/5} stroke='green' strokeWidth={'5px'}/>
            {yScale.ticks().map(tickValue => 
                <g key={tickValue} transform={`translate(0, ${yScale(tickValue)})`}>
                    <line x2={10} stroke='black'/>
                    <text x={-5} y={5} style={{ textAnchor:'end', fontSize:'10px' }} >
                      {tickValue}
                    </text>
                    </g>
            )}
            {yScale2.ticks().map(tickValue => 
                <g key={tickValue} transform={`translate(${LineChartWidth}, ${yScale2(tickValue)})`}>
                    
                    <line x2={-10} stroke='green' strokeWidth={'2px'}/>
                    <text style={{ textAnchor:'end', fontSize:'10px' }} x={15} y={4}>
                        {tickValue}
                    </text>
                </g>
            )}
            {ticks.map(tickValue => {
                const str = tickValue.split(',');
            
                return <g key={tickValue} transform={`translate(${xScale(parseTime(tickValue))}, ${LineChartHeight})`}>
                    <line y2={8} stroke='black'/>
                    <text style={{textAnchor: 'middle', fontSize:'10px' }} x={0} y={12}>
                            {str[0]}
                    </text>
                    <text style={{textAnchor: 'middle', fontSize:'10px' }} x = {0} y={23}>
                            {str[1]}
                    </text>
                
                </g>
            })}         
        </g>
}  


function TheMap(props) {
    const { map, data, collection, cScale, month, year, countries, type, selectedCountry, 
        setSelectedCountry, selectedCountryDD, setSelectedCountryDD, setLeft,setTop,t,sett} = props;
    const filteredData = data.filter(d => d.month === month && d.year === year);
    // console.log(filteredData);
    
    // map={map} data={data} collection={collection} cScale={colorScale} month={month} year={year} countries={countries} type={"GrowthRate"}
    //             selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
    //             selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD}
    const opacity = d => d.iso_numeric === selectedCountry ? 1 : 0.6;
    const fill = function (d, cScale, type) {
        if (type === 'Vaccinations') {
            return cScale(d.total_vaccinations_per_hundred)
        } if (type == "Cases") {
            return cScale(d.total_cases_per_million)
        } if (type == "GrowthRate")
            return cScale(d.new_cases_per_million)
    };
    if (type === 'Cases') {
        const projection = d3.geoEqualEarth().fitExtent([[margin.left, margin.top], [WIDTH / 2, HEIGHT / 2 - offSet]], map);

        const path = d3.geoPath(projection);

        // const filteredData
        return <g>
            <path className={'sphere'} d={path({ type: 'Sphere' })} />
            {map.features.map(feature => {
                const country = filteredData.filter(d => d.iso_numeric === feature.id);
                if (country[0]) {

                    return <path key={feature.properties.name + "boundary"} className={"boundary"}
                        d={path(feature)} style={{ "fill": fill(country[0], cScale, type) }}
                        onMouseOver={(e) => { 
                            setSelectedCountry(country[0].iso_numeric); 
                            setLeft(e["clientX"]); 
                            setTop(e["clientY"]);
                            sett(type);
                            console.log("hi")
                        }}
                        onMouseOut={() => {
                            setLeft(0); setTop(0); setSelectedCountry(null)
                        }} opacity={opacity((country[0]))} />
                } else {
                    return <path key={feature.properties.name + "boundary"} className={"boundary"}
                        d={path(feature)} style={{ "fill": "#aba8a1" }}
                        onMouseOver={(e) => { 
                            setSelectedCountry(feature.id);
                             setLeft(e['clientX']); 
                             setTop(e['clientY']);
                             sett(type);
                            }}
                        onMouseOut={() => {
                            setSelectedCountry(null)
                            setLeft(0); setTop(0);
                            sett(null)
                        }} opacity={0.6} />
                }
            })}
        </g>
    } if (type === "Vaccinations" || type === "GrowthRate") {
        const projection = d3.geoEqualEarth().fitExtent([[margin.left, HEIGHT / 2 + offSet / 2], [WIDTH / 2, HEIGHT - margin.bottom - offSet / 2]], map);

        const path = d3.geoPath(projection);

        return <g>
            <path className={'sphere'} d={path({ type: 'Sphere' })} />
            {map.features.map(feature => {
                const country = filteredData.filter(d => d.iso_numeric === feature.id);

                if (country[0]) {
                    // console.log("below");
                    // console.log(country[0]);
                    
                    return <path key={feature.properties.name + "boundary"} className={"boundary"}
                        d={path(feature)} style={{ "fill": fill(country[0], cScale, type) }}
                        onMouseOver={(e) => { 
                            setSelectedCountry(country[0].iso_numeric); 
                             setLeft(e["clientX"]); 
                             setTop(e["clientY"]);
                             sett(type);
                             console.log(type)}
                            }
                        onMouseOut={() => {
                            setSelectedCountry(null)
                            setLeft(0); setTop(0);
                            sett(null)}
                        } opacity={opacity(country[0])} />
                } else {
                    return <path key={feature.properties.name + "boundary"} className={"boundary"}
                        d={path(feature)} style={{ "fill": "#aba8a1" }}
                        onMouseOver={(e) => { 
                            setSelectedCountry(feature.id); 
                            setLeft(e["clientX"]); 
                             setTop(e["clientY"]);
                             sett(type);
                             console.log(type)}
                         }
                        onMouseOut={() => {
                            setSelectedCountry(null)
                            setLeft(0); setTop(0);
                            sett(null)
                        }} opacity={0.6} />
                }
            })}
        </g>
    }
}

function Legend(props) {
    const { type, colorScale } = props;
    const xScale = d3.scaleLinear().domain([0, 99]).range([0, WIDTH / 2 - margin.left - margin.right]);
    var data = Array.from(Array(100).keys());
    const upperbound = new Intl.NumberFormat().format(colorScale.domain()[1]);

    if (type === 'Cases') {
        const interpolator = d3.interpolateYlOrRd;
        const cScale = d3.scaleSequential().interpolator(interpolator).domain([0, 99]);
        return <g transform={`translate(${margin.left},${HEIGHT / 2 - margin.bottom})`}>
                {data.map(d=> {
                return <rect key={"tclegend"+d} x = {(Math.floor(xScale(d)))} y = {0} height={20} width={d==99? 6: (Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1)}
               fill={cScale(d)} />})}
            <text y={-10} style={{textAnchor: 'middle', fontSize:'10px' }}>
                                {colorScale.domain()[0]}
                </text>
               <text x= {WIDTH/2-margin.left-margin.right} y={-20} style={{textAnchor: 'middle', fontSize:'10px' }}>
                                {upperbound}

                </text>
                <text  x= {WIDTH/2-margin.left-margin.right} y={-10} style={{textAnchor: 'middle', fontSize:'10px' }}>
                                {'confirmed cases per million'}
                </text>
        </g>
    } if (type === "Vaccinations") {
        const interpolator = d3.interpolateBlues;
        const cScale = d3.scaleSequential().interpolator(interpolator).domain([0, 99]);
        return <g transform={`translate(${margin.left},${HEIGHT - margin.bottom})`}>
               {data.map(d=> {
                return <rect key={"vaclegend"+d} x = {(Math.floor(xScale(d)))} y = {0} height={20} width={d==99? 6: (Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1)}
               fill={cScale(d)}/>})}
            <text y={-10} style={{textAnchor: 'middle', fontSize:'10px' }}>
                                {colorScale.domain()[0]}
                </text>
               <text x= {WIDTH/2-margin.left-margin.right} y={-20} style={{textAnchor: 'middle', fontSize:'10px' }}>
                                {upperbound}

                </text>
                <text  x= {WIDTH/2-margin.left-margin.right} y={-10} style={{textAnchor: 'middle', fontSize:'10px' }}>
                                {'vaccincations per hundred'}
                </text>
        </g>
    } if (type === "GrowthRate") {
        const interpolator = d3.interpolateOranges;
        const cScale = d3.scaleSequential().interpolator(interpolator).domain([0, 99]);
        const lowerbound = new Intl.NumberFormat().format(colorScale.domain()[0]);
        return <g transform={`translate(${margin.left},${HEIGHT - margin.bottom})`}>
            <text y={-10} style={{textAnchor: 'middle', fontSize:'10px' }}>
                                {lowerbound}
                </text>
               <text x= {WIDTH/2-margin.left-margin.right} y={-20} style={{textAnchor: 'middle', fontSize:'10px' }}>
                                {upperbound}

                </text>
                <text  x= {WIDTH/2-margin.left-margin.right} y={-10} style={{textAnchor: 'middle', fontSize:'10px' }}>
                                {'new cases per million'}
                </text>
            {data.map(d => {
                return <rect  key={"nclegend"+d}  x={(Math.floor(xScale(d)))} y={0} height={20} width={d == 99 ? 6 : (Math.floor(xScale(d + 1)) - Math.floor(xScale(d)) + 1)}
                    fill={cScale(d)} />
            })}

        </g>
    }
}
function VaccinationsMap(props) {
    const { map, data, collection, month, year, type, selectedCountry, setSelectedCountry, 
        selectedCountryDD, setSelectedCountryDD,setLeft,setTop ,t,sett} = props
    const countries = data.filter(d => d.iso_code.slice(0, 4) !== "OWID").map(d => d.location);
    const continents = data.filter(d => d.iso_code.slice(0, 4) === "OWID").map(d => d.location);
    
    const unique_countries = countries.filter((a, b) => countries.indexOf(a) === b);
    const unique_continents = continents.filter((a, b) => continents.indexOf(a) === b);
    if (type === "Vaccinations") {
        const processedData = data.filter(d=>d.total_vaccinations_per_hundred!='');
        const total_vaccinations = processedData.map(d => d.total_vaccinations_per_hundred);

        const colorScale = d3.scaleSequentialSymlog().interpolator(d3.interpolateBlues).domain([d3.min(total_vaccinations), d3.max(total_vaccinations)]);

        return <g>
          <rect x={50} y={LineChartHeight*2+230} height={20} width={50} fill={'#aba8a1'}/>
          <text x={LineChartWidth+15} y={LineChartHeight+180} style={{'fontSize':"20px", 'textAnchor': "middle",  'fontFamily': 'Verdana'}}>
        {'The Evolution of Vaccine Injections per Hundred'}

      </text>
      <text x={150} y={LineChartHeight*2+250} style={{'fontSize':"10px", 'textAnchor': "middle", 'fontFamily': 'Verdana'}}>
        {'no data available'}
      </text>
      

    
    <TheMap map={map} data={processedData} cScale={colorScale} month={month} year = {year} countries={countries} type={"Vaccinations"} 
    selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} 
    selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD} 
    setLeft={setLeft} setTop={setTop} t={t} sett={sett}/>
    <Legend  type={"Vaccinations"} colorScale={colorScale}/>
           
        </g>
    } else {
        const processedData = data.filter(d => d.new_cases_per_million!='');
        const new_cases = processedData.map(d => d.new_cases_per_million).sort(function(a, b){return a-b});
        // console.log(cases_growth_rate);
        const colorScale = d3.scaleSequentialSymlog().interpolator(d3.interpolateOranges).domain([new_cases[1], d3.max(new_cases)]);
        return <g>
         <rect x={50} y={LineChartHeight*2+230} height={20} width={50} fill={'#aba8a1'}/>
          <text x={LineChartWidth+15} y={LineChartHeight+180} style={{'fontSize':"20px", 'textAnchor': "middle",  'fontFamily': 'Verdana'}}>
        {'The Evolution of Monthly New Confirmed Cases per Million'}
        </text> 
       <text x={150} y={LineChartHeight*2+250} style={{'fontSize':"10px", 'textAnchor': "middle", 'fontFamily': 'Verdana'}}>
        {'no data available'}
       </text>
            <TheMap map={map} data={processedData} collection={collection} cScale={colorScale} month={month} year={year} countries={countries} type={"GrowthRate"}
                selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
                selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD}
                 setLeft={setLeft} setTop={setTop} t={t} sett={sett}/>
            <Legend type={"GrowthRate"} colorScale={colorScale} />
        </g>
    }
};

function CasesMap(props) {
    const { map, data, collection, month, year, type, selectedCountry, setSelectedCountry,
         selectedCountryDD, setSelectedCountryDD,setLeft,setTop ,t,sett} = props;
    const processedData = data.filter(d=>d.total_cases_per_million!='');
    // map={map} data={countrydata} collection={collection} month={selectedMonth} year={selectedYear} type={"Cases"}
    //             selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
    //             selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD}
    const countries = processedData.filter(d => d.iso_code.slice(0, 4) !== "OWID").map(d => d.location);
    const continents = processedData.filter(d => d.iso_code.slice(0, 4) === "OWID").map(d => d.location);
    const unique_countries = countries.filter((a, b) => countries.indexOf(a) === b);
    const unique_continents = continents.filter((a, b) => continents.indexOf(a) === b);
    const total_cases = processedData.map(d => d.total_cases_per_million);
    const colorScale = d3.scaleSequentialSymlog().interpolator(d3.interpolateYlOrRd).domain([d3.min(total_cases), d3.max(total_cases)]);
    return <g>
      <text x={LineChartWidth+15} y={20} style={{'fontSize':"20px", 'textAnchor': "middle",  'fontFamily': 'Verdana'}}>
        {"COVID: A Global Perspective until April 2021"} 
      </text> 
      <text x={LineChartWidth+15} y={40} style={{'fontSize':"20px", 'textAnchor': "middle", 'fontFamily': 'Verdana','strokeWidth': "20"}}>
      {'The Evolution of Total Confirmed Cases per Million'}
      </text>
      <text x={150} y={LineChartHeight+95} style={{'fontSize':"10px", 'textAnchor': "middle", 'fontFamily': 'Verdana'}}>
      {'no data available'}
      </text>
       <rect x={50} y={LineChartHeight+80} height={20} width={50} fill={'#aba8a1'}/>

        <TheMap map={map} data={processedData} collection={collection} cScale={colorScale} month={month} year={year} countries={countries} type={"Cases"}
            selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
            selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD} 
            setLeft={setLeft} setTop={setTop} t={t} sett={sett}/>
        <Legend type={"Cases"} colorScale={colorScale} />
    </g>
}

function Dropdown(props) {
    const { options, id, selectedValue, onSelectedValueChange } = props;
    return <div id={id}>
        <select defaultValue={selectedValue}
            onChange={event => { onSelectedValueChange(event.target.value) }}>
            {options.map(({ value, label }) => {
                return <option key={label} value={value}>
                    {label}
                </option>
            })}
        </select>
    </div>
}
function ContinentDropdown(props) {
    const { collection, id, selectedContinent, onSelectedContinentChange, selectedRegionOptions, onSelectedRegionOptionsChange,
        selectedCountryOptions, onSelectedCountryOptionsChange,onSelectedCountryChange} = props;
    
    // Safety check for collection
    if (!collection || collection.length === 0) {
        return <div>Loading continent options...</div>;
    }
    
    const continents = collection.map(d => d.continent);
    const continents_uq = continents.filter((a, b) => continents.indexOf(a) === b);
    const valueLabelPairs_continent = continents_uq.map(d => { return { 'value': d, 'label': d } });
    return <div id={id}>
        <select defaultValue={selectedContinent}
            onChange={event => {
                onSelectedContinentChange(event.target.value);
                const subRegions = collection.filter(d => d.continent === event.target.value).map(d => d['sub-region']);
                // const  valueLabelPairs_subRegion = subRegions.map(d=> {return {"value": d, "label": d}});
                onSelectedRegionOptionsChange(subRegions);
                const countries = collection.filter(d => d.continent === event.target.value).map(d => d['countries']);
                const countries_2 = [].concat.apply([], countries);
                const countries_3 = countries_2.map(d => d.country);
                onSelectedCountryOptionsChange(countries_3);
                const defaultCountry = collection.filter(d=> d.continent == event.target.value)[0]["countries"][0]
                onSelectedCountryChange(defaultCountry["iso_numeric"]);

            }}>
            {valueLabelPairs_continent.map(({ value, label }) => {
                return <option key={label} value={value}>
                    {label}
                </option>
            })}
        </select>
    </div>
}

function RegionDropdown(props){
    const {collection, id, selectedRegion, onSelectedRegionChange, selectedRegionOptions,
        selectedCountryOptions, onSelectedCountryOptionsChange,
        selectedCountry, onSelectedCountryChange} = props;
    
    // Safety check for selectedRegionOptions
    if (!selectedRegionOptions || selectedRegionOptions.length === 0) {
        return <div>Loading region options...</div>;
    }
    
    const valueLabelPairs_subRegion = selectedRegionOptions.map(d=> {return {"value": d, "label": d}});
    // console.log('hihihi');
    // console.log( selectedCountryOptions);
    // console.log(collection);
    return <div id={id}>
            <select defaultValue={selectedRegion}
            onChange={ event => {onSelectedRegionChange(event.target.value);
                const countries = collection.filter(d => d['sub-region'] === event.target.value);
                // console.log(countries);
                const countries_2 = countries[0]['countries'].map(d=>d.country);
                // console.log(countries_2);
                onSelectedCountryOptionsChange(countries_2);
                // onSelectedCountryChange()

                const defaultCountry = collection.filter(d=> d["sub-region"] === event.target.value)[0]
                    
                // console.log(defaultCountry);
                // console.log(defaultCountry['countries']);
                onSelectedCountryChange(defaultCountry['countries'][0]['iso_numeric']);
            }}>
            {valueLabelPairs_subRegion.map(({value, label}) => {
            return <option key={label} value={value}>
                    {label}
                </option>
            })}
        </select>
        </div>
    }

function CountryDropdown(props) {
    const { dataset2, collection, id, selectedRegion, selectedCountry, onSelectedCountryChange,
        selectedCountryOptions, onSelectedCountryOptionsChange } = props;
    // const countries = collection.filter(d => d['sub-region'] === selectedRegion);
    // console.log(countryOptions);   
    // console.log('hihihi');

    // Safety check for dataset2
    if (!dataset2 || !selectedCountryOptions) {
        return <div>Loading country options...</div>;
    }

    const valueLabelPairs_country = selectedCountryOptions.map(d => {
        const match = dataset2.filter(entry => entry.name === d)[0];
        if (match) {
            return { "value": match['country-code'], "label": match['name'] }
        } else {
            console.warn('No match found for country:', d);
            return { "value": "", "label": d }
        }
    });
    return <div>
        <Dropdown options={valueLabelPairs_country} id={"country"} selectedValue={selectedCountry} onSelectedValueChange={onSelectedCountryChange} />
    </div>
}

function BigDropdown(props) {
    const { dataset2, collection, id, selectedValue1, onSelectedValueChange1, selectedValue2,
        onSelectedValueChange2, selectedValue3, onSelectedValueChange3,
        selectedRegionOptions, onSelectedRegionOptionsChange,
        selectedCountryOptions, onSelectedCountryOptionsChange } = props;
    
    return <div id={id} style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)'}}>Continent</label>
            <ContinentDropdown collection={collection} id={"continent"} selectedContinent={selectedValue1} onSelectedContinentChange={onSelectedValueChange1}
                selectedRegionOptions={selectedRegionOptions} onSelectedRegionOptionsChange={onSelectedRegionOptionsChange}
                selectedCountryOptions={selectedCountryOptions} onSelectedCountryOptionsChange={onSelectedCountryOptionsChange}
                onSelectedCountryChange={onSelectedValueChange3}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)'}}>Region</label>
            <RegionDropdown collection={collection} id={"sub-region"} selectedRegion={selectedValue2} onSelectedRegionChange={onSelectedValueChange2} 
                selectedRegionOptions={selectedRegionOptions}
                selectedCountryOptions={selectedCountryOptions} onSelectedCountryOptionsChange={onSelectedCountryOptionsChange}
                selectedCountry={selectedValue3} onSelectedCountryChange={onSelectedValueChange3}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)'}}>Country</label>
            <CountryDropdown dataset2={dataset2} collection={collection} id={"country"} selectedRegion={selectedValue2}
                selectedCountry={selectedValue3} onSelectedCountryChange={onSelectedValueChange3}
                selectedCountryOptions={selectedCountryOptions} onSelectedCountryOptionsChange={onSelectedCountryOptionsChange} />
        </div>
    </div>
}
const COVID = () => {

    // Define dimensions here to avoid reference errors
    const dimensions = ['population_density', 'median_age', 'gdp_per_capita',
        'male_smokers', "female_smokers", 'handwashing_facilities', 'diabetes_prevalence', 'cardiovasc_death_rate'
        , 'hospital_beds_per_thousand', "stringency_index", "death_rate", "total_cases_per_million"];
    const display_dimensions = [dimensions[0], dimensions[dimensions.length - 1], dimensions[1], dimensions[dimensions.length - 2], dimensions[2], dimensions[dimensions.length - 3]];

    //set up the states
    const [selectedMonth, setSelectedMonth] = React.useState('4');
    const [selectedYear, setSelectedYear] = React.useState('2020');
    const [selectedCountry, setSelectedCountry] = React.useState(null);//this is the state for map
    const [selectedCountryDD, setSelectedCountryDD] = React.useState("004");
    const [selectedContinent, setSelectedContinent] = React.useState("Asia");//
    // use iso_numeric to identify country; DD is short for DropDown
    const [selectedAttribute, setSelectedAttribute] = React.useState("Vaccinations");
    const [axis0, setAxis0] = React.useState(display_dimensions[0]);
    const [axis1, setAxis1] = React.useState(display_dimensions[1]);
    const [axis2, setAxis2] = React.useState(display_dimensions[2]);
    const [axis3, setAxis3] = React.useState(display_dimensions[3]);
    const [axis4, setAxis4] = React.useState(display_dimensions[4]);
    const [axis5, setAxis5] = React.useState(display_dimensions[5]);
    const [selectedSubRegion, setSelectedSubRegion] = React.useState("Southern Asia");
    const [selectedRegionOptions, setSelectedRegionOptions] = React.useState(["Southern Asia", "Western Asia", "South-eastern Asia", "Eastern Asia", "Central Asia"]);
    const [selectedCountryOptions, setSelectedCountryOptions] = React.useState(["Afghanistan", "Bangladesh", "Bhutan", "India", "Iran (Islamic Republic of)", "Maldives", "Nepal", "Pakistan", "Sri Lanka"]);
    
    var [left, setLeft] = React.useState(0);
    var [top, setTop] = React.useState(0);
    var [t, sett] = React.useState(null);
    // Update display_dimensions with current axis values
    const currentDisplayDimensions = [axis0, axis1, axis2, axis3, axis4, axis5];
    setAxisArray = [setAxis0, setAxis1, setAxis2, setAxis3, setAxis4, setAxis5]


    //Use the data
    const rawData = useData(csv1, csv2, isoCode);
    const rawDataObj = rawData || {};
    const dataset1 = rawDataObj.dataset1;
    const dataset2 = rawDataObj.dataset2;
    const dataset3 = rawDataObj.dataset3;
    const map = useMap(mapUrl);
    const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // data2 = useData2(csv2);
    
    console.log('Component render - rawData:', rawData);
    console.log('Component render - dataset1 length:', dataset1 ? dataset1.length : 0);
    console.log('Component render - dataset2 length:', dataset2 ? dataset2.length : 0);
    console.log('Component render - dataset3 length:', dataset3 ? dataset3.length : 0);
    console.log('Component render - map:', map);
    
    // Add more detailed debugging
    if (!map) {
        return <div className="loading">Loading map data...</div>;
    }
    
    if (!dataset1 || dataset1.length === 0) {
        return <div className="loading">Loading COVID-19 data... ({dataset1 ? dataset1.length : 0} records)</div>;
    }
    
    if (!dataset2 || dataset2.length === 0) {
        return <div className="loading">Loading demographic data... ({dataset2 ? dataset2.length : 0} records)</div>;
    }
    
    if (!dataset3 || dataset3.length === 0) {
        return <div className="loading">Loading country codes... ({dataset3 ? dataset3.length : 0} records)</div>;
    }
    
    console.log('All data loaded successfully!'); 

    // Safety check for collection processing
    if (!dataset3 || dataset3.length === 0) {
        return <div className="loading">Processing geographic data...</div>;
    }

    const continents = dataset1.filter(d => d.iso_code.slice(0, 4) === "OWID").map(d => d.location);//continents categorization by the first dataset
    const continents2 = dataset3.map(d => d.region);//continents categorization by the second dataset; we follow this typology
    const unique_continents2 = continents2.filter((a, b) => continents2.indexOf(a) === b);
    const continentsSubRegionCollection = [];
    unique_continents2.map(continent => {
        const SubRegions = dataset3.filter(entry => entry['region'] == continent).map(d => d['sub-region']);
        const uniqueSubRegions = SubRegions.filter((a, b) => SubRegions.indexOf(a) === b);
        continentsSubRegionCollection.push({ 'continent': continent, 'sub-region': uniqueSubRegions })

    });
    // console.log(continentsSubRegionCollection);

    const collection = [];
    continentsSubRegionCollection.map(pair => {
        const lstOfRegions = pair['sub-region'];
        lstOfRegions.map(region => {
            const countries = dataset3.filter(d => d['sub-region'] == region);
            const countries_uq = countries.filter((a, b) => countries.indexOf(a) === b);
            const countries_uq2 = countries_uq.map(d => { return { 'iso_numeric': d["country-code"], 'country': d.name, 'continent': d.region, 'sub-region': region } });
            collection.push({ 'continent': pair['continent'], 'sub-region': region, 'countries': countries_uq2 })
        })
    });

    collection.forEach(d => {
        if (d.continent == '') {
            d['sub-region'] = d.countries[0].country;
            d['continent'] = d.countries[0].country;
        }
    });

    // Safety check for collection
    if (!collection || collection.length === 0) {
        return <div className="loading">Preparing visualization data...</div>;
    }

    countrydata = dataset1.filter(d => d.iso_code.slice(0, 4) !== "OWID")
    const continentdata = dataset1.filter(d => d.iso_code.slice(0, 4) === "OWID")//we will use only country-specific data otherwise there will be bug
    // console.log(continentdata);
    const changeHandler = (event) => {
        setSelectedMonth(event.target.value);
    }

    const options1 = [{ "value": "2020", "label": "2020" }, { "value": "2021", "label": "2021" }];
    const options2 = [{ "value": "Vaccinations", "label": "Vaccinations per Hundred" }, { "value": "GrowthRate", "label": "New Cases per Million" },];
    const selectedCountryData = dataset1.filter(d=> d.iso_numeric === selectedCountry);
    const selectedCountryDDData = dataset1.filter(d=> d.iso_numeric === selectedCountryDD);
    return <div>



        {/* Main Visualization */}
        <div className="visualization-container">
            {/* Map Controls */}
            <div className="map-controls">
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px'}}>
                    <label className="control-label">Month:</label>
                    <input 
                        key="slider" 
                        type='range' 
                        min='1' 
                        max='12' 
                        value={selectedMonth} 
                        step='1' 
                        onChange={changeHandler} 
                        style={{flex: 1, minWidth: '120px'}} 
                    />
                    <input 
                        key="monthText" 
                        type="text" 
                        value={MONTH[selectedMonth-1]} 
                        readOnly 
                        className="month-display" 
                        style={{minWidth: '60px', textAlign: 'center'}}
                    />
                </div>
                
                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    <Dropdown options={options1} id={"dropdown1"} selectedValue={selectedYear} onSelectedValueChange={setSelectedYear} />
                    <Dropdown options={options2} id={"dropdown2"} selectedValue={selectedAttribute} onSelectedValueChange={setSelectedAttribute} />
                </div>
            </div>

            {/* Geographic Controls */}
            <div className="map-controls" style={{marginTop: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <label className="control-label">Location:</label>
                </div>
                <BigDropdown dataset2={dataset3} collection={collection} id={"big-dropdown"} selectedValue1={selectedContinent} onSelectedValueChange1={setSelectedContinent}
                    selectedValue2={selectedSubRegion} onSelectedValueChange2={setSelectedSubRegion}
                    selectedValue3={selectedCountryDD} onSelectedValueChange3={setSelectedCountryDD}
                    selectedRegionOptions={selectedRegionOptions} onSelectedRegionOptionsChange={setSelectedRegionOptions}
                    selectedCountryOptions={selectedCountryOptions} onSelectedCountryOptionsChange={setSelectedCountryOptions} />
            </div>
            
            <svg width={WIDTH} height={HEIGHT}>
                <CasesMap map={map} data={countrydata} collection={collection} month={selectedMonth} year={selectedYear} type={"Cases"}
                    selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
                    selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD} 
                    setLeft={setLeft} setTop={setTop} t={t} sett={sett}/>
                <VaccinationsMap map={map} data={countrydata} collection={collection} month={selectedMonth} year={selectedYear} type={selectedAttribute}
                    selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
                    selectedCountryDD={selectedCountryDD} setSelectedCountryDD={setSelectedCountryDD} 
                    setLeft={setLeft} setTop={setTop} t={t} sett={sett}/>
                <LineChart selectedCountry={selectedCountry} selectedCountryDD={selectedCountryDD} 
                    selectedCountryData={selectedCountryData} selectedCountryDDData={selectedCountryDDData}/>
                <g transform={`translate(0, ${margin1.top})`}>
                    <Tooltip selectedCountry={selectedCountry} data2={dataset2}
                        dataset1={dataset1} />
                </g>
            </svg>
        </div>
         <Tooltip1 left={left} top={top} selectedCountry={selectedCountry} selectedMonth={selectedMonth} 
        selectedYear={selectedYear} selectedAttribute={selectedAttribute} dataset1={dataset1} t={t}/> 
        
        {/* Analysis Section */}
        <div className="card">
            <h2>What factors impact COVID-19 spread?</h2>
            <p style={{marginBottom: '24px'}}>
                Explore the relationship between various demographic and health factors and COVID-19 outcomes. 
                Use the dropdown below to change the axis variables and discover correlations.
            </p>
            <p style={{fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px'}}>
                <strong>Note:</strong> "Hand-washing facilities" refers to the share of the population with basic handwashing facilities on premises, 
                most recent year available (Our World in Data).
            </p>
            
            <P_dropdown data2={dataset2} selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                selectedCountryDD={selectedCountryDD} />
        </div>
      
        {/* Parallel Coordinates Chart */}
        <div className="visualization-container">
            <h3 style={{marginBottom: '16px'}}>Parallel Coordinates Analysis</h3>
            <svg width={pwidth + margin1.left + margin1.right} height={pheight + margin1.top + margin1.bottom}>
                <g transform={`translate(${margin1.left}, ${margin1.top})`}>
                    <ParallelChart data2={dataset2} selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        selectedCountryDD={selectedCountryDD} />
                </g>
            </svg>
        </div>
    </div>

}


ReactDOM.render(<COVID/>, document.getElementById('root'));