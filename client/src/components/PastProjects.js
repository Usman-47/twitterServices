import React, { useState } from "react";
import Tweet from "./Tweet";
import MentionProjects from "./MentionProjects";

const OtherProjects = ({
  currentUser,
  userProjectsForMention,
  userProjectsForRaid,
  // props, data
}) => {
  return (
    <>
      {currentUser &&
        userProjectsForMention?.map((data) => (
          <>
            <MentionProjects
              currentUsers={currentUser}
              datas={data}
              mention={true}
            />
          </>
        ))}

      {currentUser &&
        userProjectsForRaid.map((data) => (
          <>
            <Tweet
              currentUser={currentUser}
              data={data.tweet}
              projectDetail={data.projectDetail}
            />
          </>
        ))}
    </>
  );
};
export default OtherProjects;
