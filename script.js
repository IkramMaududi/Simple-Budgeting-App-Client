// parts that are toggled to be hidden & visible
const submitModal = document.getElementById('submit-modal'),
      backdrop = document.body.firstElementChild,
      entryText = document.getElementById('entry-text');


// buttons that are clickable
const addItem = document.querySelector('header div button:first-child'),
      showAll = addItem.nextElementSibling;

const cancel = document.querySelector('button'),
      submit = cancel.nextElementSibling;


const userInputs = document.querySelectorAll('input'),
      date = userInputs[2],
      detail = userInputs[3],
      amount = userInputs[4],
      username = userInputs[5];

const listRoot = document.getElementById('item-list'),
      showIncome = document.getElementById('show-income'),
      showExpense = showIncome.nextElementSibling;


const urlSendData = 'http://localhost:3001/user/addition',
      urlReceiveData = 'http://localhost:3001/user/showall';


// this is array that will be shown in the UI
const items = [];


// this is for making the add item & total button not working if the total button has been clicked 
let showAllClicked = false;


/* 
 * This is the main concept of this application UI/UX design
 * This addItemHandler will make 'add item dialog box' visible and overshadow the 'main page' 
 * Then when the item is added by clicking 'add' button in 'add item dialog box', 
 *      the 'add item dialog box' will be hidden & its textbox value is cleared 
 *      the 'main page' will show up where that new item is added
*/
const addItemHandler = () => {
    if (showAllClicked) {
        return;
    } else {
        submitModal.classList.toggle('visible');
        backdrop.classList.toggle('visible');
    };
};
// // toggle display & hide opening text
// const updateUI = () => {
//     if (items.length === 0) {
//         entryText.style.display = 'block';
//     } else {
//         entryText.style.display = 'none';
//     };
// };

// clear user's input
const clearUserInputs = () => {
      date.value = '';
      detail.value = '';
      amount.value = '';
};



// this is the function to show recent activities -- only simple add expense / income
const showRecent = (inputData) => {
    // codes below are to show the processed output on the page
    const newItemList = document.createElement('li');
    newItemList.className = 'item-element';
    newItemList.innerHTML = `
    <div class="item-element__info">
        <div>${inputData}</div>
   </div>
    `;
    listRoot.append(newItemList);
};


/* when an item is added, the process that happens in order is 
 * 1. the inputted item is pushed into item array 
 * 2. the input dialog box is cleared
 * 3. the add item dialog box & main page are toggled, and when one is shown the other will be hidden
 * 4. the new inputted item is appended to the main page in a container 
 *    if the inputted item is still 0, then the 'show your invoice here' is shown, else it will be hidden
*/
const submitHandler = () => {
    // assign the entered user values to variables
    let actionType = document.querySelector('input[name="action_type"]:checked').value,
        inputDate = date.value,
        inputDetail = detail.value,
        inputAmount = amount.value,
        inputUsername = username.value;


    // check if the user entered the right value
    if ( inputDetail.trim() === '' || inputDate === '' || inputAmount === '' || inputUsername.trim() === '') {
        alert('Please fill the blank(s)');
        return;
    } else {
        // define the data that want to be sent & shown
        const newItem = { 
            actionType,
            inputDate,
            inputDetail,
            inputAmount,
            inputUsername
        };

        // send data to backend first
        const sendOption = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        };

        // console.log(sendOption);

        fetch(urlSendData, sendOption)
        .then(res => res.json())
        .then(data =>  {
            // console.log(data)
            let responseMessage = '';
            if (data.working) {
                responseMessage = data.message;

                items.push(responseMessage);
                showRecent(responseMessage);
            };
        });

        // clear the inputs in the dialog box, and then close it
        clearUserInputs();
        addItemHandler();

        // updateUI();
    };
};




// this is the function to show fetched data from backend
const showBackEndData = (type, date, detail, amount) => {
        const newItemList = document.createElement('li');
        newItemList.className = 'item-element';
        newItemList.innerHTML = `
        <div class="item-element__info">
            <div>${date}</div>
            <div>${detail}</div>
            <div>${amount}</div>
        </div>
        `;

        if (type === 'income') {
            showIncome.append(newItemList);
        } else if (type === 'expense') {
            showExpense.append(newItemList);
        };
};
const showNoRecord = (type) => {
        const newItemList = document.createElement('li');
        newItemList.className = 'item-element';
        newItemList.innerHTML = `
        <div class="item-element__info">
            <div>No record yet</div>
        </div>
        `;
        if (type === 'income') {
            showIncome.append(newItemList);
        } else if (type === 'expense') {
            showExpense.append(newItemList);
        };
}
const showAllHandler = () => {
    let inputUsername = username.value;

    // check if the user entered the right value & this showAll button can only be cliked once 
    // if it want to be clicked again, the page has to be refreshed 
    if (showAllClicked) {
        return;
    } else if ( inputUsername.trim() === '') {
        alert('Please fill your username');
        return;
    } else {
        // send data to backend first
        const toSend = { inputUsername };
        const sendOption = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toSend)
        };

        // fetch data from backend
        fetch(urlReceiveData, sendOption)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            const income = data.dataIncome,
                  expense = data.dataExpense;
            
            if (income) {
                // iterate through the array and for each array within, show it to the UI
            } else {
                showNoRecord(income);
            };
            
            if (expense) {
                // iterate through the array and for each array within, show it to the UI
            } else {
                showNoRecord(expense);
            };

        showAllClicked = true;
        });
    };
};

// event listener
addItem.addEventListener('click', addItemHandler);
showAll.addEventListener('click', showAllHandler);

backdrop.addEventListener('click', addItemHandler);

cancel.addEventListener('click', addItemHandler);
submit.addEventListener('click', submitHandler);