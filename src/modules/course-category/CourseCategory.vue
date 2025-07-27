<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { CourseCategoryComposable } from './composible';
import type { IFormStateCategory } from './interface/category.interface';
import type { ICatgoryEntity } from './entity/category.entity';

const { fetchAll, createItem, updateItem, deleteItem } = CourseCategoryComposable();

const open = ref(false);
const isEdit = ref(false);

const formState = reactive<IFormStateCategory>({
  id: 0,
  name: ''
});

const data = reactive({
  categories: [] as IFormStateCategory[],
});

const columns = [
  {
    title: 'No',
    key: 'no',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Action',
    key: 'action',
  },
];

const loadData = async () => {
  const response = await fetchAll();
  data.categories = response.data;
};

const onDelete = async (id: number) => {
  try {
    await deleteItem(id);
    message.success('Category deleted successfully');
    await loadData();
  } catch (err) {
    console.error(err);
    message.error('Failed to delete');
  }
};

const openModal = (record?: ICatgoryEntity) => {
  if (record) {
    isEdit.value = true;
    formState.id = record.id;
    formState.name = record.name;
  } else {
    isEdit.value = false;
    formState.id = 0;
    formState.name = '';
  }
  open.value = true;
};

const handleOk = async () => {
  try {
    if (!formState.name) {
      return message.warning('Name is required');
    }

    if (isEdit.value) {
      await updateItem(formState);
      message.success('Category updated successfully');
    } else {
      await createItem(formState);
      message.success('Category created successfully');
    }

    open.value = false;
    await loadData();
  } catch (err) {
    console.error(err);
    message.error('Operation failed');
  }
};

onMounted(() => {
  loadData();
});
</script>
<template>
  <div>
    <a-button type="primary" @click="() => openModal()" style="margin-bottom: 16px">
      + Create Category
    </a-button>

    <a-table :dataSource="data.categories" :columns="columns" rowKey="id">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          {{ index + 1 }}
        </template>
        <template v-if="column.key === 'action'">
          <a @click="() => openModal(record)">Edit</a>
          <a-divider type="vertical" />
          <a-popconfirm title="Sure to delete?" @confirm="() => onDelete(record.id)">
            <a>Delete</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <!-- Modal for Create & Edit -->
    <a-modal v-model:open="open" :title="isEdit ? 'Edit Category' : 'Create Category'" @ok="handleOk">
      <a-form layout="vertical">
        <a-form-item label="Name" required>
          <a-input v-model:value="formState.name" placeholder="Enter category name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
