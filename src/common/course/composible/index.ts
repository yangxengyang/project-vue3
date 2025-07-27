import apiClient from "../../../common/configuration/axios.config";

// Composable for Course Module
export function useCourse() {
  const fetchItems = async () => {
    const response = await apiClient.get("course/get-all", {
      params: {
        page: 1,
        limit: 10,
        search: "",
      },
    });
    return response.data;
  };

  const getAllTeachers = async () => {
    const response = await apiClient.get("teacher/get-all");
    return response.data;
  };

  const getAllCategories = async () => {
    const response = await apiClient.get("course/categories");
    return response.data;
  };

  const addCourse = async (courseData: any) => {
    const response = await apiClient.post('course/create-course', courseData);
    return response.data;
  };

  const updateCourseStatus = async (id: string, status: string) => {
  return await apiClient.put(`/course/update-status/${id}`, { status });

  };

  const deleteCourse = async (id: string) => {
 return await apiClient.delete(`/course/delete-course/${id}`);

  };

  const updateCourse = async (id: string, courseData: any) => {
const response = await apiClient.put(`/course/update-course/${id}`, courseData);
    return response.data;
  };

  return {
    fetchItems,
    getAllTeachers,
    getAllCategories,
    addCourse,
    updateCourseStatus,
    deleteCourse,
    updateCourse,
  };
}