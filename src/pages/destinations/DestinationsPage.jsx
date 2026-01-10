import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tag, Upload } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useGet from '../../hooks/useGet';


const DestinationsPage = () => {
  const [prods, setProds] = useState([]);
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
    formdata.append("text_en", values.text_en);
    formdata.append("text_uz", values.text_uz);
    formdata.append("text_ru", values.text_ru);
    formdata.append("text_tr", values.text_tr);
    console.log(formdata);


    let token = localStorage.getItem("token")

    try {
      if (select) {
        await axios.put(`https://v1.turbotravel.uz/api/prods/${select}`, formdata, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        toast.success("prods tahrirlandi ")
      } else {
        await axios.post(`https://v1.turbotravel.uz/api/prods`, formdata, {
          headers: {
            "Authorization": `Bearer ${token}`
          }

        })
        toast.success("prods Qo'shildi")
      }
      setSelect(null)

      setOpen(false);
      form.resetFields();
      getProds()
    } catch (err) {
      console.log(err);
    }

  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  async function getProds() {
    try {
      let res = await axios.get(`https://v1.turbotravel.uz/api/prods`)
      setProds(res.data.data)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProds()
  }, [])

  // Delete Lojic

  const DeleteCountry = async (id) => {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`https://v1.turbotravel.uz/api/prods/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      getProds();
      toast.success("Product o'chirildi")
    } catch (err) {
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
            title="Country o'chirish"
            description="Country o'chirishga aminmisiz?"
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
          Add Product
        </Button>
        <Modal
          title={<p>Product</p>}
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
            <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "5px", border: "1px solid silver", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>
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
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Table style={{ overflowY: "scroll", height: "100%", paddingTop: "20px" }} columns={columns} loading={loading} dataSource={prods} />
    </>
  )
}
export default DestinationsPage;