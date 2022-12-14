import React from "react";
import { useNavigate } from "react-router-dom";

const SearchFoundList = ({ state }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="col signup-background shadow my-md-5 my-3">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Tweets</th>
            </tr>
          </thead>
          <tbody>
            {state &&
              state.map((invoiceObj) => (
                <tr
                  key={invoiceObj._id}
                  className="text-break mouseCursorChanger"
                  onClick={() =>
                    navigate(`/app/invoice/readOne/${invoiceObj._id}`)
                  }
                >
                  <td>{invoiceObj.tweetUrl}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SearchFoundList;
