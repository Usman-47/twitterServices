import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GetAllInvoicesApi from "../../../../apis/private/Invoice/GetAllInvoicesApi";

import Loader from "../../../../helpers/Loader";
import useDispatchFunc from "../../../../hooks/useDispatchFunc";
import useStatesFunc from "../../../../hooks/useStatesFunc";

const ReadAllInvoices = () => {
  const [{ token, loading }] = useStatesFunc();
  const [state, setState] = useState();
  const [dispatch] = useDispatchFunc();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      dispatch({ type: "loadingStart" });
      const { data } = await GetAllInvoicesApi(token);
      dispatch({ type: "loadingStop" });
      if (data.type === "success") {
        toast.success(data.msg);
        setState(data.invoiceArray);
      } else {
        toast.error(data.msg);
      }
    })();
  }, [dispatch, token]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }
  return (
    <>
      <div className=" container  p-md-5 rounded-3 my-3 text-dark fw-bold " style={{background:"#333333"}}>
        <div className="p-md-4">
          <div className="col border border-1">
            <table className="table table-hover text-white">
              <thead>
                <tr>
                  <th className="form-label">Project Name </th>
                  <th className="form-label">Project twitter username </th>
                  <th className="form-label">Discord for project contact </th>
                  <th className="form-label">Creator Address For mint </th>
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
                      <td className="form-label">{invoiceObj.projectName}</td>
                      <td className="form-label">
                        {invoiceObj.projectTwitterUsername}
                      </td>
                      <td className="form-label">
                        {invoiceObj.discordForProjectContact}
                      </td>
                      <td className="form-label">
                        {invoiceObj.mintCreatorAddress}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadAllInvoices;
