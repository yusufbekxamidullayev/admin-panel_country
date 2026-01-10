import axios from 'axios'
import React, { useEffect, useState } from 'react'

const useGet = ({url}) => {
    const [data , setData] = useState([])
    const [loading , setLoading] = useState(true)
    async function getData() {
        try {
            let res = await axios.get(`https://v1.turbotravel.uz/api/${url}`)
            setData(res.data.data)
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

  return {data , loading , getData , setLoading}
}

export default useGet