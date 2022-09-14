import React, { useState } from "react";
import Tweet from "./Tweet";
import MentionProjects from "./MentionProjects";

const OtherProjects = ({
  currentUser,
  userNotIncludeProjectsForMention,
  userNotIncludeProjectsForRaid,

  // props, data
}) => {
  console.log(userNotIncludeProjectsForRaid, "ff");

  return (
    <>
      {currentUser &&
        userNotIncludeProjectsForMention?.map((data) => (
          <>
            <MentionProjects
              currentUsers={currentUser}
              datas={data}
              mention={true}
            />
          </>
        ))}

      {currentUser &&
        userNotIncludeProjectsForRaid.map((data) => (
          <>
          {console.log(data,"b")}
            <Tweet
              currentUser={currentUser}
              data={data.tweet}
              projectDetail={data.projectDetail}
              poolData={{startTime:data?.pool?.startTime,endTime:data?.pool?.endTime}}
            />
          </>
        ))}
    </>
  );
};
export default OtherProjects;
