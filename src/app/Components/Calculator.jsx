"use client";
import { useEffect, useState } from "react";
import Display from "./Display";
import NumKey from "./NumKey";
import OperatorKey from "./OperatorKey";
import Decimal from "./Decimal";
import Clear from "./Clear";
import Equals from "./Equals";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";
import Copy from "./Copy";


function Calculator() {
    const [state, setState] = useState({
        currentValue: "0",
        previousValue: null,
        operator: null,
        expectingNumber: true,
        lastWasOperator: false,
        waitingForNegative: false,
    });
    
    const handleNumPress = (num) => {
        const { currentValue, expectingNumber, lastWasOperator, waitingForNegative } = state;
        
        const newValue = waitingForNegative ? `-${num}` : num.toString();

        if (currentValue === "0" || !expectingNumber || lastWasOperator) {
            setState({ ...state, currentValue: newValue, expectingNumber: true, lastWasOperator: false, waitingForNegative: false })
        } else {
            setState((prevState) => ({...prevState, 
                currentValue: prevState.currentValue + num.toString(),
                expectingNumber: true,
                lastWasOperator: false,
                waitingForNegative: false,
            }));
        }
      };

    const handleOperatorPress = (op) => {
        
        const { previousValue, currentValue, operator, lastWasOperator, waitingForNegative } = state;
       
        if (lastWasOperator) {
          if (op === "-" && !waitingForNegative) {
              // Set up for negative number
              setState({
                  ...state,
                  waitingForNegative: true
              });
              return;
          }
          
          // If we get another operator after being set up for negative,
          // use this as the actual operator
          if (waitingForNegative) {
              setState({
                  ...state,
                  operator: op,
                  waitingForNegative: false,
                  lastWasOperator: true
              });
              return;
          }
          
          // For other consecutive operators, just update the operator
          setState({
              ...state,
              operator: op,
              waitingForNegative: false,
              lastWasOperator: true
          });
          return;
      }

      // Handle minus as a negative sign at the start
      if (op === "-" && previousValue === null && currentValue === "0") {
          setState({
              ...state,
              currentValue: "-",
              expectingNumber: true,
              lastWasOperator: false,
              waitingForNegative: false
          });
          return;
      }

      if (previousValue !== null && operator !== null && !lastWasOperator) {
          const result = evaluate(previousValue, currentValue, operator);
          setState({
              previousValue: result.toString(),
              operator: op,
              currentValue: "0",
              expectingNumber: true,
              lastWasOperator: true,
              waitingForNegative: false
          });
      } else {
          setState({
              previousValue: currentValue,
              operator: op,
              currentValue: "0",
              expectingNumber: true,
              lastWasOperator: true,
              waitingForNegative: false
          });
      }
  };

    const handleClearPress = () => {
        setState({
            currentValue: "0",
            previousValue: null,
            operator: null,
            expectingNumber: true,
            lastWasOperator: false,
            waitingForNegative: false,
        });
    };

    const handleEqualsPress = () => {
        const { previousValue, currentValue, operator} = state;

        if (previousValue !== null && operator !== null) {
            const result = evaluate(previousValue, currentValue, operator);
            setState({
                previousValue: null,
                operator: null,
                currentValue: result.toString(),
                expectingNumber: true,
                lastWasOperator: false
            });
        }
    };

    const handleDecimalPress = () => {
        const { currentValue, expectingNumber,lastWasOperator } = state;

        if (!currentValue.includes(".")) {
          if (!expectingNumber || lastWasOperator) {
            setState({
              ...state,
              currentValue: "0.",
              expectingNumber: true,
              lastWasOperator: false
            })
          } else {
            setState((prevState) => ({
                ...prevState,
                currentValue: prevState.currentValue + ".",
                expectingNumber: true,
                lastWasOperator: false
            }));
        }
    };
  }

    const evaluate = (a, b, op) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b)

        switch (op) {
            case "+":
             return (numA + numB).toString();
            case "-":
             return (numA - numB).toString();
            case "*":
             return (numA * numB).toString();
            case "/":
              if (numB === 0) return "Error, numbers cannot be dividided by 0"
             return (numA / numB).toString();    
            default: 
            return ""; 
        }
    };

    useEffect(() => {
      const handleKeyDown = (e) => {
        const key = e.key;

        if (/^\d$/.test(key)) {
          handleNumPress(Number(key));
          return
        }
        
        const operatorMap = {
          '+': '+',
          '-': '-',
          '*': '*',
          'x': '*',
          'X': '*',
          '/': '/'
        }
        
        if (key in operatorMap) {
          e.preventDefault();
          handleOperatorPress(operatorMap[key])
          return;
        }

        if (key === "=" || key === "Enter") {
          handleEqualsPress();
        }

        if (key === "c" || key === "C" || key === "Backspace") {
          handleClearPress();
        }
        
        if (key === ".") {
          handleDecimalPress();
        }
      };
              
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown)
    }
  }, [state]);
    
    const nums = [
      {
        num: 1,
        name: "one"
      },
      {
        num: 2,
        name: "two"
      },
      {
        num: 3,
        name: "three"
      },
      { num: 4,
        name: "four"
      },
      {
        num: 5,
        name: "five"
      },
      {
        num: 6,
        name: "six"
      },
      {
        num: 7,
        name: "seven"
      },
      {
        num: 8,
        name: "eight"
      },
      {
        num: 9,
        name: "nine"
      },
      { num:0,
        name: "zero"
      }];
   
      const operators = [{
      id:"add",
      operator: "+",
    },{
      id: "subtract",
      operator: "-",
    },{
      id: "multiply",
      operator: "*",
    },{
      id: "divide",
      operator: "/"
    }];
  

    return (
    <div id="calculator">
    <Display value={state.currentValue} />
    <Clear onClear={handleClearPress}/>
    <div id="numpad">
    {nums.map((num) => (
        <NumKey key={num.name} id={num.name} num={num} onPress={handleNumPress}
        />
    ))}
    <Decimal onDecimal={handleDecimalPress}/>
    <Equals onEquals={handleEqualsPress}/>
    </div>
    <div id="ops-pad">
    {operators.map((item) => (
        <OperatorKey 
          key={item.id}
          {...item}
          onPress={handleOperatorPress}
        />
        ))}
    </div>
    <Copy result={state.currentValue} />
    </div>
    )
}
  

export default Calculator;