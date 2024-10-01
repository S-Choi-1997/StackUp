import axios from "axios";
import { useUserStore } from "../store/UserStore";
import { freelanceStore } from "../store/FreelanceStore";
import { clientLoginInfo, clientSignupInfo, freelanceSignupInfo } from "./User.type";

const BASE_URL: string = "http://localhost:8080/api/user";
const { setToken, setUserType, setFreelancerId, setClientId } = useUserStore.getState();


//== 프리랜서 깃허브 소셜 로그인 ==//
export const freelanceLogin = async (): Promise<void> => {
  window.location.href =
    "http://localhost:8080/api/oauth2/authorization/github";
};

//== 토큰 정보 ==//
export const getToken = async (userId: string | null): Promise<string> => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/token`,
      params: {
        userId: userId,
      },
    });

    //== 토큰 저장 ==//
    setToken(response.data.data.accessToken);
    window.sessionStorage.setItem("token", response.data.data.accessToken);

    //== userType 저장 ==//
    setUserType(response.data.data.userType);
    window.sessionStorage.setItem("userType", response.data.data.userType);

    //== id 저장 ==//
    setFreelancerId(response.data.data.userId);
    window.sessionStorage.setItem("freelancerId", response.data.data.userId);

    return "로그인";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }

    return "오류";
  }
};

//== 프리랜서 정보 등록 ==//
export const registerFreelancerInfo = async (): Promise<void> => {
  const state = freelanceStore.getState();
  try {
    axios({
      method: 'post',
      url: `${BASE_URL}/info`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      data: {
        name: state.name,
        email: state.email,
        address: state.address,
        phone: state.phone,
        classification: state.classification,
        framework: state.frameworks,
        language: state.languages,
        careerYear: state.careerYear,
        selfIntroduction: state.selfIntroduction,
        portfolioURL: state.portfolioURL
      },
    });

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
  }
};

//== 마이페이지 정보 ==//
export const freelanceMypage = async (): Promise<string> => {
  const state = freelanceStore.getState();

  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/info`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    const data: Partial<freelanceSignupInfo> = response.data.data;

    state.updateState(data);
    state.setFramworks(response.data.data.framework);
    state.setLanguages(response.data.data.language);

    console.log(response.data)

    return response.data.data.email;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }

    return "실패";
  }
};

//== 클라이언트 회원가입 ==//
export const clientSignup = async (
  information: clientSignupInfo
): Promise<void> => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/client/signup`,
      data: {
        name: information.name,
        email: information.email,
        password: information.password,
        passwordCheck: information.passwordCheck,
        businessRegistrationNumber: information.businessRegistrationNumber,
        businessName: information.businessName,
        phone: information.phone,
      },
    });

    console.log(response.data);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
  }
};


//== 클라이언트 로그인 ==//
export const clientLogin = async (
  information: clientLoginInfo
): Promise<void> => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/client/login`,
      data: {
        email: information.email,
        password: information.password,
      },
    });


    //== 토큰 값 설정 ==//
    setToken(response.headers.authorization);
    window.sessionStorage.setItem("token", response.headers.authorization);

    //== role 값 설정 ==//
    setUserType(response.data.data.userType);
    window.sessionStorage.setItem("userType", response.data.data.userType);

    //== id 저장 ==//
    setClientId(response.data.data.userId);
    window.sessionStorage.setItem("clientId", response.data.data.id);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
  }

};

//== 로그아웃 ==//
export const logout = async (): Promise<void> => {
  axios({
    method: 'post',
    url: `${BASE_URL}/logout`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })
  .then(() => {
    sessionStorage.clear();
    window.location.replace('/');
  })
  .catch((error) => {
    console.log(error)
  })
}