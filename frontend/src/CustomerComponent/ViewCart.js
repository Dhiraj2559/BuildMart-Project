import { useEffect, useReducer, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { faAlignCenter } from "@fortawesome/free-solid-svg-icons";

import "../style.css";
import "../Registration/shubham.css";
import OrderSuccess from "./OrderSuccess";

export default function ViewCart() {
  const [cart, setCart] = useState([{}]);
  const [user, setUser] = useState(0);
  const navigate = useNavigate();
  var total=0;

  const sum= (e)=>{
    total+=e;
  }
  const[pay,setPay]=useState(null);
  const initialState = {
    //vproducts:  cart ,
    user_id: 0,
    total_price: total,
    city: 0,
    area: 0,
    addline: "",
    initial_Payment_Amount: 0,
    initial_Payment_Mode: pay,
    initial_Payment_Transid: "",
    active_status:1
  
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "update":
        return { ...state, [action.fld]: action.value };

      case "reset":
        return initialState;
      default:
    }
  };

  const [info, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const us = (JSON.parse(localStorage.getItem("loggedUser"))).id;
    setUser(us);
    fetch("http://localhost:8080/getCart?userid=" + us)
      .then((resp) => resp.json())
      .then((data) => {
        setCart(data);
        dispatch({type:'update',fld:'user_id', value:us});

        console.log(cart);
        let tprice = 0;

        // data.forEach((element) => {
        //   if (element.vendorproduct && element.vendorproduct.price) {
        //     tprice += element.vendorproduct.price;
        //   }
        //   setTot(tprice);

        // });
        // this.state.initialState.initialPayment=100;
      });
    // alert(user);
  }, []);


  

 

  // const [addFlag, setAddFlag] = useState(false);
  // const [existadd, setExAdd] = useState([{}]);

  // const selectAdd = (e) => {
  //   if (e.target.value === "existing") {
  //     setAddFlag(false);

  //     fetch("http://localhost:8080/getAddressByUid?uid=" + info.userid)
  //       .then((resp) => resp.json())
  //       .then((data) => setExAdd(data));

  //     info.city = existadd.city.id;
  //     info.area = existadd.area.id;
  //     info.addline = existadd.addline;
  //   } else {
  //     setAddFlag(true);
  //   }
  // };

  //var tprice=0;
  //{cart.forEach(v=>tprice+=v.vendorproduct.price )}

  //dispatch({type:'update', fld:'vproducts', value:{cart}});

  const [cities, setCity] = useState([]);
  const [areas, setArea] = useState([]);

  const deleteProduct = (productId) => {
    alert(productId)
      fetch("http://localhost:8080/deleteitem?vpid=" + productId)
        .then((resp) => resp.json())
        .then((data) => {
          if (data > 0) {
            alert("Product Deleted");
             reLoadProducts();
          } else alert("Failed to Delete Product");
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    
  };
  const reLoadProducts = () => {
    const us = (JSON.parse(localStorage.getItem("loggedUser"))).id;
    setUser(us);
    fetch("http://localhost:8080/getCart?userid=" + us)
      .then((resp) => resp.json())
      .then((data) => {
        setCart(data);
        dispatch({type:'update',fld:'user_id', value:us});

        console.log(cart);
        let tprice = 0;

        // data.forEach((element) => {
        //   if (element.vendorproduct && element.vendorproduct.price) {
        //     tprice += element.vendorproduct.price;
        //   }
        //   setTot(tprice);

        // });
        // this.state.initialState.initialPayment=100;
      });
  };

  useEffect(() => {
    fetch("http://localhost:8080/getcities")
      .then((resp) => resp.json())
      .then((data) => setCity(data));
  }, []);

  const editCity = (e) => {
    dispatch({ type: "update", fld: "city", value: e.target.value });
    var cid = e.target.value;

    fetch("http://localhost:8080/getareas?cityid=" + cid)
      .then((resp) => resp.json())
      .then((data) => setArea(data));
      console.log(areas);
  };

  const handlepayChange=(event)=>{
    console.log(event.target.value);
    setPay(event.target.value);
  };
  
  const placeOrder = (e) => {

    e.preventDefault();
    info.initial_Payment_Mode=pay;
    dispatch({
      type: "update",
      fld: "total_price",
      value:total,
    });
    var reqOptions = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(info),
      
    };
  
    // alert(JSON.stringify(info));
    if(info.city!= 0 &&
      info.area!= 0 &&
      info.addline!= "" &&
      info.initial_Payment_Amount!= 0 &&
      info.initial_Payment_Mode!= "" &&
      info.initial_Payment_Transid!= ""
    )
    {
      console.log(pay);
      console.log(info.initial_Payment_Mode);
      fetch("http://localhost:8080/placeOrder", reqOptions)
      .then((resp) => {
        if (resp.ok) {
          localStorage.setItem("orderid", JSON.stringify(resp));
          navigate("/cust/myOrders");
        } else throw new Error("Server error");
      })
      .catch((error) => {
        alert("server error. Try again");
      });}
      else
      setMsg("Cannot place order... Kindly fill complete information")

  };

  const [msg,setMsg]=useState("");
  const setTrans=(e)=>{
    
       dispatch({type:'update',fld:'initial_Payment_Amount', value:(total*0.1)});
       dispatch({
        type: "update",
        fld: "initial_Payment_Transid",
        value: e.target.value,
      });
      // alert(info.initial_Payment_Amount);

  }

 
  return (
    <div className="container credit text-center mt-5 login-form-container col-9">
      <div id="prds">
        <table className="table table-hover content table-info table-striped">
          <thead className="thead-dark content ">
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Product name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((v) => {
               if (v.vendorProduct && v.vendorProduct.product) {
                console.log(v);
              return (
                <tr className="table-info">
                  <td><img src={`data:image/jpeg;base64,${v.vendorProduct.product.picture}`} width={100} height={100}/></td>
                  <td className="table-info">{v.vendorProduct.product.productName}</td>
                  <td className="table-info" onChange={sum(v.vendorProduct.price*v.quantity-(v.vendorProduct.price*v.quantity*v.vendorProduct.offerPercentage/100))} >{v.vendorProduct.price}</td>
                  <td className="table-info" >{v.quantity}</td>
                  <td className="table-info" >
                  <input className="btn btn-outline-primary"
                        type="button"
                        id={v.id}
                        value={"Delete"}
                        onClick={() => deleteProduct(v.id)}
                      ></input>
                  </td>
                </tr>
              );
            }
            else {
              return null;}
            })}
          </tbody>
        </table>
      </div>
      <form>
        <div>
          <label htmlFor="totprice">Total price</label>
          <input
            type="number"
            id="totprice"
            name="totprice"
             value={total}
            readOnly
          />
        </div>
        <p>Delivery Address</p>
           {/* <div>
      <label>
<input
    type="radio"
    name="add"
    value="existing"
    onChange={(e) => selectAdd(e)}
  />
  existing address
</label>
<label>
  <input
    type="radio"
    name="add"
    value="new"
    onChange={(e) => selectAdd(e)}
  />
  new address
</label>
  
        </div>style={{ display: addFlag ? "block" : "none" }}*/}
        <div >
          <div>
            <label htmlFor="city">Select City</label>
            <select id="city" name="city" onChange={(e) => editCity(e)} required>
              <option>Select City</option>
              {cities.map((v) => {
                return (
                  <option key={v.id} value={v.id}>
                    {v.city_name}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label htmlFor="area">Select Area</label>
            <select
              id="area"
              name="area"
              onChange={(e) => {
                dispatch({
                  type: "update",
                  fld: "area",
                  value: e.target.value,
                });
              }}
              required
            >
                  <option>Select Area</option>
              {areas.map((v) => {
                return (
                  <option key={v.id} value={v.id}>
                    {v.name
                    }
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="addline">Enter Address line</label>
            <input
              type="text"
              id="addline"
              name="addline"
              value={info.addline}
              required
              onChange={(e) => {
                dispatch({
                  type: "update",
                  fld: "addline",
                  value: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div>
          <label htmlFor="initialPayment">Enter Initial payment amount</label>
          <input
            type="number"
            id="initialPayment"
            name="initialPayment"
            value={total*0.1}
           // onChange={(e)=>{dispatch({type:'update', fld:'initial_Payment_Amount', value:e.target.value})}}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="pay">Enter Payment mode</label>
          <select id="pay"
            name="pay" value={pay} onChange={handlepayChange}>
              <option disabled selected>Select One</option>
              <option  value="G-Pay">Google Pay</option>
              <option value="Phone-Pay">Phone Pay</option>
              <option value="PayYm">PayTm</option>

            </select>
{/*          
          <input
            type="text"
            id="ipmode"
            name="ipmode"
            value={info.ipmode}
            required
            onChange={(e) => {
              dispatch({
                type: "update",
                fld: "initial_Payment_Mode",
                value: e.target.value,
              });
            }}
          /> */}

          
        </div>
        <div>
          <label htmlFor="iptransid">Enter Transaction id</label>
          <input
            type="text"
            id="iptransid"
            name="iptransid"
            value={info.initial_Payment_Transid}
            required
            onChange={(e) => {
              setTrans(e)
            }}
          />
        </div>
        </form>
        <button
          type="button"
          className="btn btn-outline-primary"
          
          onClick={(e) => placeOrder(e)}
        >Place Order</button>
        <button style={{position:faAlignCenter}} type="button" className="btn btn-outline-primary" onClick={()=>{navigate("/cust")}}>Back to home</button>
      
      {/* <Routes>
        <Route path="ordersuccess" element={<OrderSuccess />} />
      </Routes> */}
      <div className="text-danger">{msg}</div>
    </div>
  );
}
