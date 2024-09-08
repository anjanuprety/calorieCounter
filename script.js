const calorieCounter = document.getElementById('calorie-counter'); 
// Fetches the calorie counter form element from the DOM to handle form submission

const budgetNumberInput = document.getElementById('budget'); 
// Fetches the input for the calorie budget from the DOM for later calculations

const entryDropdown = document.getElementById('entry-dropdown'); 
// Fetches the dropdown menu element for selecting meal/exercise entries

const addEntryButton = document.getElementById('add-entry'); 
// Fetches the "Add Entry" button element to add a new meal or exercise entry

const clearButton = document.getElementById('clear'); 
// Fetches the "Clear" button element to reset the form

const output = document.getElementById('output'); 
// Fetches the output element to display the calorie balance

let isError = false; 
// A flag to track whether an error occurs during input validation

function cleanInputString(str) { 
  // Removes unwanted characters (+, -, spaces) from the input string
  const regex = /[+-\s]/g; 
  return str.replace(regex, ''); 
}

function isInvalidInput(str) { 
  // Checks if the input string contains scientific notation (invalid input for this form)
  const regex = /\d+e\d+/i; 
  return str.match(regex); 
}

function addEntry() { 
  // Adds a new meal or exercise entry to the form based on the user's dropdown selection
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`); 
  // Finds the specific input container (breakfast, lunch, etc.) based on the dropdown selection
  
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1; 
  // Determines the next entry number by counting existing inputs
  
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`; 
  // Generates HTML for a new input entry with labels for name and calories

  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString); 
  // Inserts the new input fields into the corresponding meal/exercise section
}

function calculateCalories(e) { 
  // Handles the calorie calculation when the form is submitted
  e.preventDefault(); 
  // Prevents the default form submission behavior (page refresh)
  isError = false; 
  // Resets the error flag before calculating

  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]'); 
  // Fetches all number inputs in the breakfast section

  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]'); 
  // Fetches all number inputs in the lunch section

  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]'); 
  // Fetches all number inputs in the dinner section

  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]'); 
  // Fetches all number inputs in the snacks section

  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]'); 
  // Fetches all number inputs in the exercise section

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs); 
  // Sums the calories from all breakfast entries

  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs); 
  // Sums the calories from all lunch entries

  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs); 
  // Sums the calories from all dinner entries

  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs); 
  // Sums the calories from all snack entries

  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs); 
  // Sums the calories burned from all exercise entries

  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]); 
  // Retrieves the calorie budget entered by the user

  if (isError) { 
    // If an error occurred during input validation, the calculation is aborted
    return; 
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories; 
  // Calculates total calories consumed from all meals

  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories; 
  // Calculates the remaining calories by subtracting consumed calories and adding exercise calories to the budget

  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit'; 
  // Determines whether there is a calorie surplus or deficit

  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `; 
  // Updates the output element with a summary of the calories consumed, burned, and the budget

  output.classList.remove('hide'); 
  // Makes the output visible to the user
}

function getCaloriesFromInputs(list) { 
  // Sums the calories from a list of input fields and handles invalid input
  let calories = 0; 
  // Initializes the calorie count

  for (const item of list) { 
    // Loops through each input element in the list
    const currVal = cleanInputString(item.value); 
    // Cleans the input string by removing unwanted characters

    const invalidInputMatch = isInvalidInput(currVal); 
    // Checks if the input contains scientific notation (invalid input)

    if (invalidInputMatch) { 
      // If an invalid input is found, an alert is shown, and the error flag is set
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true; 
      // Sets the error flag to true to indicate invalid input
      return null; 
      // Stops the function if invalid input is detected
    }
    calories += Number(currVal); 
    // Adds the valid calorie input to the total
  }
  return calories; 
  // Returns the total calories
}

function clearForm() { 
  // Resets the form, clearing all entries and hiding the output
  const inputContainers = Array.from(document.querySelectorAll('.input-container')); 
  // Selects all input containers (breakfast, lunch, dinner, etc.)

  for (const container of inputContainers) { 
    // Loops through each container and clears its content
    container.innerHTML = ''; 
    // Removes all input fields from the container
  }

  budgetNumberInput.value = ''; 
  // Clears the budget input field

  output.innerText = ''; 
  // Clears the output text

  output.classList.add('hide'); 
  // Hides the output section
}

addEntryButton.addEventListener("click", addEntry); 
// Adds an event listener to the "Add Entry" button to add a new meal/exercise entry when clicked

calorieCounter.addEventListener("submit", calculateCalories); 
// Adds an event listener to the form to calculate calories when submitted

clearButton.addEventListener("click", clearForm); 
// Adds an event listener to the "Clear" button to reset the form when clicked