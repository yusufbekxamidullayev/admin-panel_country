import React, { useState } from 'react';
import { Button, DatePicker, Flex, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tag, Upload } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useGet from '../../hooks/useGet';


const ToursPage = () => {
  const [select , setSelect] = useState(null);
  const [messageApi, holder] = message.useMessage();
  const { Search } = Input;
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
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
    formdata.append("name_en", values.name_en);
    formdata.append("name_uz", values.name_uz);
    formdata.append("name_ru", values.name_ru);
    formdata.append("name_tr", values.name_tr);
    formdata.append("text_en", values.text_en);
    formdata.append("text_uz", values.text_uz);
    formdata.append("text_ru", values.text_ru);
    formdata.append("text_tr", values.text_tr)
    formdata.append("country_id" , values.country_id)
    formdata.append("city_id", values.city_id)
    formdata.append("days", JSON.stringify([{
      uz: values.days1,
      en: values.days2,
      ru: values.days3,
      tr: values.days4
    }]))
    
    let token = localStorage.getItem("token")
    
    try{
      if(select){
        await axios.put(`https://v1.turbotravel.uz/api/subtours/${select}`, formdata, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        toast.success("Tour tahrirlandi ")
      }else{
        await axios.post(`https://v1.turbotravel.uz/api/subtours`, formdata, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
          
        })
        toast.success("Tour Qo'shildi")
      }
      setSelect(null)
      
      setOpen(false);
      form.resetFields();
      getSubtours()
    }catch(err){
      console.log(err);
    }
    
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const { data: subtours, loading, setLoading, getData:getSubtours} = useGet({url:"subtours"})
  const {data:cities} = useGet({url:"cities"})
  const {data:countries} = useGet({url:"countries"})
  
  // Delete Lojic

  const DeleteCountry = async (id) => {
    const token = localStorage.getItem("token")
    try{
      await axios.delete(`https://v1.turbotravel.uz/api/subtours/${id}` , {
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      getSubtours();
      toast.success("Tour o'chirildi")
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
      dataIndex: 'name_en',
      key: 'name_en',
    },
    {
      title: 'Name (UZ)',
      dataIndex: 'name_uz',
      key: 'name_uz',
    },
    {
      title: 'Name (RU)',
      dataIndex: 'name_ru',
      key: 'name_ru',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary' onClick={() => EditCountry(record)}>Edit</Button>
          <Popconfirm
            title="Tour o'chirish"
            description="Tour o'chirishga aminmisiz?"
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
          Add Tour
        </Button>
        <Modal
          title={<p>Tours</p>}
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
              name="name_uz"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name (EN)"
              name="name_en"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name (RU)"
              name="name_ru"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name (TR)"
              name="name_tr"
              rules={[{ required: true, message: 'Ism kiritilmagan' }]}
            >
              <Input />
            </Form.Item>

            <h3 style={{ paddingBottom: "20px" }}>Days</h3>
            <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "5px", border: "1px solid silver", padding: "10px", borderRadius: "5px" }}>
              <Form.Item name="days1" label="(UZ) days">
                <RangePicker />
              </Form.Item>
              <Form.Item name="days2" label="(EN) days">
                <RangePicker />
              </Form.Item>
              <Form.Item name="days3" label="(RU) days">
                <RangePicker />
              </Form.Item>
              <Form.Item name="days4" label="(TR) days">
                <RangePicker />
              </Form.Item>
            </div>

            <h3 style={{ paddingBottom: "20px" , paddingTop:"15px"}}>Descreption</h3>
            <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "5px", border: "1px solid silver", padding:"10px" , borderRadius:"5px"}}>
              <Form.Item name="text_uz" label="(UZ) text">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="text_en" label="(EN) text">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="text_ru" label="(RU) text">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="text_tr" label="(TR) text">
                <Input.TextArea rows={3} />
              </Form.Item>  
            </div>  

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
            <Form.Item name="city_id" label="City" rules={[{ required: true }]}>
              <Select
                allowClear
                placeholder="Select a option and change input text above"
                options={cities.map((el) => {
                  return { label: el.title_uz, value: el.id }
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
      <Table style={{ overflowY: "scroll", height: "100%", paddingTop: "20px" }} columns={columns} loading={loading} dataSource={subtours} />
    </>
  )
}
export default ToursPage;