import React, { useEffect, useState } from 'react';
import { Button, Flex, Space, Table, Tag } from 'antd';
import axios from 'axios';


const HotelsPage = () => { 
  const [hotels , setHotels] = useState([]);
  const [loading , setLoading] = useState(true)

  async function getHotels(){
    try{
      let res = await axios.get(`https://v1.turbotravel.uz/api/hotels`)
      setHotels(res.data.data)
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getHotels()
  } , [])

  const columns = [
    {
      title: 'Name (UZ)',
      dataIndex: 'name_uz',
      key: 'title_en',
    },
    {
      title: 'Name (EN)',
      dataIndex: 'name_en',
      key: 'title_uz',
    },
    {
      title: 'Name (RU)',
      dataIndex: 'name_ru',
      key: 'title_ru',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary'>Edit</Button>
          <Button danger>Delete</Button>
        </Space>
      ),
    },
  ];
  return <Table style={{ overflowY: "scroll", height: "100%" }} columns={columns} loading={loading} dataSource={hotels} /> 
}
export default HotelsPage;