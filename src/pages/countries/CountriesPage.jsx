import React, { useEffect, useState } from 'react';
import { Button, Flex, Space, Table, Tag } from 'antd';
import axios from 'axios';


const CountriesPage = () => { 
  const [countries , setCountries] = useState([]);
  const [loading , setLoading] = useState(true)

  async function getCountries(){
    try{
      let res = await axios.get(`https://v1.turbotravel.uz/api/countries`)
      setCountries(res.data.data)
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getCountries()
  } , [])

  const columns = [
    {
      title: 'Name (EN)',
      dataIndex: 'title_en',
      key: 'title_en',
    },
    {
      title: 'Name (UZ)',
      dataIndex: 'title_uz',
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
  return <Table style={{ overflowY: "scroll", height: "100%" }} columns={columns} loading={loading} dataSource={countries} /> 
}
export default CountriesPage;