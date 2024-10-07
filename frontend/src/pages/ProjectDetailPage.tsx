import axios from "axios";
import { addDays, differenceInDays, format, isValid } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { project, projectBasic } from "../apis/Board.type";
import { contractProjectDetail, projectStep } from "../apis/ProjectApi";
import InfoBox from "../components/WorkPage/InfoBox";
import DoneButton from "../components/common/DoneButton";
import CandidateIcon from "../icons/CandidateIcon";
import PeriodIcon from "../icons/PeriodIcon";
import PriceIcon from "../icons/PriceIcon";

interface Step {
  name: string;
  completed: boolean;
}

const svURL = import.meta.env.VITE_SERVER_URL;

const ProjectDetail = () => {
  const [buttonTitle, setButtonTitle] = useState("단계 완료");
  const [steps, setSteps] = useState<Step[]>([
    { name: '기획 및 설계', completed: false },
    { name: '퍼블리셔 및 디자인', completed: false },
    { name: '개발', completed: false },
    { name: '테스트', completed: false },
    { name: '배포', completed: false },
  ]);

  type Status = 'DEPLOYMENT' | 'DESIGN' | 'DEVELOPMENT' | 'PLANNING' | 'TESTING';
  const responseMapping: Record<Status, string> = {
    DEPLOYMENT: '배포',
    DESIGN: '퍼블리셔 및 디자인',
    DEVELOPMENT: '개발',
    PLANNING: '기획 및 설계',
    TESTING: '테스트',
  };

  const updateSteps = (status: Status) => {
    const stepName = responseMapping[status];
    const stepIndex = steps.findIndex((step) => step.name === stepName);

    if (stepIndex !== -1) {
      // 새로운 배열을 생성하여 상태를 업데이트
      const updatedSteps = steps.map((step, index) => ({
        ...step,
        completed: index <= stepIndex,  // 현재 단계까지 완료 처리
      }));
      setSteps(updatedSteps);  // 상태 업데이트
    }
  };

  const navigate = useNavigate();
  const userId = 15;
  const { projectId } = useParams<{ projectId: string }>();
  const numericProjectId = projectId ? parseInt(projectId, 10) : undefined;

  const [project, setProject] = useState<project>(projectBasic);
  const [workType, setWorkType] = useState(""); 
  const [stepResponse, setStepResponse] = useState<Status | null>(null);

  useEffect(() => {
    if (numericProjectId !== undefined) {
      const fetchStepResponse = async () => {
        try {
          const response = await projectStep(numericProjectId);
          setStepResponse(response.data.currentStep);
        } catch (error) {
          console.error("Failed to fetch project step", error);
        }
      };

      const fetchProjectDetail = async () => {
        try {
          const data = await contractProjectDetail(numericProjectId);
          setProject(data);
          setWorkType(data.worktype ? '재택' : '통근');
        } catch (error) {
          console.error("Failed to fetch project details", error);
        }
      };

      fetchStepResponse();
      fetchProjectDetail();
    } else {
      console.error("numericProjectId가 정의되지 않았습니다.");
    }
  }, [numericProjectId]);

  useEffect(() => {
    if (stepResponse) {
      updateSteps(stepResponse);
      setButtonTitle(`${responseMapping[stepResponse]} 완료`);
    }
  }, [stepResponse]);

  const frameworksList = project.frameworks.map((framework) => framework.name);
  const languagesList = project.languages.map((language) => language.name);

  const startDateObject = new Date(project.startDate);
  if (!isValid(startDateObject)) {
    return <div>유효하지 않은 시작 날짜입니다.</div>;
  }
  const startDate = format(startDateObject, 'yyyy-MM-dd');
  const periodAsNumber = parseInt(project.period.replace(/[^0-9]/g, ''), 10);
  const endDateObject = addDays(startDateObject, periodAsNumber);
  if (!isValid(endDateObject)) {
    return <div>유효하지 않은 종료 날짜입니다.</div>;
  }
  const endDate = format(endDateObject, 'yyyy-MM-dd');
  const remainDay = differenceInDays(new Date(endDate), new Date(format(new Date(), "yyyy-MM-dd")));
  const period = `${startDate} ~ ${endDate}`;

  const handleNavigateToMitermForm = () => {
    navigate(`/evaluate/miterm/${projectId}`, { state: { userId } });
  };

  const handleNavigateToFinalForm = () => {
    navigate(`/evaluate/final/${projectId}`, { state: { userId } });
  };

  const handleStep = async () => {
    console.log(numericProjectId);
    try {
      if (stepResponse) {
        const result = await projectStep(numericProjectId, stepResponse, true);
        console.log(result);
        alert("프로젝트 단계 변경이 요청되었습니다.");
        window.location.reload();

        if (stepResponse === "DEVELOPMENT") {
          handleNavigateToMitermForm();
        } else if (stepResponse === "DEPLOYMENT") {
          handleNavigateToFinalForm();
        }
      } else {
        console.warn("stepResponse 값이 없습니다.");
      }
    } catch (error) {
      console.error('프로젝트 단계 변경 중 오류가 발생했습니다:', error);
    }
  };

  const handleReport = async () => {
    try {
      const response = await axios.patch(`${svURL}/user/report/${userId}`);
      if (response.status === 200) {
        alert("신고가 완료되었습니다.");
      }
    } catch (error) {
      console.error("신고 실패:", error);
      alert("신고에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="m-20 flex items-center flex-col">
      <div className="bg-bgGreen border border-mainGreen rounded-xl w-[1000px] mb-5 p-5 h-[120px] flex flex-col">
        <ul className="steps">
          {steps.map((step, index) => (
            <li key={index} className={`step ${step.completed ? 'step-success' : ''}`}>
              {step.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-bgGreen border border-mainGreen h-auto rounded-lg p-10 w-[1000px] ">
        <div className="flex justify-between ">
          <span className="text-lg font-bold">{project.title}</span>
          <div onClick={handleReport}>
            <button className="w-[80px] h-[25px] rounded-md bg-red-400 text-white flex items-center justify-center font-bold text-sm">신고하기</button>
          </div>
        </div>
        <span className="text-subTxt">{project.classification}</span>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>

        <div className="flex justify-center mb-10">
          <InfoBox title="금액" content={project.deposit} info={PriceIcon} />
          <InfoBox title="기간" content={project.period} info={PeriodIcon} />
          <InfoBox title="팀원" content={project.applicants} info={CandidateIcon} />
        </div>

        <div className="flex ml-10">
          <div className="flex flex-col mr-20 text-subTxt">
            <span>프로젝트 기간</span>
            <span>근무 형태</span>
            <span>사용언어</span>
            <span>프레임워크</span>
            <span>기타 요구사항</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span>{period}</span>
              <span className="text-xs ml-2 text-red-400">마감 {remainDay}일전</span>
            </div>
            <span>{workType}</span>
            {languagesList.length === 0 ? (<span>사용언어 미정</span>) : (<span>{languagesList.join(', ')}</span>)}
            {frameworksList.length === 0 ? (<span>프레임워크 미정</span>) : (<span>{frameworksList.join(', ')}</span>)}
            <span>{project.requirements}</span>
          </div>
        </div>
        <div className="text-end" onClick={handleStep}>
          <DoneButton width={200} height={30} title={buttonTitle} />
        </div>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>

        <div>
          <div className="font-bold text-lg mb-2">업무 내용</div>
          <br />
          <span>{project.description}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
