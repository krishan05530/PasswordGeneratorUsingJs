const inputslider=document.querySelector("[data-LengthSlider]");
const lengthdisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkcount=0;

handleSlider();//
// ste strength circle color to grey
setindicator("#ccc");

// it set the password length
function handleSlider(){    // it reflect the password length on ui
inputslider.value=passwordLength;
lengthdisplay.innerText=passwordLength;

//this to find , kitne % part ko background col se fill karna he, width ,height 
const min = inputslider.min;
const max = inputslider.max;
inputslider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}

//  set indicator  -> yeh input paramter bala color set kardeta he ,strength indicator
function setindicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    // shadow
}

function getRndInteger(min,max) // in the range of min , max it generate the rand no
{
      return  Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateLowerCase()
{
     return String.fromCharCode(getRndInteger(97,123)); // it gives 97 to 123 ascii code ke liye  char 

}

function generateUpperCase()
{
     return String.fromCharCode(getRndInteger(65,91));

}

function generateSymbol()
{
  const randNum=getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);// charAT method is used to get the car at the index 
}



// to calculate the strength of , and set the color of indicator
// hasupper is variable 
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setindicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setindicator("#ff0");
    } else {
      setindicator("#f00");
    }
}


async function copyContent()  //use to copy from clipboard
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); // this method is use to copy from clipboard
        copyMsg.innerText="Copied";
    }
    catch(e)
    {
       copyMsg.innerText="failed";   // error handling alos
    }
     
    // to make copy  wala span visible 
    copyMsg.classList.add("active"); // active is added as class in thi

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
    
}

  function shufflePassword(array)
  {
// fisher yates method to shuffle an array

for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
let str = "";
array.forEach((el) => (str += el));
return str;

  }

function handlecheckBoxChange()
{
    checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkcount++;
    })
// special condition
if(passwordLength<checkcount)
{
    passwordLength=checkcount;
    handleSlider(); // too reflect same change 
}
}


 
// apllied evenlistner on alll the checkbox
allCheckBox.forEach((checkbox)=>{  // using checkbox to add addeventlistner to eacg checkbox
    checkbox.addEventListener('change',handlecheckBoxChange);
})

inputslider.addEventListener('input',(e)=>{
    passwordLength=e.target.value; // here if there is chnage in sliding line, the password length also change 
    handleSlider();  // callled to it reflect the changes on the ui
})



// copy button, if password display wali field me password display he to copyContent call kardo 
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})
    

// generate password
generateBtn.addEventListener('click',()=>{
    //none of the checkbox is selected
    if(checkcount<=0)return;

    if(passwordLength<checkcount)
    {
        passwordLength=checkcount;
        handleSlider();
    }

    // lets find new password
console.log("starting the journey");
    // remove old password
    password = "";

    //lets put stuff mentioneed by checkbox(kon se kon se box check he )

    // if(uppercaseCheck.checked)
    // {
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked)
    // {
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked)
    // {
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
    
      let funcArr=[]; // pushing all the box inarray which are checked 
      if(uppercaseCheck.checked)
      funcArr.push(generateUpperCase);

      if(lowercaseCheck.checked)
      funcArr.push(generateLowerCase);

      if(numbersCheck.checked)
      funcArr.push(generateRandomNumber);

      if(symbolsCheck.checked)
      funcArr.push(generateSymbol);

       // compulory addition // jo click he unhe to dalana he hi
       for(let i=0;i<funcArr.length;i++)
       {
        password+=funcArr[i]();
       }
       console.log("compalsory addiotn done");

       // remainging addition  
       for(let i=0; i<passwordLength-funcArr.length;i++)
       {
        let randindex=getRndInteger(0,funcArr.length);// we want index value ,till the indec array is full , so we can have value from the index (0,4)
         password+=funcArr[randindex]();
       }
       console.log("remainning addition dine");
       // shuffle the password
        password=shufflePassword(Array.from(password));
    
        console.log("suffling is  done");
        // show in ui
         passwordDisplay.value=password;
         console.log("c0mpalsory 1 is  done");
         // now show its strength so calculate its strength
         calcStrength();

        


    
})