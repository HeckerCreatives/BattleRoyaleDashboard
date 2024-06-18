"use client"
import React, { useEffect, useState } from 'react'
import Signin from "./auth/Signin";
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';


export default function Home() {
  const auth = Cookies.get('sessionToken')
  const router = useRouter()

  //   useEffect(() => {
  //    if (auth === undefined){
  //      router.push('/')
  //    }
  //    if(auth !== undefined)
  //      router.push('/dashboard')
  //  })

  return (
    <>
     <Signin/>
    </>
  );
}
