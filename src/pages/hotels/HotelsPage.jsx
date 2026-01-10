import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Table, Tag, Upload } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useGet from '../../hooks/useGet';


const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true)
  const [select, setSelect] = useState(null);
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
    formdata.append("name_en", values.name_en);
    formdata.append("name_uz", values.name_uz);
    formdata.append("name_ru", values.name_ru);
    formdata.append("name_tr", values.name_tr);
    formdata.append("text_en", values.text_en);
    formdata.append("text_uz", values.text_uz);
    formdata.append("text_ru", values.text_ru);
    formdata.append("text_tr", values.text_tr)
    formdata.append("country_id", values.country_id);
    formdata.append("address", values.address)
    formdata.append("rating", values.rating)

    console.log(formdata);


    let token = localStorage.getItem("token")

    try {
      if (select) {
        await axios.put(`https://v1.turbotravel.uz/api/hotels/${select}`, formdata, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        toast.success("Hotels tahrirlandi ")
      } else {
        await axios.post(`https://v1.turbotravel.uz/api/hotels`, formdata, {
          headers: {
            "Authorization": `Bearer ${token}`
          }

        })
        toast.success("Hotels Qo'shildi")
      }
      setSelect(null)

      setOpen(false);
      form.resetFields();
      getHotels()
    } catch (err) {
      console.log(err);
    }

  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const { data: countries } = useGet({ url: "countries" })

  async function getHotels() {
    try {
      let res = await axios.get(`https://v1.turbotravel.uz/api/hotels`)
      setHotels(res.data.data)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getHotels()
  }, [])

  // Delete Lojic

  const DeleteHotels = async (id) => {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`https://v1.turbotravel.uz/api/hotels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      getHotels();
      toast.success("Hotel o'chirildi")
    } catch (err) {
      console.log(err);
    }
  }

  // Edit Lojic

  const EditHotels = async (item) => {
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
          <Button type='primary' onClick={() => EditHotels(record)}>Edit</Button>
          <Popconfirm
            title="Hotel o'chirish"
            description="Hotel o'chirishga aminmisiz?"
            onConfirm={() => DeleteHotels(record.id)}
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
          Add Hotel
        </Button>
        <Modal
          title={<p>Hotel</p>}
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
            <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "5px", border: "1px solid silver", padding: "10px", borderRadius: "5px" , marginBottom:"15px" }}>
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
            <Form.Item name="country_id" label="Country" rules={[{ required: true }]}>
              <Select
                allowClear
                placeholder="Select a option and change input text above"
                options={countries.map((el) => {
                  return { label: el.title_uz, value: el.id }
                })}
              />
            </Form.Item>
            <div style={{ display: "flex", gap: "7px", width: "100%" }}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Address kiritilmagan" }]}
                style={{ flex: 1 }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Narxi"
                name="rating"
                rules={[{ required: true, message: "Please input!" }]}
                style={{ flex: 1 }}
              >
                <InputNumber style={{ width: "100%" }} />
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
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Table style={{ overflowY: "scroll", height: "100%", paddingTop: "20px" }} columns={columns} loading={loading} dataSource={hotels} />
    </>
  )
}
export default HotelsPage;