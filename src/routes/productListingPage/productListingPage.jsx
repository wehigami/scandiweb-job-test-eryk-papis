import React from "react";
import Product from "./product";
import style from "./products.module.scss";
import CartAdd from "./cartadd";
import Layout from "../../components/layout";
import { getQuery } from "../../lib/queries";
import { Query } from "@apollo/client/react/components";
import { connect } from "react-redux";
import { setActiveCategoryName } from "../../redux/categorySlice";
import { setProductHover } from "../../redux/productHoverSlice";
import { Link } from "react-router-dom";
import { location } from '../../lib/location'


class Products extends React.Component {
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
    const mainDivStyle = {
      display: "flex",
      flexDirection: "column",
      background: "#fff",
      height: "500px",
      margin: 40,
      padding: 15,
      zIndex: 1,
    };

    let opacityDivStyle = {
      ...mainDivStyle,
      opacity: 0.5,
    };

    return (
      <Layout>
        <div style={{ padding: "20px 100px 20px 100px" }}>
          {this.props.cartMessage.length > 0 ? (
            <p>{this.props.cartMessage}</p>
          ) : null}
          <Query query={getQuery(1)}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;
              return (
                <>
                  {data.categories.map((category) =>
                    location() === category.name ? (
                      <div key={category.name}>
                        <h2
                          style={{
                            textTransform: "capitalize",
                            fontWeight: 300,
                            fontSize: "32px",
                          }}
                        >
                          {category.name}
                        </h2>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                          }}
                        >
                          {category.products.map((product) =>
                            product.inStock ? (
                              <div
                                key={product.id}
                                style={mainDivStyle}
                                className={style.productHighlight}
                                onMouseEnter={() =>
                                  //responsible for showing the add to cart button on hover
                                  this.props.setProductHover([true, product.id])
                                }
                                onMouseLeave={() =>
                                  this.props.setProductHover([false, null])
                                }
                              >
                                {this.props.hover &&
                                this.props.productsId === product.id ? (
                                  <div
                                    className="cart"
                                    style={{
                                      margin: "370px 0 0 390px",
                                      position: "absolute",
                                    }}
                                  >
                                    <CartAdd
                                      productId={product.id}
                                      productPrices={product.prices.map(
                                        (price) => {
                                          return {
                                            label: price.currency.label,
                                            amount: price.amount,
                                          };
                                        }
                                      )}
                                      productAttributes={product.attributes.map(
                                        (attribute) => attribute.id
                                      )}
                                    />
                                  </div>
                                ) : null}
                                <Link
                                  to={`/product/${product.id}`}
                                  style={{
                                    color: "#1D1F22",
                                    display: "contents",
                                  }}
                                  key={product.id}
                                >
                                  <Product
                                    productId={product.id}
                                    productImg={product.gallery[0]}
                                    productName={product.name}
                                    productPrices={product.prices}
                                    highlightStyle={style.productHighlight}
                                    productBrand={product.brand}
                                  />
                                </Link>
                              </div>
                            ) : (
                              <div key={product.id} style={opacityDivStyle}>
                                <Product
                                  productId={product.id}
                                  productImg={product.gallery[0]}
                                  productName={product.name}
                                  productPrices={product.prices}
                                  productBrand={product.brand}
                                  notInStock
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ) : null
                  )}
                </>
              );
            }}
          </Query>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  categoryName: state.activeCategory.categoryName,
  hover: state.productHover.hover,
  productsId: state.productHover.productId,
  label: state.activeCurrency.label,
  cartMessage: state.cartClick.cartMessage,
  currentLink: state.currentLink.currentLink,
});

const mapDispatchToProps = { setActiveCategoryName, setProductHover, };

export default connect(mapStateToProps, mapDispatchToProps)(Products);