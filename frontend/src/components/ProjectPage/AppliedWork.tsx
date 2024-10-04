import { useEffect, useState } from "react";
import { appliedProject } from "../../apis/FreelancerApi";
import { project } from "../../apis/Board.type";
import AppliedBox from "./AppliedBox";

const AppliedWork = () => {
  const [projectList, setProjectList] = useState<project[]>();

  useEffect(() => {
    const detail = async () => {
      const data = await appliedProject();
      setProjectList(data);
    }
    detail();
  }, [])

  return (
    <div className="flex flex-col  items-center mt-[50px]">
      {projectList?.map((project: project, index: number) => (
        <div className="w-[1000px]">
          <AppliedBox {...project} key={index} />
        </div>
      ))}
    </div>
  )
}
export default AppliedWork;