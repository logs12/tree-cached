import ApiService, { ApiResponse } from "../services/ApiService";

/**
 * Send request on api for getting Data
 *
 * @return Promise
 */
export const getTree = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await ApiService.get(`tree`);

    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      data: error.reponse?.data
    };
  }
};

export const getNode = async (nodeId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await ApiService.get(`node/${nodeId}`);

    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      data: error.reponse?.data
    };
  }
};

/**
 * Send request on api for create Data
 * @param { data } businessUnitId
 *
 * @return Promise
 */
export const addTree = async (data: string): Promise<ApiResponse<any>> => {
  try {
    const response = await ApiService.post(`add-tree`, data);

    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      data: error.reponse?.data
    };
  }
};

/**
 * Send request on api for getting Data
 *
 * @return Promise
 */
export const getInitTree = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await ApiService.get(`init-tree`);
    console.log("response = ", response);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      data: error.reponse?.data
    };
  }
};
