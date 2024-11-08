import api from '/src/services/api'

const user = {
  logout: async() => {
    const response = await api.post('/manage/user/logout');
    return response.data;
  }
}

export default user;