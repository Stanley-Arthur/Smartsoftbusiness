import React,{useState} from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from "react";
import {PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import dynamic from 'next/dynamic'
import axios from 'axios';
import { useRouter } from 'next/router';
import { reset } from '@/redux/cartSlice';
import OrderDetails from '@/components/orderDetails';


const  Cart=()=> {
    const cart = useSelector((state) => state.cart);
    const [open, setOpen] = useState(false);
    const [cash, setCash] = useState(false);
    // This values are the props in the UI
    const amount = cart.total;
    const currency = "USD";
    const style = { layout: "vertical" };
    const dispatch = useDispatch();
    const router = useRouter();

    const createOrder = async (data) => {
        fetch("https://deployed-project.vercel.app/api/orders", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(response => {
              if (response.status === 201) {
                response.json().then(data => {
                  router.push("/orders/" + data._id);
                  dispatch(reset());
                });
              } else {
                throw new Error("Failed to create order");
              }
            })
            .catch(error => { 
              console.log(error);
            });
    };
   


    // Custom component to wrap the PayPalButtons and handle currency changes
    const ButtonWrapper = ({ currency, showSpinner }) => {
        // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
        // This is the main reason to wrap the PayPalButtons in a new component
        const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

        useEffect(() => {
            dispatch({
                type: "resetOptions",
                value: {
                    ...options,
                    currency: currency
                }
            });
        }, [currency, showSpinner]);


        return (<>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[amount, currency, style]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: currency,
                                        value: amount
                                    }
                                },
                            ]
                        })
                        .then((orderId) => {
                            // Your code here after create the order
                            return orderId;
                        });
                } }
                onApprove={function (data, actions) {
                    return actions.order.capture().then(function (details) {
                        // Your code here after capture the order
                        const shipping = details.purchase_units[0].shipping;
                        createOrder({
                            customer: shipping.name.full_name,
                            address: shipping.address.address_line_1,
                            total: cart.total ,
                            method: 1
                        });
                    });
                } } />
        </>
        );
    };
    return (
        <div className='h-screen flex items-center relative flex-col md:flex-row justify-center '>
            <div className='w-full '>
                <table className='border-spacing-5 w-full '>
                    <tbody>
                        <tr>
                            <th>Product</th>
                            <th> Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </tbody>
                    <tbody>

                        {cart.products.map((product) => (

                            <tr key={product._id}>
                                <td>
                                    <div className=''>
                                        <Image width={100} height={100} src={product.img} alt=""></Image>
                                    </div>
                                </td>
                                <td className=' font-semibold text-lg text-gray-900'>
                                    {product.title}
                                </td>
                                <td>
                                    <span className='text-md '>${product.price}</span>
                                </td>
                                <td>
                                    <span className='text-md '>{product.quantity}</span>
                                </td>
                                <td>
                                    <span className='  text-md font-bold'>${product.price * product.quantity}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='mt-5'>
                <div className='w-[90%] max-h-[300px] bg-[#333] p-[50px]  flex flex-col justify-between text-white'>
                    <h1 className='text-xl font-bold '>TORTAL ORDER</h1>
                    <div className='flex'>
                        <p className='mr-2'>Subtotal:</p>${cart.total}
                    </div>
                    <div className='flex'>
                        <p className='mr-2'>Discount:</p>$0.00
                    </div>
                    <div className='flex'>
                        <p className='mr-10'>Total:</p>${cart.total}
                    </div>
                    <div>
                        {open ? (
                            <div className='mt-[10px] flex flex-col'>
                                <button onClick={()=>setCash(true)} className='p-[5px] cursor-pointer mb-[5px] w-[200px] bg-white text-teal-900 uppercase font-sans font-bold '> pay cash</button>
                                <PayPalScriptProvider
                                    options={{
                                        "client-id": "ATbeYLRmyhDyihKvDTExPcHsZCYeJsq1Nms9H1L6LR-pqJlLHAg06uSSOblaa2BjTWLHGYOLVSbs8sVI",
                                        components: "buttons",
                                        currency: "USD",
                                        'disable-funding': 'venmo '
                                    }}
                                >
                                    <ButtonWrapper
                                        currency={currency}
                                        showSpinner={false} />
                                </PayPalScriptProvider>
                            </div>

                        ) : (
                            <button onClick={() => setOpen(true)} className='h-10 w-[200px]  border bg-green-400  rounded mt-4  text-sm text-white'>CHECKOUT NOW!</button>
                        )}
                    </div>
                </div>
            </div >
            <div className=' z-50'>
            { cash && <OrderDetails total={cart.total} createOrder={createOrder}/> }

            </div>
        </div>
    );
}

export default dynamic (()=> Promise.resolve(Cart),{ssr:false})
