import React from 'react'
import Image from 'next/legacy/image'
import dynamic from 'next/dynamic';
import axios from 'axios';

const Orders = ({ order }) => {
    const status = order.status;
    const statusClass=(index)=>{
        if (index -status <1) return "flex flex-col item-center";
        if (index -status === 1) return  "flex flex-col item-center animate-pulse";
        if (index -status > 1) return  "flex flex-col item-center opacity-30";
    }
  return (
    <div className='flex pt-20 md:p-12 flex-col  md:flex-row items-center md:w-[100%] justify-center h-screen'>
        <div className='flex-[2]'>
            <div className='w-[100%]'>
            <table className='border-spacing-5  md:w-full '>
                <tr className=''> 
                    <td><th>Order ID</th></td>
                    <td><th> Customer</th></td>
                    <td><th>Address</th></td>
                    <td><th>Total</th></td>
                </tr>
                <tr>
                    <td className=' font-semibold animate  text-lg text-gray-900'>
                        {order._id}
                    </td>
                    <td className='pl-2'>
                    <span className='text-md '>{order.customer}</span>  
                    </td>
                    <td className='pl-2'>
                    <span className='text-md '>{order.address}</span>  
                    </td>
                    <td className='pl-2'>
                    <span className='  text-md font-bold'>${order.total}</span>  
                    </td>
                </tr>

            </table>
            </div>
            <div className='mt-10 flex flex-row justify-between w-[80%]'> 
                <div className={statusClass(0)}>
                    <Image src="/img/paid.png" width={30} height={30}/>
                    <span>Payment</ span>
                    <div >
                        <Image src="/img/checked.png"   width={20} height={20}/>
                    </div>
                </div>
                <div className={statusClass(1)}>
                    <Image src="/img/bike.png"  width={30} height={30}/>
                    <span>Delivery</span> 
                    <div >
                        <Image src="/img/checked.png" className={`checkedIcon ${statusClass(1)}`}  width={20} height={20}/>
                    </div>  
                </div>
                <div className={statusClass(2)}>
                    <Image src="/img/delivered.png" width={30} height={30}/>
                    <span>Delivered</span>
                    <div > 
                        <Image src="/img/checked.png" className={`checkedIcon ${statusClass(2)}`}  width={20} height={20}/>
                    </div>
                </div>
            </div>
          
        </div>

        <div className='flex-1'>
           <div className='w-[90%] max-h-[300px] bg-[#333] p-[50px]  flex flex-col justify-between text-white'>
                <h1 className='text-xl font-bold '>TORTAL ORDER</h1>
                <div>
                    <b className='mr-2'>Subtotal:</b>${order.total}
                </div>
                <div>
                    <b className='mr-2'>Discount:</b>$0.00
                </div>
                <div>
                    <b className='mr-10'>Total:</b>${order.total}
                </div>
                <button className='h-12 w-56 ml-3 border text-teal-700 bg-white font-bold cursor-not-allowed  rounded mt-4  text-sm' disabled>PAID</button>
            </div> 
        </div>
    </div>
  )
}

export const getServerSideProps= async ({params})=>{
    try {
        const res = await axios.get(`https://deployed-project.vercel.app/api/orders/${params.id}`);
        return {
            props: {order: res.data}
        };
    } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        return {
            props: {error: error.message}
        }
    }
    
}

export default dynamic (()=> Promise.resolve(Orders),{ssr:false})



{/* <div className={`done ${statusClass(0)}`}>
<Image src="/img/paid.png" width={30} height={30}/>
<span>Payment</ span>
<div >
    <Image src="/img/checked.png"  width={20} height={20}/>
</div>
</div>
<div className={`inProgress ${statusClass(1)}`}>
<Image src="/img/bike.png"  width={30} height={30}/>
<span>Delivery</span> 
<div className='checkedIcon'>
    <Image src="/img/checked.png"  width={20} height={20}/>
</div>  
</div>
<div className={`undone ${statusClass(2)}`}>
<Image src="/img/delivered.png" width={30} height={30}/>
<span>Delivered</span>
<div className='checkedIcon'> 
    <Image src="/img/checked.png"  width={20} height={20}/>
</div>
</div> */}
