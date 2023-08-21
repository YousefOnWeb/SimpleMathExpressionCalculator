// operators precedence specifies priority of performing each type of
// operation. larger value 
const precedence = {
    "/": 2,
    "*": 2,
    "+": 1,
    "-": 1,
}

// determines the end value of a math expression that is in postfix notation
function evaulateMath(postfixExpression = []) {

    //holds indexes of arithmetic operators in the postfix expression
    var operatorPositions = []
    for (var i = 0; i < postfixExpression.length; i++) {
        if (isNaN(postfixExpression[i])) {
            operatorPositions.push(i);
        }
    }

    // main part that does the evaluation math, here is what it does:
    // for each operator occurrence in the postfix expression, replace the operator
    // and the two numbers on the left of it (its two operands),
    // replace them with a single number which is their result
    for (var i = 0; i < operatorPositions.length; i++) {
        var operationResult;
        var operator = postfixExpression[operatorPositions[i] - 2 * i];
        var leftOperand = Number(postfixExpression[operatorPositions[i] - 2 - 2 * i]);
        var rightOperand = Number(postfixExpression[operatorPositions[i] - 1 - 2 * i]);

        if (operator === '/') {
            operationResult = leftOperand / rightOperand;
        }
        else if (operator === '-') {
            operationResult = leftOperand - rightOperand;
        }
        else if (operator === '*') {
            operationResult = leftOperand * rightOperand;
        }
        else if (operator === '+') {
            operationResult = leftOperand + rightOperand;
        }

        // replace the left operand with the result value
        postfixExpression[operatorPositions[i] - 2 - 2 * i] = operationResult;
        // remove the two other remaining tokens (the right operand and the operator)
        postfixExpression.splice(operatorPositions[i] - 1 - 2 * i, 2);


        // side hint:
        // the part "- 2 * i" is repeated above when accessing tokens in the postfix expression by index,
        // the reason for this is:
        // as it has already been explained, for each operator occurrence, we replace it and its two operands with their result,
        // so in each loop cycle, THREE tokens in the postfix expression are replaced with ONE token,
        // which is a decrease in the overall length of tokens by a value of two (-3 +1). 
        // (a derease in the length in our case is a shift for the indexes)
    }
    return postfixExpression[0];
}

// returns a postfix copy of an infix expression
function infixToPostfix(infixExpression = "") {
    var postfixExpression = []; // list to store tokens of postfix expression (returned)
    var symbols = ""; // string holding symbols from the infix expression. used as a stack.
    infixExpression = "#" + infixExpression + "#"; // surrounding infix with a unique char to act as a terminator

    var left = 1, right = 1;
    while (right < infixExpression.length) {

        // responsible for handling plus and minus existing as a sign and not as an operator..
        // they are detected by checking if they are in the beginning of a sub-expression
        if (
            (infixExpression.charAt(right) === '-' ||
                infixExpression.charAt(right) === '+') 
				&&
            (infixExpression.charAt(right - 1) === '(' ||
                infixExpression.charAt(right - 1) === '#'
            )
        ) {
            infixExpression = infixExpression.substring(0, right) +
                '0' + infixExpression.substring(right, infixExpression.length);
        }

        // responsible for handling multiplication operators that are not explicitly expressed, example:
        // the expression '3(5)' has a hidden multiplication operator, or equivalent to this: '3*(5)'
        // another example: (2)(4) ===equivalently===> (2)*(4)
        if (right < infixExpression.length - 1 &&
            infixExpression.charAt(right + 1) === '(' &&
            (infixExpression.charAt(right) === ')' || !isNaN(infixExpression.charAt(right)))
        ) {
            infixExpression = infixExpression.substring(0, right + 1) + "*"
                + infixExpression.substring(right + 1, infixExpression.length);
        }

        // use the current char to know if the currently scanned number has ended, to store it,
        // or if it has not ended to increase its end position by one
        // and process [separating symbols] on the go
        if (isNaN(infixExpression.charAt(right)) &&
            infixExpression.charAt(right) !== '.') {
            if (right > left) {
                postfixExpression.push(infixExpression.substring(left, right));
            }
            symbols = symbols + infixExpression.charAt(right);
            right++; left = right;
        }
        else {
            right++;
        }


        while (symbols.length >= 2 &&
            symbols.charAt(symbols.length - 1) === ')'
        ) {
            while (symbols.charAt(symbols.length - 2) !== '(') {
                postfixExpression.push(symbols.charAt(symbols.length - 2));
                symbols = symbols.substring(0, symbols.length - 2) + ')';
            }
            symbols = symbols.substring(0, symbols.length - 2);
        }

        while (
            symbols.charAt(symbols.length - 1) !== '(' &&
            symbols.charAt(symbols.length - 2) !== '(' &&

            precedence[symbols.charAt(symbols.length - 1)] <=
            precedence[symbols.charAt(symbols.length - 2)]
        ) {

            postfixExpression.push(symbols.charAt(symbols.length - 2));

            symbols = symbols.substring(0, symbols.length - 2) +
                symbols.charAt(symbols.length - 1);
        }


    }

    symbols = symbols.substring(0, symbols.length - 1);
    symbols = symbols.split("").reverse().join("");
    symbols = Array.from(symbols);
    postfixExpression = postfixExpression.concat(symbols);

    return postfixExpression;
}


var displayBox = document.querySelector(".display");

// array  for storing all button elements
var buttonElements = [];

document.querySelectorAll("td").forEach((tableCell) => {
    if (tableCell.className !== "display") {
        buttonElements.push(tableCell);
    }
});


buttonElements.forEach(
    (buttonElement) => {
        var buttonExecution = function () { };
        if (buttonElement.textContent === '=') {
            buttonExecution = function () {
                try {
                    displayBox.textContent = evaulateMath(infixToPostfix(
                        displayBox.textContent
                    ));
                } catch (errorEvaluatingExpression) {
                    alert("Error!");
                    console.log("Error");
                }
            };
        }
        else if (buttonElement.textContent === "⌫") {
            buttonExecution = function () {
                displayBox.textContent = displayBox.textContent.substring(0,
                    displayBox.textContent.length - 1);
            };
        }
        else {
            buttonExecution = function () {
                displayBox.textContent += buttonElement.textContent;
            };
        }
        buttonElement.addEventListener("click", buttonExecution)
    }
)