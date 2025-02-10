function NumKey({ num, onPress }) {
    return (
      <div id={num.name} className="numkey" role="button" onClick={() => onPress(num.num)}>
      {num.num}
      </div>
    );
  }

  export default NumKey;