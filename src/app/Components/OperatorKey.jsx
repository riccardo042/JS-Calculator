function OperatorKey({ id, operator, onPress }) {
     
    return (
      <div 
      id={id} 
      className="operatorkey"
      role="button"
      onClick={() => onPress(operator)}
      >
      {operator}
      </div>
    );
  }
  
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

  export default OperatorKey;