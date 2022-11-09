const singleDayContainer = document.getElementById("days_of_the_month");
const buttonNext = document.querySelector('button.next');
const buttonBack = document.querySelector('button.back');
//funckja tworzenia daty 
function createDataSet(year,month,day){
    //zmienna zawierająca obecną datę
    let currentDate = new Date(year,month,day);
    //warunek jeśli nie ma roku,mieisąca i daty 
    if(!year&&!month&&!day){
        //to zmienna zawiera datę obecną
        currentDate = new Date();
    }
    //zmienna zawierająca datę zamienioną na string
    const currentDateText = currentDate.toLocaleDateString();
    //zmienna zawierająca obecny dzień
    const currentDay = currentDate.getDate();
    //zmienna zawierająca obecny miesiąc
    const currentMonth = currentDate.getMonth();
    //zmienna zawierająca obecny pełny rok
    const currentYear = currentDate.getFullYear();
    //zmienna zawierająca pierwszy dzień
    const firstDay = new Date(currentYear,currentMonth,1);
    ////zmienna zawierająca ostatni dzień
    const lastDay = new Date(currentYear,currentMonth+1,0);
    //zwróć obiekt z wymienionych {zmiennych}
    return {
        currentDate,currentDateText,day:currentDay,month:currentMonth,year:currentYear,firstDay,lastDay
    }
}
//funkcja wyświetlająca obecną datę
function displayCurrentDate(dateText){
    //wyświetlanie w elemencie z html dateText
    document.getElementById("date_clicked").textContent = dateText;
}
//funckja odświeżająca zawartość kalendarza 
function rerenderCalendar(event){
    //zmienna przechowująca element html na którym wyświetlana jest obecna data
    const currentDateString = event.target.dataset.date;
    //zmienna zawierająca obecną datę
    const currentDate = new Date(currentDateString);
    //obecny rok
    const year = currentDate.getFullYear();
    //obecny miesiąc
    const month = currentDate.getMonth();
    //obecny dzień miesiąca
    const day = currentDate.getDate();
    //czyszczenie pól wyświetlających dni misiąca  
    singleDayContainer.innerHTML = '';
    //wywołanie funckji na dacie 
    renderCalendar(year,month,day);
}
//nasłuchiwanie na kliknięcie przycisku NEXT w celu wywołania funkcji odświeżającej zawartość kalendarza
buttonNext.addEventListener('click',rerenderCalendar);
//nasłuchiwanie na kliknięcie przycisku BACK w celu wywołania funkcji odświeżającej zawartość kalendarza
buttonBack.addEventListener('click',rerenderCalendar);

//funckja wyświetlania ilości dni w miesiącu
function displayNumberDaysInMonth(lastDay) {
    //zwraca ostatni dzień miesiąca
    return lastDay.getDate();
}

//funkcja wyświetlania dni 
function displayDays(daysNumber){
    //zmienna zawierająca pustą tablice na dni 
    const arrayDaysInMonth = [];
    //pętla po numerach dni 
        for (let i = 1; i <= daysNumber; i++){
    //dodanie do zmiennej ciągu iteracji z pętli w formie liczb
     arrayDaysInMonth.push(i);
    }
    //zwraca tablicę z ciągiem dni danego miesiąca
    return arrayDaysInMonth;
}
//funkcja tworzenia kalendarza 
function renderCalendar(currentYear,currentMonth,currentDay){
    //zmienna operująca na wymienionych zmiennych zawierająca stworzoną datę
    const {month,year,day,lastDay,firstDay,currentDateText} = createDataSet(currentYear,currentMonth,currentDay);
    //wywołanie funkcji wyświtlającej obecną datę
    displayCurrentDate(currentDateText);
    //zmienna zawierająca ilość dni w miesiącu 
    const daysinMonth = displayNumberDaysInMonth(lastDay);
    //zmienna zawierająca pojedyncze dni miesiąca
    const daysArray= displayDays(daysinMonth);
    //wywołanie funkcji tworzenia pustych dni/okien
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
    //zmienna zawierająca następny miesiąc
    const nextDate = new Date (year,month+1,day);
    //dodanie atrybutu do przycisku NEXT 
    buttonNext.setAttribute("data-date",`${nextDate.getFullYear()}-${('0'+ (nextDate.getMonth()+1)).slice(-2)}-`
      +('0'+ nextDate.getDate()).slice(-2));

    //zmienna zawierająca poprzedni miesiąc
    const backDate = new Date (year,month-1,day);
    //dodanie atrybutu do prycisku BACK
    buttonBack.setAttribute("data-date",`${backDate.getFullYear()}-${('0'+ (backDate.getMonth()+1)).slice(-2)}-${('0'+ backDate.getDate()).slice(-2)}`);
}
//wywołanie funkcji tworzenia kalendarza
renderCalendar();

//funckja tworząca puste dni/okna w odpowienim dniu tygodnia
function renderEmptyDivs(firstDay){
    //zmienna dzień tygodnia przechowująca pierwszy dzień miesiąca pod odpowiednim dniem tygodnia
    const weekDay = firstDay.getDay();
    //zmienna pustego dnia/okna przechowująca skrócony warunek jeśli ma zawartość podanej zmiennej to odejmij od niej jeden w innym razie 6
    const emptyDivNumber = weekDay ? weekDay - 1 : 6;
    //pętla po pustych dniach/oknach w tygodniu 
    for (let i = 0; i < emptyDivNumber; i++){
        //zmienna zawierająca element html 'div'
        const emptyDiv = document.createElement('div');
        //nadanie zmiennej klasy w html
        emptyDiv.className = "single_day";
        //dodanie do zbioru pojedynczych dni/okien puste okna dni tygodnia
        singleDayContainer.append(emptyDiv);
    }
}