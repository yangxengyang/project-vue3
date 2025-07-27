import { createRouter, createWebHistory } from "vue-router";
import CustomerPage from "./modules/customer/Customer.vue";
import { authGuard } from "./common/guards/auth.guard";
import LoginPage from "./modules/auth/composible/Login.vue";
import RegisterPage from "./modules/customer/Register.vue";
import CourseCategoryPage from "./modules/course-category/CourseCategory.vue";
import CoursePage from "./common/course/composible/Course.vue";

const routes = [
  {
    path: "/",
    name: "layout",
    component: () => import("./components/layouts/Layout.vue"),
    children: [
      {
        path: "/customer",
        name: "customer",
        component: CustomerPage,
      },
      /** Course Category */
      {
        path: "/course-catgory",
        name: "course.category",
        component: CourseCategoryPage,
      },
      {
        path:"/course",
        name:"course",
        component: CoursePage,
      }
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: {
      skipAuthCheck: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
    meta: {
      skipAuthCheck: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

authGuard(router);

export default router;
