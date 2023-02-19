import React,{useState} from 'react'
import Image from 'next/image'
import axios from 'axios'


const Index = ({orders,products}) => {
  const [itemList, setItemList] = useState(products);
  const [orderList, setOrderList] = useState(orders);
  const status=['preparing', 'on the way','delivered']

    const handleDelete= async (id)=>{
        try{
            const res =await axios.delete("https://deployed-project.vercel.app/api/products/"+id)
            setItemList(itemList.filter((item)=> item._id !==id))

        }catch(error){
            console.log(error)
        }
    }
    const handleStatus= async (id)=>{
        const orderItem =orderList.filter(order=>order._id ===id)[0]
        const currentStatus =orderItem.status
        try{
            const res =await axios.put("https://deployed-project.vercel.app/api/orders/"+id,{status:currentStatus + 1})
            setOrderList([
                res.data,
                ...orderList.filter((order)=>order._id !== id)
            ])
            

        }catch(error){
            console.log(error)
        }
    }
  return (
    <div className="pt-20 p-14 flex flex-col md:flex-row">
      <div className=' flex  flex-col flex-1'>
        <h1 className=''>Products</h1>
        <table className='w-full border-spacing-5 text-left'>
          <tbody>
            <tr className=''>
              <th>Image</th>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </tbody>
                {itemList.map(product =>(
            <tbody key={product._id}>

              <tr className=''>
                <td>
                  <Image
                    src={product.img}
                    width={50}
                    height={50}
                    className="object-cover"
                    alt=""
                  />
                </td>
                <td>{product._id.slice(0,5)}...</td>
                <td>{product.title}</td>
                <td>${product.price}</td>
                <td>
                  <button className='text-white p-1 cursor-pointer mr-3 bg-teal-500'>Edit</button>
                  <button className='text-white p-1 cursor-pointer mr-3 bg-red-500' onClick={()=>handleDelete(product._id)}>Delete</button>
                </td>
              </tr>
            </tbody>
                    ))}
        </table>
      </div>
      <div className='flex flex-col flex-1'>
            <h1 className=''>Orders</h1>
            <table className='w-full border-spacing-5 text-left'>
             <tbody>
                <tr className=''>
                <th>Id</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
                </tr>
              </tbody>
              {orderList.map(order=>(
                <tbody key={order._id}>
                 <tr className=''>
                    <td>{order._id.slice(0,5)}...</td>
                    <td>{order.customer}</td>
                    <td>${order.total}</td>
                    <td>
                        {order.method === 0 ? <span>cash</span> : <span>paid</span>}
                    </td>
                    <td>{status[order.status]}</td>
                    <td><button className='text-white p-1 cursor-pointer mr-3 bg-red-500' onClick={()=>handleStatus(order._id)}>Next Stage</button></td>
                 </tr>
                </tbody>
              ))}
            </table>
      </div>
    </div>
  ) 
}

export const getServerSideProps =async (ctx)=>{
    const myCookie = ctx.req?.cookies || " ";
    if (myCookie.token !== process.env.TOKEN_KEY){
      return{
        redirect:{
          destination:"/admin/login",
          permanent: false,
        }
      }
    }
    const productRes = await axios.get("https://deployed-project.vercel.app/api/products")
    const orderRes = await axios.get("https://deployed-project.vercel.app/api/orders")
    return{
        props:{
            orders: orderRes.data,
            products: productRes.data
        }
    }
}

export default Index
