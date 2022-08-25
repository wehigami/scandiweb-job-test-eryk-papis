import React from "react";
import { NavLink } from "react-router-dom";
import navStyle from "./nav.module.scss";
import Logo from "../../imgs/logo.svg";
import Cart from "../../imgs/Cart.svg";
import "./nav.scss";
import { Query } from "@apollo/client/react/components";
import { connect } from "react-redux";
import { setActiveCurrency } from "../../redux/currencySlice";
import { setCartClick } from "../../redux/cartClickSlice";
import Dropdown from "../dropdown/dropdown";
import { links } from "../../index";
import { getQuery } from "../../lib/queries";

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownActive: false,
    };
  }

  handleClick = () => {
    this.setState({ dropdownActive: !this.state.dropdownActive });
  };

  render() {
    const labels = links;

    const currencyQuery = (
      <Query query={getQuery(0)}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <>
              {data.currencies.map((currency) => (
                <p
                  key={currency.symbol}
                  style={{
                    margin: 0,
                    padding: 0,
                    height: 35,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    fontWeight: 500
                  }}
                  onClick={() => {
                    this.props.setActiveCurrency([
                      currency.symbol,
                      currency.label,
                    ]);

                    this.handleClick();
                  }}
                >
                  {currency.symbol}
                  {currency.label}
                </p>
              ))}
            </>
          );
        }}
      </Query>
    );

    return (
      <nav
        style={{
          padding: "20px 100px 20px 100px",
          display: "grid",
          gridTemplateColumns: "33% 33% 33%",
          backgroundColor: "#fff",
          position: "relative",
          zIndex: "3",
        }}
      >
        <div
          className="labels"
          style={{
            display: "flex",
            justifySelf: "start",
            alignSelf: "center",
          }}
        >
          {labels.map((label) => {
            return (
              <div
                style={{ textTransform: "uppercase", marginRight: "20px" }}
                key={label.name}
              >
                <NavLink
                  to={label.href}
                  className={({ isActive }) =>
                    isActive ? navStyle.active : navStyle.label
                  }
                >
                  <span>{label.name}</span>
                </NavLink>
              </div>
            );
          })}
        </div>

        <div
          className="logo"
          style={{
            textAlign: "center",
            justifySelf: "center",
            alignSelf: "center",
          }}
        >
          <NavLink to="/">
            <img src={Logo} alt="logo" height={41} />
          </NavLink>
        </div>

        <div
          className="actions"
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {/*dropdown goes here*/}
          <Dropdown text={this.props.symbol} query={currencyQuery} nav />

          <img
            src={Cart}
            alt="cart"
            width={20}
            style={{ marginLeft: "20px", cursor: "pointer" }}
            onClick={() => this.props.setCartClick()}
          />
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  label: state.activeCurrency.label,
  symbol: state.activeCurrency.symbol,
});

const mapDispatchToProps = { setActiveCurrency, setCartClick };
export default connect(mapStateToProps, mapDispatchToProps)(Nav);
