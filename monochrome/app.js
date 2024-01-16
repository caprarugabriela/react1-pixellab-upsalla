const addToCart = 'cart/productAdded';
const removeFromCart = 'cart/productRemoved';
const addToWishlist = 'wl/productAdded';
const removeFromWishlist = 'wl/productRemoved';

// Crearea butonului AddToCart
const AddToCartButton = ({ productId }) => {
  const state = React.useState({
    added: false,
    busy: false,
  });
  const actualState = state[0];
  const setState = state[1];
  const { added, busy } = actualState;

  // Definim functia onClick
  const onClick = () => {
    setState({
      ...actualState,
      busy: true,
    });

    // Simulam o intarziere pt a crea efectul de asteptare
    setTimeout(() => {
      const eventName = added === true ? removeFromCart : addToCart;
      dispatchEvent(
        new CustomEvent(eventName, {
          detail: {
            productId,
          },
        }),
      );

      setState({
        ...actualState,
        added: !actualState.added,
      });
    }, Math.floor(Math.random() * 3000));
  };

  return (
    <button
      className={`product-control ${added ? 'active' : ''}`}
      type="button"
      title={added === true ? 'Remove from Cart' : 'Add to Cart'}
      onClick={onClick}
      disabled={busy}
    >
      {added === true ? (
        `PID: ${productId} in cart`
      ) : (
        <i className="fas fa-shopping-cart"></i>
      )}

      {busy === true ? <i className="fas fa-spinner"></i> : null}
    </button>
  );
};

// cream butonul de add to wishlist
const AddToWishlistButton = ({ productId }) => {
  const [{ added, busy }, setState] = React.useState({
    added: false,
    busy: false,
  });
  const onClick = () => {
    setState({
      busy: true,
    });

    setTimeout(() => {
      const eventName = added === true ? removeFromWishlist : addToWishlist;

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
      {added === true ? (
        `PID: ${productId} in wl`
      ) : (
        <i className="fas fa-heart"></i>
      )}
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

    addEventListener(addToCart, handler);

    // clean-up function
    return () => {
      removeEventListener(addToCart, handler);
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

    addEventListener(removeFromCart, handler);

    // clean-up function
    return () => {
      removeEventListener(removeFromCart, handler);
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
    addEventListener(addToWishlist, handler);

    // clean-up function
    return () => {
      removeEventListener(addToWishlist, handler);
    };
  }, []);

  React.useEffect(() => {
    const handler = ({ detail }) => {
      setState(({ productIds, qty }) => {
        return {
          productIds: productIds.filter((productId) => {
            return productId !== detail.productId;
          }),
          qty: --qty,
        };
      });
    };
    addEventListener(removeFromWishlist, handler);

    // clean-up function
    return () => {
      removeEventListener(removeFromWishlist, handler);
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
ReactDOM.createRoot(headerCounters).render(<HeaderCounters></HeaderCounters>);

// validare email
const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
};

// newsletter form
const NewsletterForm = () => {
  const [state, setState] = React.useState({
    email: '',
    formMessage: '',
    busy: false,
    successMessage: '',
    reEnter: false, //stare care verifica daca userul a adaugat emailuri
    subscriptions: 0, //tinem evidenta nr de subscrieri
  });
  const { email, formMessage, busy, successMessage, reEnter, subscriptions } =
    state;

  // controlled input
  const onChange = (event) => {
    setState({
      ...state,
      email: event.target.value,
      formMessage: '',
    });
  };

  const send = (event) => {
    event.preventDefault();

    if (busy || reEnter || subscriptions === 3) {
      if (subscriptions === 3) {
        setState({
          ...state,
          formMessage: 'Too many subscriptions',
        });
      }
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
      console.log('Current subscriptions:', subscriptions);
      setState({
        ...state,
        busy: false,
        email: '',
        successMessage: `Emailul ${email} a fost inscris.`,
        reEnter: true,
        subscriptions: subscriptions + 1,
      });

      //callback hell
      setTimeout(() => {
        setState({
          ...state,
          email: '',
          successMessage: '',
          reEnter: false,
        });
      }, 1500);
    }, 1200);
  };

  if (successMessage.length > 0) {
    return <div className="container">{successMessage}</div>;
  }

  return (
    <form className="form-newsletter container" onSubmit={send}>
      <label htmlFor="field-newsletter">
        Subscribe to our <span>newsletter</span>
      </label>

      <input
        type="text"
        name="field-newsletter"
        id="field-newsletter"
        placeholder="enter your email address"
        value={email}
        onChange={onChange}
      ></input>

      <button title="Subscribe" type="submit" disabled={busy}>
        {busy ? <i className="fas fa-spinner"></i> : 'Subscribe'}
      </button>

      <div className="form-message">{formMessage}</div>
    </form>
  );
};

ReactDOM.createRoot(
  document.querySelector('section.footer-sign-up-newsletter'),
).render(<NewsletterForm></NewsletterForm>);
