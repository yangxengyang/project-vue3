<template>
  <a-form
    :model="formState"
    name="basic"     
    :label-col="{ span: 24 }"   
    :wrapper-col="{ span: 24 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
    class="login-form"
  >
    <h2>ຍີນດີຕ້ອນຮັບ ເຂົ້າສູ່ລະບົບ</h2>

    <a-form-item
      label="ອິເມວ"
      name="email"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.email" size="large">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
        label="ລະຫັດ"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
    >
        <a-input-password v-model:value="formState.password" size="large">
            <template #prefix>
               <LockOutlined class="site-form-item-icon" />
            </template>
        </a-input-password>
    </a-form-item>

    <a-form-item>
        <a-button type="primary" html-type="submit" block size="large" style="margin-top: 10px;">
            ເຂົ້າສູ່ລະບົບ
        </a-button>
    </a-form-item>

    <!-- <p v-if="error" style="color: red">{{ error }}</p> -->
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import {useAuth} from './auth.ts';


const router = useRouter();
const {login} = useAuth();

interface FormState {
  email: string;
  password: string;
}

const formState = reactive<FormState>({
  email: '',
  password: '',
});

const onFinish = async (values: any) => {
  await login(values.email, values.password)
    .then(() => {
      router.push({ name: "customer" });
    })
    .catch((error) => {
      console.error('Login failed:', error);
    });
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};


</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #6d6a6a;
  border-radius: 8px;
}
</style>