import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, Modal, Space, Table, Tag } from 'antd';
import axios from 'axios';


const DestinationsPage = () => { 
  const [prods , setProds] = useState([]);
  const [loading , setLoading] = useState(true)
  const { Search } = Input;
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm();
  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  form.setFieldsValue({
    name: "",
    avatar: "",
    age: ""
  })

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
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
        <Button type="primary" onClick={showLoading}>
          Add Category
        </Button>
        <Modal
          title={<p>Add Category</p>}
          footer={
            <Button type="primary" onClick={showLoading}>
              Reload
            </Button>
          }
          loading={loading}
          open={open}
          onCancel={() => setOpen(false)}
        >
          <Form
            form={form}
            layout='vertical'
            name="basic"
            labelCol={{ span: 32 }}
            wrapperCol={{ span: 32 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            footer={[

            ]}
          >
            <Form.Item
              label="Name (UZ)"
              name="name"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name (EN)"
              name="name"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name (RU)"
              name="name"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name (TR)"
              name="name"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" block>
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Table style={{ overflowY: "scroll", height: "100%", paddingTop: "20px" }} columns={columns} loading={loading} dataSource={prods} />
    </>
  ) }
export default DestinationsPage;