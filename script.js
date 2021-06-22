// parts that are toggled to be hidden & visible
const submitModal = document.getElementById('submit-modal');
const backdrop = document.body.firstElementChild;
const openingText = document.getElementById('entry-text');


// buttons that are clickable
const addItem = document.querySelector('header div button:first-child');
const showAll = addItem.nextElementSibling;

const cancel = document.querySelector('button');
const submit = cancel.nextElementSibling;


const userInputs = document.querySelectorAll('input');

const listRoot = document.getElementById('item-list');
const finalNode = document.getElementById('final-price');


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
// toggle display & hide opening text
const updateUI = () => {
    if (items.length === 0) {
        openingText.style.display = 'block';
    } else {
        openingText.style.display = 'none';
    };
};

// clear user's input
const clearUserInputs = () => {
    userInputs[0].value = '';
};


// show item into main page and update its UI
const showOutput = (inputData) => {

    // codes below are to show the processed output on the page
    const newItemList = document.createElement('li');
    newItemList.className = 'item-element';
    newItemList.innerHTML = `
    <div class="item-element__info">
        <div>${actionType}</div>
        <div>${typeOfBudget}</div>
        <div>${date}</div>
        <div>${detail}</div>
        <div>${amount}</div>
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
    const inputtedItem = userInputs[0].value;

    // check if the user entered the right rating value
    if ( inputtedItem.trim() === '' ) {
        alert('Please Enter the Right Value');
        return;
    } else {
        // enter the newly input item data to items array and show it
        const newItem = { 
            item: inputtedItem 
        };
        items.push(newItem);
        console.log(items);

        // clear the inputs in the dialog box, and then close it
        clearUserInputs();
        addItemHandler();

        // show the added item on the page and toggle 'Your shopping list' display
        showOutput(newItem.item);
        updateUI();
    };
};

const showAllHandler = () => {
    if (showAllClicked) {
        return;
    } else {
        const finalPrice = document.createElement('li');
        finalPrice.className = 'final-element';
        finalPrice.innerHTML = `
        <div class="final-price">

        </div>
        `;
        finalNode.append(finalPrice);

        showAllClicked = true;
    };
};

// event listener
addItem.addEventListener('click', addItemHandler);
showAll.addEventListener('click', showAllHandler);

backdrop.addEventListener('click', addItemHandler);

cancel.addEventListener('click', addItemHandler);
submit.addEventListener('click', submitHandler);