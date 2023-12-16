// old school redux
// nu se mai foloseste aceasta notatie
const ADD_TO_CART_EVENT = 'cart/productAdded';
const REMOVE_FROM_CART_EVENT = 'cart/productRemoved';
const ADD_TO_WISHLIST_EVENT = 'wl/productAdded';
const REMOVE_FROM_WISHLIST_EVENT = 'wl/productRemoved';

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
      // const eventName = added === true ? 'removeFromCart' : 'addToCart';
      const eventName =
        added === true ? REMOVE_FROM_CART_EVENT : ADD_TO_CART_EVENT;
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
  // nested destructure
  const [{ added, busy }, setState] = React.useState({
    added: false,
    busy: false,
  });
  const onClick = () => {
    setState({
      busy: true,
    });

    setTimeout(() => {
      const eventName =
        added === true ? REMOVE_FROM_WISHLIST_EVENT : ADD_TO_WISHLIST_EVENT;

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
    <AddToCartButton productId={productId} key={0}></AddToCartButton>,
    <AddToWishlistButton productId={productId} key={1}></AddToWishlistButton>,
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
    const handler = ({ detail }) => {
      const { productId } = detail;

      setState((previousState) => {
        return {
          productIds: [...previousState.productIds, productId],
          qty: previousState.qty + 1,
        };
      });
    };

    addEventListener(ADD_TO_CART_EVENT, handler);

    // clean-up function
    // o functie care se cheama doar atunci cand pleaca componenta de DOM
    return () => {
      removeEventListener(ADD_TO_CART_EVENT, handler);
    };
  }, []);

  React.useEffect(() => {
    const handler = ({ detail }) => {
      setState((previousState) => {
        return {
          productIds: previousState.productIds.filter((productId) => {
            return productId !== detail.productId;
          }),
          qty: previousState.qty - 1,
        };
      });
    };

    addEventListener(REMOVE_FROM_CART_EVENT, handler);

    // clean-up function
    return () => {
      removeEventListener(REMOVE_FROM_CART_EVENT, handler);
    };
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
    <div className="header-counter" onClick={showProducts}>
      <span className="cart-qty">{actualState.qty}</span>
      <i className="fas fa-shopping-cart icon"></i>
    </div>
  );
};

// definim functia de wishlist
const HeaderWlCounter = () => {
  // nested destructure
  const [{ productIds, qty }, setState] = React.useState({
    productIds: [],
    qty: 0,
  });

  React.useEffect(() => {
    const handler = ({ detail }) => {
      const { productId } = detail;

      setState(({ productIds, qty }) => {
        return {
          productIds: [...productIds, productId],
          qty: ++qty,
        };
      });
    };
    addEventListener(ADD_TO_WISHLIST_EVENT, handler);

    // clean-up function
    return () => {
      removeEventListener(ADD_TO_WISHLIST_EVENT, handler);
    };
  }, []);

  React.useEffect(() => {
    const handler = ({ detail }) => {
      setState(({ productIds, qty }) => {
        return {
          // filter - array nou cu toate indexurile la care am raspuns true la functie
          // filtram dupa urmatorul predicat - productId
          productIds: productIds.filter((productId) => {
            // returneaza toate id-urile de produse daca nu sunt efectiv detail.productId
            return productId !== detail.productId;
          }),
          qty: --qty,
        };
      });
    };
    addEventListener(REMOVE_FROM_WISHLIST_EVENT, handler);

    // clean-up function
    return () => {
      removeEventListener(REMOVE_FROM_WISHLIST_EVENT, handler);
    };
  }, []);

  const showProducts = () => {
    const message =
      qty <= 0
        ? 'There are no product in your wishlist.'
        : `There are the pids in your wishlist: ${productIds}`;

    alert(message);
  };

  return (
    <div className="header-counter" onClick={showProducts}>
      <span className="cart-qty">{qty}</span>
      <i className="fas fa-heart icon"></i>
    </div>
  );
};

const HeaderCounters = () => {
  const [showButtons, setsShowButtons] = React.useState(true);
  const toggleCounters = () => {
    setsShowButtons(!showButtons);
  };

  // adaugam butonul de toggle
  return (
    <>
      <button title="Toggle" type="button" onClick={toggleCounters}>
        Toggle
      </button>

      {showButtons ? (
        <>
          <HeaderCartCounter></HeaderCartCounter>
          <HeaderWlCounter></HeaderWlCounter>
        </>
      ) : null}
    </>
  );
};

const headerCounters = document.querySelector('.header-counters');
ReactDOM.createRoot(headerCounters).render(<HeaderCounters></HeaderCounters>); //one liner, nu-i chiar recomandat

// validare email
const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
};

// newsletter form
// am luat codul din index.html si l-am adaugat in React
// modif facute codului de html ->atrib html nu sunt citite corect de babel
// evitarea erorilor de transpilare
// componentele in REact sunt doar functii
const NewsletterForm = () => {
  const [state, setState] = React.useState({
    email: '',
    formMessage: '',
    busy: false,
    successMessage: '',
  });
  const { email, formMessage, busy, successMessage } = state;

  // controlled input
  const onChange = (event) => {
    // just target recommended in React
    setState({
      ...state,
      email: event.target.value,
      formMessage: '',
    });
  };

  const send = (event) => {
    event.preventDefault();
    // event.target['field-newsletter'].value

    if (busy) {
      return;
    }

    if (!validateEmail(email)) {
      setState({
        ...state,
        formMessage: 'Please use a valid email',
      });

      return;
    }

    setState({
      ...state,
      busy: true,
      formMessage: '',
    });

    // simulate ajax
    setTimeout(() => {
      setState({
        ...state,
        busy: false,
        email: '',
        successMessage: `Emailul ${email} a fost inscris.`,
      });

      //callback hell
      setTimeout(() => {
        setState({
          ...state,
          email: '',
          successMessage: '',
        });
      }, 1200);
    }, 1200);
  };

  if (successMessage.length > 0) {
    return <div className="container">{successMessage}</div>;
  }

  return (
    <form className="form-newsletter container" onSubmit={send}>
      {/* nu se foloseste class pt ca in JS class e un reserved keyword pt crearea claselor */}
      <label htmlFor="field-newsletter">
        Subscribe to our <span>newsletter</span>
      </label>

      <input
        type="text"
        name="field-newsletter"
        id="field-newsletter"
        placeholder="enter your email address to receive the latest news!"
        value={email}
        onChange={onChange}
      ></input>

      <button title="Subscribe" type="submit" disabled={busy}>
        {busy ? '...loading' : 'Subscribe'}
      </button>

      <div className="form-message">{formMessage}</div>
    </form>
  );
};

ReactDOM.createRoot(document.querySelector('section.home-newsletter')).render(
  <NewsletterForm></NewsletterForm>,
);
