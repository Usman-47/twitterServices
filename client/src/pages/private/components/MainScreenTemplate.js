import React, { useState } from "react";

const MainScreenTemplate = ({ role }) => {
  const [count, setCount] = useState();
  return (
    <>
      <div className="col container p-md-5 py-2 my-5 border border-1 rounded-3" style={{background:"#333333",}}>
        <div className="p-4" style={{background:"#333333"}}>
          <div className="display-2 my-3 p-md-3 col text-white text-center welcome_admin">
            Welcome {role.toUpperCase()}
          </div>
          <div className="col my-2 p-md-3 mx-auto d-flex justify-content-center ">
            <div className="p-md-5 p-4 bg-black border border-1 rounded-3 text-center text-light mx-auto shadow">
              <div className="fw-bolder  lead">Total Tweets : {count} </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainScreenTemplate;
