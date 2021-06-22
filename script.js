// parts that are toggled to be hidden & visible
const addModal = document.getElementById('add-modal');
const backdrop = document.body.firstElementChild;
const openingText = document.getElementById('entry-text');

// buttons that are clickable
const addItem = document.querySelector('header div button:first-child');
const cancel = document.querySelector('button');
const add = cancel.nextElementSibling;
const totalAll = document.querySelector('header div button:last-child');


const userInputs = document.querySelectorAll('input');

const listRoot = document.getElementById('item-list');
const finalNode = document.getElementById('final-price');


const items = [];


// This is for totalSalesTax & totalPrice 
let  totalSalesTax = 0,
     totalPrice = 0;


// this is for making the add item & total button not working if the total button has been clicked 
let totalAllClicked = false;


/* 
 * This is the main concept of this application UI/UX design
 * This addItemHandler will make 'add item dialog box' visible and overshadow the 'main page' 
 * Then when the item is added by clicking 'add' button in 'add item dialog box', 
 *      the 'add item dialog box' will be hidden & its textbox value is cleared 
 *      the 'main page' will show up where that new item is added
 
*/
const addItemHandler = () => {
    if (totalAllClicked) {
        return;
    } else {
        addModal.classList.toggle('visible');
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
    // this is to obtain the needed value from inputted data
    let modifInput = inputData.split(' '),
        quantity = modifInput[0] * 1,
        inputPrice = modifInput[(modifInput.length - 1)] * 1,
        itemName = modifInput.slice(1, (modifInput.length -2)).join(' ');    

    // now do the calculation
    const freeTaxRegex = /book|pill|chocolate/;
    let taxPercentage = 0,
        salesTaxInteger = 0,
        salesTaxDecimal = 0;

    // tax percentage rule
    if (itemName.includes('imported')) taxPercentage += 0.05; 
    if (!freeTaxRegex.test(itemName)) taxPercentage += 0.1;

    // the round-up rule calculation
    salesTax = inputPrice * taxPercentage;
    salesTaxInteger = Math.floor(salesTax);
    salesTaxDecimal = salesTax - salesTaxInteger;


    // if there exist decimal value for the salexTax, then it must be rounded up
    let decimalValue = 0;
    if (salesTaxDecimal) {
        decimalValue = salesTaxDecimal.toString().split('.')[1];

        let firstDecimal = decimalValue[0] * 1,
            secondDecimal = decimalValue[1] * 1;

        if (secondDecimal > 0 && secondDecimal <= 5) {
            decimalValue = (firstDecimal * 10) + 5;
        } else if (secondDecimal > 5) {
            decimalValue = (firstDecimal + 1) * 10;
        } else if (secondDecimal === 0) {
            decimalValue = firstDecimal * 10;
        };
    };


    salesTax = (salesTaxInteger.toString() + '.' + decimalValue.toString()) * 1 * quantity;
    outputPrice = ((inputPrice * quantity) + salesTax).toFixed(2);


    totalSalesTax += salesTax;
    totalPrice += outputPrice * 1;

    // codes below are to show the processed output on the page
    const newItemList = document.createElement('li');
    newItemList.className = 'item-element';
    newItemList.innerHTML = `
    <div class="item-element__info">
        <div>${quantity}</div>
        <div>${itemName}</div>
        <div>${outputPrice}</div>
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
const addHandler = () => {
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

const totalHandler = () => {
    if (totalAllClicked) {
        return;
    } else {
        const finalPrice = document.createElement('li');
        finalPrice.className = 'final-element';
        finalPrice.innerHTML = `
        <div class="final-price">
            <div>
                <h2>Sales Tax</h2>
                <h2>${totalSalesTax.toFixed(2)}</h2>
            </div>
            <div>
                <h2>Total Price</h2>
                <h2>${totalPrice.toFixed(2)}</h2>
        </div>
        `;
        finalNode.append(finalPrice);

        totalAllClicked = true;
    };
};

// event listener
addItem.addEventListener('click', addItemHandler);
backdrop.addEventListener('click', addItemHandler);
cancel.addEventListener('click', addItemHandler);
add.addEventListener('click', addHandler);
totalAll.addEventListener('click', totalHandler);