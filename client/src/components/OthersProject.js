import React, { useState } from "react";
import Tweet from "./Tweet";
import MentionProjects from "./MentionProjects";

const OtherProjects = ({
  currentUser,
  userNotIncludeProjectsForMention,
  userNotIncludeProjectsForRaid,

  // props, data
}) => {
  return (
    <>
      {currentUser &&
        userNotIncludeProjectsForMention &&
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
        userNotIncludeProjectsForRaid &&
        userNotIncludeProjectsForRaid.map((data) => (
          <>
            <Tweet
              currentUser={currentUser}
              data={data.tweet}
              projectDetail={data.projectDetail}
              poolData={{
                startTime: data?.pool?.startTime,
                endTime: data?.pool?.endTime || data?.pool[" endTime"],
                rewardCategory: data?.pool?.rewardCategory,
              }}
            />
          </>
        ))}
    </>
  );
};
export default OtherProjects;
