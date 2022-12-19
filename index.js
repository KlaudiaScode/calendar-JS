const singleDayContainer = document.getElementById('days_of_the_month');
const buttonNext = document.querySelector('button.next');
const buttonBack = document.querySelector('button.back');
const buttonAdd = document.querySelector('#add');
const buttonClose = document.querySelector('#close');
const taskDateElement = document.querySelector('#date');
const todoListContainer = document.querySelector('ul.todo_list');
const task = document.querySelector('div.task');
const input = document.querySelector('input.time');


const replaceSaveWithEditEvent = new Event ('replaceSaveWithEdit');

document.addEventListener('replaceSaveWithEdit',function(event){
    const elementSave = document.querySelector('.save');
    const parentSave = elementSave.parentElement;
    parentSave.removeChild(elementSave);
    const buttonEdit = createEditButton(event.lineIndex);
    parentSave.appendChild(buttonEdit);
})

const replaceEditWithSaveEvent = new Event('replaceEditWithSave');

document.addEventListener('replaceEditWithSave',function(event){
    const el = document.querySelector('.to_remove');
    const parentEl = el.parentElement;
    parentEl.removeChild(el);
    const buttonSave = document.createElement('button');
    buttonSave.className = 'save';
    buttonSave.addEventListener('click',function(clickEvent){
        clickEvent.preventDefault();
        const timeTask = parentEl.querySelector('.event-time');
        const span = parentEl.querySelector('.event-content');
        timeTask.contentEditable = false;
        timeTask.style.backgroundColor = '#c5cbe3';
        span.contentEditable = false;
        span.style.backgroundColor = '#c5cbe3';
        const date = document.getElementById('date').textContent;
        const currentEvent = JSON.parse(localStorage.getItem(date) || '{}');
        const oldTime = timeTask.dataset.time;
        const newTime = timeTask.textContent;
        const currentTask = {...currentEvent[oldTime]};
        if(oldTime !== newTime){
            delete currentEvent[oldTime];
        }
        currentTask.time = newTime;
        currentTask.contents = span.textContent;
        currentEvent[newTime] = currentTask;
        localStorage.setItem(date, JSON.stringify(currentEvent));
        replaceSaveWithEditEvent.lineIndex = event.lineIndex;
        document.dispatchEvent(replaceSaveWithEditEvent);
    });
    parentEl.appendChild(buttonSave);
})

//funckja tworzenia daty 
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
//funckja wyświetlania obecnej daty 
function displayCurrentDate(dateText){
    document.getElementById('date_clicked').textContent = dateText;
}
//funckja przeładowania kalendarza
function rerenderCalendar(event){
    const currentDateString = event.target.dataset.date;
    const currentDate = new Date(currentDateString);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    singleDayContainer.innerHTML = '';
    renderCalendar(year,month,day);
}

buttonNext.addEventListener('click',rerenderCalendar);
buttonBack.addEventListener('click',rerenderCalendar);
//funkcja wyświetlania liczb dni miesiąca
function displayNumberDaysInMonth(lastDay) {
    return lastDay.getDate();
}
//funkcja wyświetlania dni 
function displayDays(daysNumber){
    const arrayDaysInMonth = [];
        for (let i = 1; i <= daysNumber; i++){
     arrayDaysInMonth.push(i);
    }
    return arrayDaysInMonth;
}
//renderowanie kalendarza
function renderCalendar(currentYear,currentMonth,currentDay){
    const {month,year,day,lastDay,firstDay,currentDateText} = createDataSet(currentYear,currentMonth,currentDay);
    displayCurrentDate(currentDateText);
    const daysinMonth = displayNumberDaysInMonth(lastDay);
    const daysArray= displayDays(daysinMonth);
    renderEmptyDivs(firstDay);
    daysArray.forEach((dayNumber) => {
        const dayElement = document.createElement('div');
        dayElement.textContent = dayNumber;
        dayElement.className = 'single_day proper_day';
        if (dayNumber === day){
            dayElement.className = 'single_day proper_day today';
        }
        const date = `${year}-${('0' + (month + 1)).slice(-2)}-${('0' + dayNumber).slice(-2)}`;
        const storageData = localStorage[date];
        if(storageData){
            dayElement.className = 'single_day proper_day deadline';
        }
        dayElement.setAttribute('data-date',date);
        singleDayContainer.append(dayElement);
    });
    const nextDate = new Date (year,month+1,day);
    buttonNext.setAttribute('data-date',`${nextDate.getFullYear()}-${('0'+ (nextDate.getMonth()+1)).slice(-2)}-`
      +('0'+ nextDate.getDate()).slice(-2));
    const backDate = new Date (year,month-1,day);
    buttonBack.setAttribute('data-date',`${backDate.getFullYear()}-${('0'+ (backDate.getMonth()+1)).slice(-2)}-${('0'+ backDate.getDate()).slice(-2)}`);
}
renderCalendar();
//funkcja tworzenia pustych okien w kalendarzu
function renderEmptyDivs(firstDay){
    const weekDay = firstDay.getDay();
    const emptyDivNumber = weekDay ? weekDay - 1 : 6;
    for (let i = 0; i < emptyDivNumber; i++){
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'single_day';
        singleDayContainer.append(emptyDiv);
    }
} 
//PD.zmienić adresowanie po id na klasę event-time i event-content
//funckja tworzenia przycisku do edycji 
function createEditButton(index){
    console.log('createEditButton index',index)
    const buttonEdit = document.createElement('button');
    buttonEdit.setAttribute('class','edit');
    console.log('index',index);
    buttonEdit.setAttribute('data-index',index.toString());
    buttonEdit.addEventListener('click',function(event){
        event.preventDefault();
        const parent = event.target.parentElement;
        const timeTask = parent.querySelector('.event-time');
        timeTask.contentEditable = true;
        timeTask.style.backgroundColor = '#fff';
        const span = parent.querySelector('.event-content');
        span.contentEditable = true;
        span.style.backgroundColor = '#fff';
        event.target.className = event.target.className + ' to_remove';
        replaceEditWithSaveEvent.lineIndex = index;
        document.dispatchEvent(replaceEditWithSaveEvent);
    })
    return buttonEdit;
}
//nasłuchiwanie na kliknięcie pojedyńczego dnia w miesiącu 
singleDayContainer.addEventListener('click',function(event){
    if(event.target.className.includes('proper_day')){
        location.search = '?currentDate='+event.target.dataset.date;
    }
})
//otwieranie okna z terminarzem na wybrany dzień miesiąca
function openDayEdit(date){
    task.className = 'task add_task';
    taskDateElement.textContent = date;
    const existingEvents = getFromLocalStorageByDate(date);
    todoListContainer.innerHTML = '';
    Object.keys(existingEvents).forEach((time,index)=>{
        const event = existingEvents[time];
        const li = document.createElement('li');
        const timeTask = document.createElement('span');
        //const label = document.createElement('label');
        const buttonEdit = createEditButton(index);
        const span = document.createElement('span');
        const checkobox = document.createElement('input');
        timeTask.className ='event-time';
        timeTask.setAttribute('data-time', event.time);
        timeTask.textContent = event.time;
        span.textContent = event.contents;
        span.className ='event-content';
        checkobox.setAttribute('type','checkbox');
        if(event.done){
            checkobox.setAttribute('checked',event.done);
        }
        checkobox.addEventListener('click',function(event){
            const dateEvents = getFromLocalStorageByDate(date);
            const currentEvent = dateEvents[time];
            const done = event.target.checked;
            const newCurrentEvent = {
                ...currentEvent,
                done
            }
            const newDateEvents = {
                ...dateEvents,
                [time]: newCurrentEvent
            }
            localStorage.setItem(date,JSON.stringify(newDateEvents));
        })
        // label.append(checkobox);
        // label.append(span);
        li.append(timeTask);
        //li.append(label);
        li.append(checkobox);
        li.append(span);
        li.append(buttonEdit);
        todoListContainer.append(li);
    })
}
//nasłuchiwanie na kliknięcie w przycisk do zamykania okna z terminarzem
buttonClose.addEventListener('click',function(event){
    task.className = 'task';
})
//nasłuchiwanie na kliknięcie w przycisk ADD
buttonAdd.addEventListener('click',function(event){
    event.preventDefault();
    const date = taskDateElement.textContent;
    const taskTime = input.value;
    const form = document.getElementById('form');
    const formData = new FormData(form);
    formData.append('date', date);
    formData.append('done', false);
    const formDataObject = {};
    for (let value of formData.entries()){
        console.log(value);
        formDataObject[value[0]] = value[1];
    }
    if(!taskTime){
        alert('nie podano godziny')
        return;
    }
    const existingEvents = getFromLocalStorageByDate(date);

    if (existingEvents[formDataObject.time]){
        if(!window.confirm('Wydarzenie o godzinie ' + formDataObject.time + ' już istnieje, czy chcesz nadpisać?')){
            return;
        }
    }
    existingEvents[formDataObject.time] = formDataObject;
    localStorage.setItem(date, JSON.stringify(existingEvents));
    location.reload();
})
//funkcja dodawania daty do pamięci lokalnej
function getFromLocalStorageByDate(date){
    const storageElement = localStorage.getItem(date);
    const existingEvents = storageElement ? JSON.parse(storageElement) : {};
    return existingEvents;
}

window.addEventListener('load',function(index){
    const currentDate = (new URLSearchParams(location.search)).get('currentDate');
    if(currentDate){
        openDayEdit(currentDate);
    }
})