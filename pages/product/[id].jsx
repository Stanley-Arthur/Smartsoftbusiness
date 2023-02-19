import React,{useState} from 'react'
import Image from 'next/legacy/image'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addProduct } from '@/redux/cartSlice'
import dynamic from 'next/dynamic'

const Product = ({item}) => {
  const [price, setPrice] =useState(item.price)
  const [quantity,setQunatity]=useState(1) 
  const dispatch = useDispatch()

  const changePrice =(number) => setPrice(price + number)
  const handleClick=()=>{ 
    dispatch(addProduct({...item,quantity,price}))
  }
   
  return (
    <div className='flex justify-center items-center'>
        <div className='max- h-screen md:h-[calc(100vh-100px)] cursor-pointer flex-col w-[50%]  md:flex-row justify-center item-center flex md:pt-0'>
        <div className='flex-1 h-[100%] flex items-center justify-center'>
            <div className='w-56 h-50 md:w-96 md:h-80'>
                <Image alt='' src={item.img} width={300} height={300} priority />
            </div>
            
        </div>
        <div className='flex-1  text-black flex flex-col justify-center items-center'>
            <div>
            <h1 className='uppercase font-bold text-2xl'>{item.title}</h1>
            <span className='text-green-400 border-b border-b-green-400 text-[24px] font-semibold'>${item.price}</span>
            <p>{item.desc}</p>
            </div> 

            <div className='text-black flex items-center justify-start h-44 w-56'>
             <input onChange={(e)=>setQunatity(e.target.value)} type="number" defaultValue={1}  className="w-[50px] border h-[30px]"/>
             <button onClick={handleClick}  className='h-8 w-20 ml-3 bg-gray-900 rounded text-white'> Buy</button>
            </div>
        </div>   
     
        </div>
    </div>  
  )
}

export const getServerSideProps = async ({params})=>{
    const res = await axios.get(`https://deployed-project.vercel.app/api/products/${params.id}`);
    return{
      props:{
        item : res.data
  
      }
    }
  }

  export default dynamic (()=> Promise.resolve(Product),{ssr:false})


