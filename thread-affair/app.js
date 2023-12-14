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
    // set state as busy before request
    setState({
      ...actualState,
      busy: true, // setam starea la inceputul actiunii, marcand componenta ca fiind ocupata
    });

    // Simulam o intarziere pt a crea efectul de asteptare
    setTimeout(() => {
      // evaluam daca avem ceva in cos => removeFromCart
      // daca nu avem in cos => vom avea ev de addToCart
      const eventName = added === true ? 'removeFromCart' : 'addToCart';
      // custom event -> emitem un eveniment custom
      dispatchEvent(
        new CustomEvent(eventName, {
          detail: {
            // mandatory to be used
            productId,
          },
        }),
      );

      // mark state as done
      setState({
        ...actualState,
        added: !actualState.added, // actualizam starea pt a reflecta adaugarea/eliminarea din cos
      });
    }, Math.floor(Math.random() * 3000));
  };

  return (
    <button
      className={`product-control ${added ? 'active' : ''}`}
      type="button"
      title={added === true ? 'Remove from Cart' : 'Add to Cart'}
      onClick={onClick}
      // atat cat timp se invarte spinnerul -> sa nu mai dai click a doua oara
      // daca e busy: true si disabled:true pana se termina requestul
      disabled={busy}
    >
      {added === true ? `PID: ${productId} in cart` : 'Add to Cart'}
      {/* daca produsul este in cos, afisam PID-ul, altfel afisam Add to Cart */}

      {busy === true ? <i className="fas fa-spinner"></i> : null}
      {/* aici am adaugat spinnerul daca componenta este ocupata */}
    </button>
  );
};

// cream butonul de add to wishlist
const AddToWishlistButton = ({ productId }) => {
  // nested destructure - not super recommended
  const [{ added, busy }, setState] = React.useState({
    added: false,
    busy: false,
  });
  const onClick = () => {
    setState({
      busy: true,
    });

    setTimeout(() => {
      const eventName = added === true ? 'removeFromWl' : 'addToWl';

      dispatchEvent(
        new CustomEvent(eventName, {
          detail: {
            productId,
          },
        }),
      );

      setState({
        added: !added,
        busy: false,
      });
    }, Math.floor(Math.random() * (1000 * 3)));
  };

  return (
    <button
      className={`product-control ${added ? 'active' : ''}`}
      type="button"
      title={added === true ? 'Remove from Wishlist' : 'Add to Wishlist'}
      onClick={onClick}
      disabled={busy}
    >
      {added === true ? `PID: ${productId} in wl` : 'Add to Wishlist'}
      {busy === true ? <i className="fas fa-spinner"></i> : null}
    </button>
  );
};

const ProductControls = (props) => {
  const { productId } = props;

  return [
    <AddToCartButton productId={productId}></AddToCartButton>,
    <AddToWishlistButton productId={productId}></AddToWishlistButton>,
  ];
};

// old pre 18 method of render
const productTileControls = document.querySelectorAll('.product-tile-controls');
productTileControls.forEach((productTileControl, index) => {
  const root = ReactDOM.createRoot(productTileControl);

  root.render(<ProductControls productId={index}></ProductControls>);
});

const HeaderCartCounter = () => {
  // state este array-ul cu 2 pozitii
  // prima pozitie va fi egala cu ce avem intre parantezele rotunde: 0
  // a doua pozitie va fi egala cu functia setState
  // const state = React.useState(0);
  // const qty = state[0];
  const state = React.useState({
    productIds: [],
    qty: 0,
  });
  const actualState = state[0];
  const setState = state[1];

  React.useEffect(() => {
    addEventListener('addToCart', ({ detail }) => {
      // actualizam cantitatea (din parametru -> in state)
      const { productId } = detail;

      setState((previousState) => {
        return {
          productIds: [...previousState.productIds, productId],
          qty: previousState.qty + 1,
        };
      });
    });
  }, []);

  React.useEffect(() => {
    addEventListener('removeFromCart', ({ detail }) => {
      setState((previousState) => {
        return {
          productIds: previousState.productIds.filter((productId) => {
            return productId !== detail.productId;
          }),
          qty: previousState.qty - 1,
        };
      });
    });
  }, []);

  const showProducts = () => {
    let message = '';
    if (actualState.qty <= 0) {
      message = 'There are no products in your cart.';
    } else {
      message = `These are the pids in your cart: ${actualState.productIds}`;
    }

    alert(message);
  };

  return (
    <div className="header-cart" onClick={showProducts}>
      {/* restructurare la nivel de functie */}
      <span className="cart-qty">{actualState.qty}</span>

      <i className="fas fa-shopping-cart icon"></i>
    </div>
  );
};

const HeaderWlCounter = () => {
  React.useEffect(() => {
    addEventListener('addToWl', ({ detail }) => {
      alert(detail.productId);
    });
  }, []);

  React.useEffect(() => {
    addEventListener('removeFromWl', ({ detail }) => {});
  }, []);

  return (
    <div className="header-cart">
      <span className="cart-qty">ceva</span>
      <i className="fas fa-heart icon"></i>
    </div>
  );
};

const HeaderCounters = () => {
  return (
    <>
      <HeaderCartCounter></HeaderCartCounter>
      {/* to add headerwishlistcounter */}
      <HeaderWlCounter></HeaderWlCounter>
    </>
  );
};

const headerCounters = document.querySelector('.header-counters');
ReactDOM.createRoot(headerCounters).render(<HeaderCounters></HeaderCounters>); //one liner, nu-i chiar recomandat
