<script setup lang="ts">
import { onMounted, reactive, ref, h } from 'vue';
import dayjs from 'dayjs';
import type { ICourseEntity } from '../entity/course.entity';
import { useCourse } from '.';

const {
  fetchItems,
  getAllTeachers,
  getAllCategories,
  addCourse,
  updateCourseStatus,
  deleteCourse,
  updateCourse,
} = useCourse();

const data = reactive<any>({
  courses: [],
  isLoading: false,
  teachers: [],
  categories: []
});

const isOpenModalAdd = ref(false);
const isOpenModalEdit = ref(false);

const openModalAdd = () => {
  isOpenModalAdd.value = true;
};

const maxLength = 60;

const formState = reactive({
  teacher_id: '',
  category_id: '',
  title: '',
  max_student: 0,
  duration_hours: 0,
  price: 0,
  registration_start_date: '',
  registration_end_date: '',
  start_date: '',
  end_date: '',
  status: '',
  description: ''
});

const formStateEdit = reactive({
  id: '',
  teacher_id: '',
  category_id: '',
  title: '',
  max_student: 0,
  duration_hours: 0,
  price: 0,
  registration_start_date: '',
  registration_end_date: '',
  start_date: '',
  end_date: '',
  status: '',
  description: ''
});

const resetForm = () => {
  formState.teacher_id = '';
  formState.category_id = '';
  formState.title = '';
  formState.max_student = 0;
  formState.duration_hours = 0;
  formState.price = 0;
  formState.registration_start_date = '';
  formState.registration_end_date = '';
  formState.start_date = '';
  formState.end_date = '';
  formState.status = '';
  formState.description = '';
};

const handleSubmit = async () => {
  if (!formState.title || !formState.teacher_id || !formState.category_id) {
    alert('Please fill all required fields.');
    return;
  }

  const payload = {
    ...formState,
    register_start_date: dayjs(formState.registration_start_date).format('YYYY-MM-DD'),
    register_end_date: dayjs(formState.registration_end_date).format('YYYY-MM-DD'),
    start_date: dayjs(formState.start_date).format('YYYY-MM-DD'),
    end_date: dayjs(formState.end_date).format('YYYY-MM-DD'),
  };

  try {
    console.log("📤 Payload being sent:", payload);
    await addCourse(payload);
    isOpenModalAdd.value = false;
    resetForm();
    await fetchAll();
  } catch (err: any) {
    console.error('❌ Failed to add course:', err?.response?.data || err.message);
    alert('Failed to add course. Check console for details.');
  }
};

const onHandleEditSubmit = async () => {
  if (!formStateEdit.title || !formStateEdit.teacher_id || !formStateEdit.category_id) {
    alert('Please fill all required fields.');
    return;
  }

  const payload = {
    ...formStateEdit,
    register_start_date: dayjs(formStateEdit.registration_start_date).format('YYYY-MM-DD'),
    register_end_date: dayjs(formStateEdit.registration_end_date).format('YYYY-MM-DD'),
    start_date: dayjs(formStateEdit.start_date).format('YYYY-MM-DD'),
    end_date: dayjs(formStateEdit.end_date).format('YYYY-MM-DD'),
  };

  try {
    console.log("📤 Edit payload being sent:", payload);
    await updateCourse(String(formStateEdit.id), payload);
    isOpenModalEdit.value = false;
    await fetchAll();
  } catch (err: any) {
    console.error('❌ Failed to update course:', err?.response?.data || err.message);
    alert('Failed to update course. Check console for details.');
  }
};

const columns = [
  {
    title: 'ລຳດັບ',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'ຄະນະ',
    dataIndex: 'category',
    key: 'category',
    customRender: ({ record }: { record: ICourseEntity }) => record.category?.name || '-'
  },
  {
    title: 'ສາຂາ',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'ຮັບຈຳນວນ',
    dataIndex: 'max_student',
    key: 'max_student',
    customRender: ({ record }: { record: ICourseEntity }) => {
      const maxStudent = record.max_student ?? 0;
      return `${maxStudent} ຄົນ`;
    }
  },
  {
    title: 'ຊົ່ວໂມງຮຽນ',
    dataIndex: 'duration_hours',
    key: 'duration_hours',
    customRender: ({ record }: { record: ICourseEntity }) => {
      const durationHours = record.duration_hours ?? 0;
      return `${durationHours} ຊົ່ວໂມງ`;
    }
  },
  {
    title: 'ລາຄາ',
    dataIndex: 'price',
    key: 'price',
    customRender: ({ record }: { record: ICourseEntity }) => {
      const price = record.price ?? 0;
      return `${price.toLocaleString('lo-LA')} ກີບ`;
    }
  },
  {
    title: 'ເປີດລົງທະບຽນ',
    dataIndex: 'registration_start_date',
    key: 'registration_start_date'
  },
  {
    title: 'ປິດລົງທະບຽນ',
    dataIndex: 'registration_end_date',
    key: 'registration_end_date'
  },
  {
    title: 'ເປີດຮຽນ',
    dataIndex: 'start_date',
    key: 'start_date'
  },
  {
    title: 'ປິດຮຽນ',
    dataIndex: 'end_date',
    key: 'end_date'
  },
  {
    title: 'ສະຖານະ',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }: { record: ICourseEntity }) => {
      const status = record.status ?? 'open';
      const color = status === 'open' ? 'green' : 'red';
      const text = status === 'open' ? 'ເປີດ' : 'ປິດ';

      return h(
        'span',
        {
          style: {
            color,
            fontWeight: 'bold'
          }
        },
        text
      );
    }
  },
  {
    title: 'Action',
    key: 'action',
  }
];

const fetchAll = async () => {
  const response = await fetchItems();
  data.courses = response.data;

  const teacherResponse = await getAllTeachers();
  data.teachers = teacherResponse.data.map((teacher: any) => ({
    value: teacher.id,
    label: teacher.user?.username || 'unknown'
  }));

  const categoryResponse = await getAllCategories();
  data.categories = categoryResponse.data.map((category: any) => ({
    value: category.id,
    label: category.name || 'unknown'
  }));
};

const handleStatusChange = async (record: ICourseEntity, checked: boolean) => {
  console.log('Status change for record:', record.id, 'Checked:', checked);
  const status = checked ? 'open' : 'closed';
  try {
    const response = await updateCourseStatus(String(record.id), status);
    if (response.status === 200) {
      fetchAll();
    } else {
      console.error('Failed to update course status. Check console for details.');
    }
  } catch (error) {
    console.error('Error updating course status:', error);
  }
};

const ondelete = async (id: number | string) => {
  try {
    await deleteCourse(String(id));
    await fetchAll();
  } catch (err: any) {
    console.error('❌ Failed to delete course:', err?.response?.data || err.message);
    alert('Failed to delete course. Check console for details.');
  }
};

const openEditModal = (record: ICourseEntity) => {
  formStateEdit.id = String(record.id);
  formStateEdit.teacher_id = record.teacher_id;
  formStateEdit.category_id = record.category_id;
  formStateEdit.title = record.title;
  formStateEdit.max_student = record.max_student;
  formStateEdit.duration_hours = record.duration_hours;
  formStateEdit.price = record.price;
  formStateEdit.registration_start_date = record.registration_start_date ? dayjs(record.registration_start_date).format('YYYY-MM-DD') : '';
  formStateEdit.registration_end_date = record.registration_end_date ? dayjs(record.registration_end_date).format('YYYY-MM-DD') : '';
  formStateEdit.start_date = record.start_date ? dayjs(record.start_date).format('YYYY-MM-DD') : '';
  formStateEdit.end_date = record.end_date ? dayjs(record.end_date).format('YYYY-MM-DD') : '';
  formStateEdit.status = record.status;
  formStateEdit.description = record.description;

  isOpenModalEdit.value = true;
};



onMounted(async () => {
  await fetchAll();
});
</script>

<template>
  <div>
    <div class="title">
      <p class="title-text">ລາຍການ Course</p>
      <p>
        <a-button type="primary" @click="openModalAdd">ເພີ່ມຂໍ້ມູນ</a-button>
      </p>
    </div>

    <a-table :data-source="data.courses" :columns="columns" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span>
            <a-switch
              :checked="record.status === 'open'"
              @change="(checked: boolean) => handleStatusChange(record, checked)"
              checked-children=""
              un-checked-children=""
            />

            <a-divider type="vertical" />
            <a-button type="link" @click="() => openEditModal(record)" style="background-color: blue; color: white">ແກ້ໄຂ</a-button>
            <a-divider type="vertical" />
            <a-modal v-model="isOpenModalEdit" title="ແກ້ໄຂ Course" @ok="onHandleEditSubmit" @cancel="isOpenModalEdit = false"/>
              <!-- Edit form will be handled in the modal -->
            <a-popconfirm
              v-if="data.courses.length > 0"
              title="ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຫຼັກສູດນີ້?"
              @confirm="() => ondelete(record.id)"
            >
              <a-button type="link" style="background-color: red; color: white">ລືບ</a-button>
            </a-popconfirm>
            <a-divider type="vertical" />
          </span>
        </template>
      </template>
    </a-table>
  </div>

  <!-- Add Course Modal -->
  <a-modal
    v-model:open="isOpenModalAdd"
    title="ເພີ່ມຂໍ້ມູນ Course"
    @ok="handleSubmit"
    @cancel="isOpenModalAdd = false"
  >
    <!-- Teacher Select -->
    <div class="select-container">
      <label for="teacher-select">ອາຈານ</label>
      <a-select
        id="teacher-select"
        v-model:value="formState.teacher_id"
        show-search
        placeholder="ເລືອກອາຈານ"
        style="width: 100%"
        :options="data.teachers"
      />
    </div>

    <!-- Category Select -->
    <div class="select-container">
      <label for="category-select">ໝວດໝູ່</label>
      <a-select
        id="category-select"
        v-model:value="formState.category_id"
        show-search
        placeholder="ເລືອກໝວດໝູ່"
        style="width: 100%"
        :options="data.categories"
      />
    </div>

    <!-- Title Input -->
    <div class="select-container">
      <label for="title-input">ຫົວຂໍ້</label>
      <a-input
        id="title-input"
        v-model:value="formState.title"
        placeholder="ປ້ອນຫົວຂໍ້"
        style="width: 100%"
      />
    </div>

    <!-- Max Student Input -->
    <div class="select-container">
      <label for="max-student-input">ຈຳນວນນັກຮຽນສູງສຸດ</label>
      <a-input-number
        id="max-student-input"
        v-model:value="formState.max_student"
        style="width: 100%"
        :min="0"
      />
    </div>

    <!-- Duration Hours Input -->
    <div class="select-container">
      <label for="duration-input">ຊົ່ວໂມງຮຽນ</label>
      <a-input-number
        id="duration-input"
        v-model:value="formState.duration_hours"
        style="width: 100%"
        :min="0"
      />
    </div>

    <!-- Price Input -->
    <div class="select-container">
      <label for="price-input">ລາຄາ</label>
      <a-input-number
        id="price-input"
        v-model:value="formState.price"
        style="width: 100%"
        :min="0"
      />
    </div>

    <!-- Registration Start Date -->
    <div class="select-container">
      <label for="reg-start-date">ເລີ່ມລົງທະບຽນ</label>
      <a-date-picker
        id="reg-start-date"
        v-model:value="formState.registration_start_date"
        style="width: 100%"
        format="YYYY-MM-DD"
      />
    </div>

    <!-- Registration End Date -->
    <div class="select-container">
      <label for="reg-end-date">ສິ້ນສຸດລົງທະບຽນ</label>
      <a-date-picker
        id="reg-end-date"
        v-model:value="formState.registration_end_date"
        style="width: 100%"
        format="YYYY-MM-DD"
      />
    </div>

    <!-- Start Date -->
    <div class="select-container">
      <label for="start-date">ເລີ່ມຮຽນ</label>
      <a-date-picker
        id="start-date"
        v-model:value="formState.start_date"
        style="width: 100%"
        format="YYYY-MM-DD"
      />
    </div>

    <!-- End Date -->
    <div class="select-container">
      <label for="end-date">ສິ້ນສຸດຮຽນ</label>
      <a-date-picker
        id="end-date"
        v-model:value="formState.end_date"
        style="width: 100%"
        format="YYYY-MM-DD"
      />
    </div>

    <!-- Status Select -->
    <div class="select-container">
      <label for="status-select">ສະຖານະ</label>
      <a-select
        id="status-select"
        v-model:value="formState.status"
        style="width: 100%"
        :options="[
          { value: 'open', label: 'ເປີດ' },
          { value: 'closed', label: 'ປິດ' }
        ]"
      />
    </div>

    <!-- Description Textarea -->
    <div class="select-container">
      <label for="description-textarea">ຄຳອະທິບາຍ</label>
      <a-textarea
        id="description-textarea"
        v-model:value="formState.description"
        :maxlength="maxLength"
        show-count
        placeholder="ຄຳອະທິບາຍ Course"
        rows="4"
      />
      <div style="color: #999; font-size: 12px; margin-top: 4px;">
        ຄວາມຍາວສູງສຸດ {{ maxLength }}
      </div>
    </div>
  </a-modal>

  <!-- Edit Course Modal -->
  <a-modal
    v-model:open="isOpenModalEdit"
    title="ແກ້ໄຂຂໍ້ມູນ Course"
    @ok="onHandleEditSubmit"
    @cancel="isOpenModalEdit = false"
  >
    <!-- Teacher Select -->
    <div class="select-container">
      <label for="edit-teacher-select">ອາຈານ</label>
      <a-select
        id="edit-teacher-select"
        v-model:value="formStateEdit.teacher_id"
        show-search
        placeholder="ເລືອກອາຈານ"
        style="width: 100%"
        :options="data.teachers"
      />
    </div>

    <!-- Category Select -->
    <div class="select-container">
      <label for="edit-category-select">ໝວດໝູ່</label>
      <a-select
        id="edit-category-select"
        v-model:value="formStateEdit.category_id"
        show-search
        placeholder="ເລືອກໝວດໝູ່"
        style="width: 100%"
        :options="data.categories"
      />
    </div>

    <!-- Title Input -->
    <div class="select-container">
      <label for="edit-title-input">ຫົວຂໍ້</label>
      <a-input
        id="edit-title-input"
        v-model:value="formStateEdit.title"
        placeholder="ປ້ອນຫົວຂໍ້"
        style="width: 100%"
      />
    </div>

    <!-- Max Student Input -->
    <div class="select-container">
      <label for="edit-max-student-input">ຈຳນວນນັກຮຽນສູງສຸດ</label>
      <a-input-number
        id="edit-max-student-input"
        v-model:value="formStateEdit.max_student"
        style="width: 100%"
        :min="0"
      />
    </div>

    <!-- Duration Hours Input -->
    <div class="select-container">
      <label for="edit-duration-input">ຊົ່ວໂມງຮຽນ</label>
      <a-input-number
        id="edit-duration-input"
        v-model:value="formStateEdit.duration_hours"
        style="width: 100%"
        :min="0"
      />
    </div>

    <!-- Price Input -->
    <div class="select-container">
      <label for="edit-price-input">ລາຄາ</label>
      <a-input-number
        id="edit-price-input"
        v-model:value="formStateEdit.price"
        style="width: 100%"
        :min="0"
      />
    </div>

    <!-- Registration Start Date -->
    <div class="select-container">
      <label for="edit-reg-start-date">ເລີ່ມລົງທະບຽນ</label>
      <a-date-picker
        id="edit-reg-start-date"
        v-model:value="formStateEdit.registration_start_date"
        style="width: 100%"
        :value-format="'YYYY-MM-DD'"
      />
    </div>

    <!-- Registration End Date -->
    <div class="select-container">
      <label for="edit-reg-end-date">ສິ້ນສຸດລົງທະບຽນ</label>
      <a-date-picker
        id="edit-reg-end-date"
        v-model:value="formStateEdit.registration_end_date"
        style="width: 100%"
        :value-format="'YYYY-MM-DD'"
      />
    </div>

    <!-- Start Date -->
    <div class="select-container">
      <label for="edit-start-date">ເລີ່ມຮຽນ</label>
      <a-date-picker
        id="edit-start-date"
        v-model:value="formStateEdit.start_date"
        style="width: 100%"
        :value-format="'YYYY-MM-DD'"
      />
    </div>

    <!-- End Date -->
    <div class="select-container">
      <label for="edit-end-date">ສິ້ນສຸດຮຽນ</label>
      <a-date-picker
        id="edit-end-date"
        v-model:value="formStateEdit.end_date"
        style="width: 100%"
        :value-format="'YYYY-MM-DD'"
      />
    </div>

    <!-- Status Select -->
    <div class="select-container">
      <label for="edit-status-select">ສະຖານະ</label>
      <a-select
        id="edit-status-select"
        v-model:value="formStateEdit.status"
        style="width: 100%"
        :options="[
          { value: 'open', label: 'ເປີດ' },
          { value: 'closed', label: 'ປິດ' }
        ]"
      />
    </div>

    <!-- Description Textarea -->
    <div class="select-container">
      <label for="edit-description-textarea">ຄຳອະທິບາຍ</label>
      <a-textarea
        id="edit-description-textarea"
        v-model:value="formStateEdit.description"
        :maxlength="maxLength"
        show-count
        placeholder="ຄຳອະທິບາຍ Course"
        rows="4"
      />
      <div style="color: #999; font-size: 12px; margin-top: 4px;">
        ຄວາມຍາວສູງສຸດ {{ maxLength }}
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.title-text {
  font-size: 24px;
  font-weight: bold;
}
.select-container {
  margin-bottom: 12px;
}
</style>