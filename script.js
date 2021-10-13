// chart setup
var context = document.getElementById("myChart").getContext("2d");

var chartLabels = []
var popuChartData = [];
var incomeChartData = [];

function updateChart() {
    chartLabels.push(time);
    popuChartData.push(population);
    incomeChartData.push(perPersonIncome);

    myChart.data.labels = chartLabels;
    myChart.data.datasets[0].data = popuChartData;
    myChart.data.datasets[1].data = incomeChartData;

    myChart.update();
}
var myChart = new Chart(context, {
    type: 'line',
    data: {
        labels: chartLabels,
        datasets: [
            {
                label: "Population",
                data: popuChartData,
                backgroundColor:"cornflowerblue",
                borderColor:"cornflowerblue",
                yAxisID:"Ypopulation"
            },
            {
                label: "Per Person Income",
                data: incomeChartData,
                backgroundColor:"darkcyan",
                borderColor:"darkcyan",
                yAxisID:"Yppincome"
            }
        ]
    },
    options: {
        legend: {
            position:"right"
        },
        scales: {
            Ypopulation: {
                title: {
                    display: true,
                    text: 'Population'
                  },
                min:0,
                max:12000,
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {stepSize: 3000}
            },
            Yppincome: {
                title: {
                    display: true,
                    text: 'Per Person Income'
                  },
                min: 0,
                max: 21,
                type: 'linear',
                display: true,
                position: 'right',
                ticks: {stepSize: 5},
                grid: {drawOnChartArea: false},
            }
              }
        }
});

//canvas setup
function canvasSetup() {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
}

//declaring variables
var time = 0;
var techMultiplier = 1;
var population = 0;
var birthrate = 1;
var totalIncome = 0;
var perPersonIncome = 0;
var essentialStats = [time,techMultiplier, population, totalIncome, perPersonIncome, birthrate];
const record = [];
var slider = 0;

//defining the year object + reusable functions
function Year(time, techMultiplier, population, birthrate, totalIncome, perPersonIncome) {
    this.time = time;
    this.techMultiplier = techMultiplier;
    this.population = population;
    this.birthrate = birthrate;
    this.totalIncome = totalIncome;
    this.perPersonIncome = perPersonIncome;
}

function recordYear() {
    var year = new Year(time, techMultiplier, population, birthrate, totalIncome, perPersonIncome);
    record.push(year);
}

function refreshStats() {
    $("#Year_").text(time);
    $("#Popu_").text(population);
    $("#Tech_").text(techMultiplier);
    $("#tIncome_").text(totalIncome);
    $("#ppIncome_").text(perPersonIncome);
    $("#Birth_").text(birthrate);
}

function loadYear(year) {
    time = record[year].time;
    techMultiplier = record[year].techMultiplier;
    population = record[year].population;
    birthrate = record[year].birthrate;
    totalIncome = record[year].totalIncome;
    perPersonIncome = record[year].perPersonIncome;
}

//calculations
function calculateOutput(popu) {
    var result = 100000-100000*((9998/10000)**popu);
    return Math.round((result + Number.EPSILON) * 100) / 100;
}

function calculateBirth(pIncome) {
    var result = 1-(15-pIncome)/50;
    return Math.round((result + Number.EPSILON) * 1000) / 1000;
}

//setup functions
function updateSlider(slideAmount) {
    var sliderDiv = document.getElementById("popuNumber");
    sliderDiv.innerHTML = slideAmount;
    slider = slideAmount;
}

function setPopulation(popu) {
    drawCircle();
    population = popu;
    refreshStats();
    recordYear();
    loadYear(0);
    drawPopu(population,perPersonIncome);
    time++;
}
//drawing dot
function drawCircle(xPos, yPos, radius, color) {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
    ctx.stroke();    
    ctx.fillStyle = color;
    ctx.fill();
}

function drawPopu(popu, income) {
    var color = "cornflowerblue";
    var radius = 2.5+0.8*(income-12);
    for(var n=0; n<(popu/10); n++) {
        var xPos = Math.random()*canvas.width;
        var yPos = Math.random()*canvas.height;
        drawCircle(xPos, yPos, radius, color);
    }
}

function clearCanvas() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//simulation manipulation functions
function nextYear() {
    // if (record.length > time + 1) {
    //     loadYear(time+1);
    //     refreshStats();
    //     clearCanvas();
    //     drawPopu(population,perPersonIncome);
    //     time++;
    // } else {
        population = Math.round(population * (birthrate - 0.05 + 0.1*Math.random()));
        totalIncome = Math.round(techMultiplier * calculateOutput(population));
        perPersonIncome = totalIncome / population;
        perPersonIncome = Math.round((perPersonIncome + Number.EPSILON) * 100) / 100
        birthrate = calculateBirth(perPersonIncome);
        refreshStats();
        updateChart();
        clearCanvas();
        drawPopu(population,perPersonIncome);
        recordYear();
        time++;
        
    // }
}

function lastYear() {
    time = record[parseInt(time-1)].time-1;
    population = record[parseInt(time-1)].population;
    techMultiplier = record[parseInt(time-1)].techMultiplier;
    totalIncome = record[parseInt(time-1)].totalIncome;
    perPersonIncome = record[parseInt(time-1)].perPersonIncome;
    birthrate = record[parseInt(time-1)].birthrate;
    refreshStats();
    clearCanvas();
    drawPopu(population,perPersonIncome);
}

function techImprovement() {
    techMultiplier = Math.round((techMultiplier + 0.1)*100)/100;
    refreshStats();
    document.getElementById("#Tech").style.color="red";
}

function disease() {
    population = Math.round(population*0.7);
    refreshStats();
}


