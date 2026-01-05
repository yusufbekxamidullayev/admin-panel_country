import React, { useEffect, useState } from 'react';
import { Button, Flex, Space, Table, Tag } from 'antd';
import axios from 'axios';


const DestinationsPage = () => { 
  const [prods , setProds] = useState([]);
  const [loading , setLoading] = useState(true)

  async function getProds(){
    try{
      let res = await axios.get(`https://v1.turbotravel.uz/api/prods`)
      setProds(res.data.data)
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getProds()
  } , [])

  const columns = [
    {
      title: 'Name (UZ)',
      dataIndex: 'title_uz',
      key: 'title_en',
    },
    {
      title: 'Name (EN)',
      dataIndex: 'title_en',
      key: 'title_uz',
    },
    {
      title: 'Name (RU)',
      dataIndex: 'title_ru',
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
  return <Table style={{ overflowY: "scroll", height: "100%" }} columns={columns} loading={loading} dataSource={prods} /> 
}
export default DestinationsPage;