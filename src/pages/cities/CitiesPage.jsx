import React, { useState } from 'react';
import { Button, Flex, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tag, Upload } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useGet from '../../hooks/useGet';


const CitiesPage = () => {
  const [select , setSelect] = useState(null);
  const [messageApi, holder] = message.useMessage();
  const { Search } = Input;
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm();
  console.log(form);
  
  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const cancel = e => {
    console.log(e);
    messageApi.error('Click on No');
    toast.warning("O'chirish bekor qilindi")
  };

  const formdata = new FormData();
  const onFinish = async (values) => { 
    console.log(values);

    formdata.append("images", values.upload[0].originFileObj);
    formdata.append("title_en", values.title_en);
    formdata.append("title_uz", values.title_uz);
    formdata.append("title_ru", values.title_ru);
    formdata.append("title_tr", values.title_tr);
    formdata.append("country_id" , values.country_id)
    
    
    let token = localStorage.getItem("token")
    
    try{
      if(select){
        await axios.put(`https://v1.turbotravel.uz/api/cities/${select}`, formdata, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        toast.success("City tahrirlandi ")
      }else{
        await axios.post(`https://v1.turbotravel.uz/api/cities`, formdata, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
          
        })
        toast.success("City Qo'shildi")
      }
      setSelect(null)
      
      setOpen(false);
      form.resetFields();
      getCities()
    }catch(err){
      console.log(err);
    }
    
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const {data:cities , loading , setLoading , getData:getCities} = useGet({url:"cities"})
  const {data:countries} = useGet({url:"countries"})
  
  // Delete Lojic

  const DeleteCountry = async (id) => {
    const token = localStorage.getItem("token")
    try{
      await axios.delete(`https://v1.turbotravel.uz/api/cities/${id}` , {
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      getCities();
      toast.success("City o'chirildi")
    }catch(err){
      console.log(err);
    }   
  }

  // Edit Lojic

  const EditCountry = async (item) => {
    setSelect(item.id)
    setOpen(true)
    console.log(item);
    form.setFieldsValue(item)
  }


  form.setFieldsValue({
    name: "",
    avatar: "",
    age: ""
  })

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
          <Button type='primary' onClick={() => EditCountry(record)}>Edit</Button>
          <Popconfirm
            title="City o'chirish"
            description="City o'chirishga aminmisiz?"
            onConfirm={() => DeleteCountry(record.id)}
            onCancel={cancel}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
        <Button type="primary" onClick={showLoading}>
          Add City
        </Button>
        <Modal
          title={<p>Cities</p>}
          footer={
            []
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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            footer={[

            ]}
          >
            <Form.Item
              label="Name (UZ)"
              name="title_uz"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name (EN)"
              name="title_en"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name (RU)"
              name="title_ru"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name (TR)"
              name="title_tr"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="upload"
              label="Upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload name="logo" action="/upload.do" listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="country_id" label="Country" rules={[{ required: true }]}>
              <Select
                allowClear
                placeholder="Select a option and change input text above"
                options={countries.map((el) => {
                  return {label:el.title_uz , value:el.id}
                })}
              />
            </Form.Item>
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Table style={{ overflowY: "scroll", height: "100%", paddingTop: "20px" }} columns={columns} loading={loading} dataSource={cities} />
    </>
  )
}
export default CitiesPage;