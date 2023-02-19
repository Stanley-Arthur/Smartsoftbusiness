import React,{useState} from 'react'
import Equipments from '@/components/equipments'
import axios from 'axios'
import Add from '@/components/Add'
import AddButton from '@/components/AddButton'


export default function  products  ({equipment, admin})  {
  const [close , setClose]=useState(true)
  return (
    <div>
      <div className='relative'>
       {admin && <span className=' absolute top-[15%] '><AddButton setClose={setClose}/></span>}
       <Equipments  equipment={equipment}  />
       {!close && <span><Add setClose={setClose} /></span> }
      </div>
    </div>
    
  )
}

export const getServerSideProps = async (ctx)=>{
  const myCookie = ctx.req?.cookies || "";
  let admin = false;

  if (myCookie.token === process.env.TOKEN_KEY) {
    admin = true;
  }

  const res = await axios.get('https://deployed-project.vercel.app/api/products');
  return{
    props:{
      equipment:res.data,
      admin
      

    }
    
  }
}
