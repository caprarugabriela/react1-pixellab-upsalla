// Crearea butonului AddToCart
const AddToCartButton = ({ productId }) => {
  const state = React.useState({
    added: false, // by default, indica daca produsul este in cos
    busy: false, // by default, indica daca se desfasoara o actiune (adaugare in cos)
  });
  const actualState = state[0];
  const setState = state[1];
  const { added, busy } = actualState;

  // Definim functia onClick
  const onClick = () => {
    setState({
      ...actualState,
      busy: true, // setam starea la inceputul actiunii, marcand componenta ca fiind ocupata
    });

    // Simulam o intarziere pt a crea efectul de asteptare
    setTimeout(() => {
      setState({
        ...actualState,
        added: !actualState.added, // actualizam starea pt a reflecta adaugarea/eliminarea din cos
      });
    }, Math.floor(Math.random() * 3000));
  };

  return (
    <button
      className={`product-a2c ${added ? 'active' : ''}`}
      type="button"
      title={added === true ? 'Remove from Cart' : 'Add to Cart'}
      onClick={onClick}
    >
      {added === true ? `PID: ${productId} in cart` : 'Add to Cart'}{' '}
      {busy === true ? <i className="fas fa-spinner"></i> : null}
      {/* aici am adaugat spinnerul daca componenta este ocupata */}
    </button>
  );
};

const ProductControls = (props) => {
  const { productId } = props;

  return <AddToCartButton productId={productId}></AddToCartButton>;
};

// old pre 18 method of render
const productTileControls = document.querySelectorAll('.product-tile-controls');
productTileControls.forEach((productTileControl, index) => {
  const root = ReactDOM.createRoot(productTileControl);

  root.render(<ProductControls productId={index}></ProductControls>);
});
