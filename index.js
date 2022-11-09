const singleDayContainer = document.getElementById("days_of_the_month");
const buttonNext = document.querySelector('button.next');

function createDataSet(year,month,day){
    let currentDate = new Date(year,month,day);
    if(!year&&!month&&!day){
        currentDate = new Date();
    }
    
    const currentDateText = currentDate.toLocaleDateString();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDay = new Date(currentYear,currentMonth,1);
    const lastDay = new Date(currentYear,currentMonth+1,0);
    return {
        currentDate,currentDateText,day:currentDay,month:currentMonth,year:currentYear,firstDay,lastDay
    }
}

function displayCurrentDate(dateText){
    document.getElementById("date_clicked").textContent=dateText;
}

buttonNext.addEventListener('click',function(event) {
    const currentDateString = event.target.dataset.date;
    const currentDate = new Date(currentDateString);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    singleDayContainer.innerHTML = '';
    console.log(singleDayContainer.childNodes)
    renderCalendar(year,month,day);
})



//wyświetl numer dni miesiąca
function displayNumberDaysInMonth(lastDay) {
    return lastDay.getDate();
}

//wyświetl dni
function displayDays(daysNumber){
    const arrayDaysInMonth = [];
        for (let i = 1; i <= daysNumber; i++){
     arrayDaysInMonth.push(i);
    }
    return arrayDaysInMonth;
}

function renderCalendar(currentYear,currentMonth,currentDay){
    const {month,year,day,lastDay,firstDay,currentDateText} = createDataSet(currentYear,currentMonth,currentDay);
    displayCurrentDate(currentDateText);
     //dni w miesiącu
     const daysinMonth = displayNumberDaysInMonth(lastDay);
     //tablica dni miesiąca
    const daysArray= displayDays(daysinMonth);
    //stwórz puste okna dni misiąca
    renderEmptyDivs(firstDay);

    daysArray.forEach((dayNumber) => {
        const dayElement = document.createElement("div");
        dayElement.textContent = dayNumber;
        dayElement.className = "single_day";
        if (dayNumber === day){
            dayElement.className = "single_day today";
        }
        singleDayContainer.append(dayElement);
    });
    const nextDate = new Date (year,month+1,day);
    buttonNext.setAttribute("data-date",`${nextDate.getFullYear()}-${('0'+ (nextDate.getMonth()+1)).slice(-2)}-${('0'+ nextDate.getDate()).slice(-2)}`);
}
renderCalendar();


function renderEmptyDivs(firstDay){
    const weekDay= firstDay.getDay();
    const emptyDivNumber = weekDay ? weekDay - 1 : 6;
    for (let i = 0; i<emptyDivNumber; i++){
        const emptyDiv = document.createElement('div');
        emptyDiv.className = "single_day";
        singleDayContainer.append(emptyDiv);
    }
}