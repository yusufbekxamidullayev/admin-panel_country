import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './login.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { data } = await axios.post(
        'https://v1.turbotravel.uz/api/auth/signin',
        values
      );
      const token = data.data.tokens.accessToken.token;
      localStorage.setItem('token', token);
      toast.success("Sign In Successful");
      navigate('/countries');
    } catch (err) {
      console.log(err);
      toast.error("Request failed with status code 400");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Welcome back</h2>
        <p>Sign in to your account</p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="phone_number"
            rules={[{ required: true, message: 'Phone number kiriting' }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Phone number"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password kiriting' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
          >
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
