import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import GetOneInvoiceApi from "../../../../apis/private/Invoice/GetOneInvoiceApi";

import Loader from "../../../../helpers/Loader";
import useDispatchFunc from "../../../../hooks/useDispatchFunc";
import useStatesFunc from "../../../../hooks/useStatesFunc";

const ReadAllInvoices = () => {
  const { id } = useParams();

  const [{ token, loading }] = useStatesFunc();
  const [state, setState] = useState();
  const [dispatch] = useDispatchFunc();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      dispatch({ type: "loadingStart" });
      const { data } = await GetOneInvoiceApi(id);
      dispatch({ type: "loadingStop" });
      if (data.type === "success") {
        toast.success(data.msg);
        setState(data.invoiceFound.pool);
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
      <div className=" container border border-1  rounded-3 p-md-5 my-3 fw-bold " style={{background:"#333333"}}>
        <div className="col">
          <div className="m-3">
            <button
              className="btn btn-dark border-dark text-white w-100 my-2"
              onClick={() =>
                navigate(`/app/invoice/readOne/readAllPool/addPool/${id}`)
              }
            >
              Add Pool
            </button>
          </div>
          <div className="bg-dark p-4">
         
          <div style={{overflowX:"auto"}}>
          <table class="table table-dark table-hover">
                <thead>
                  <tr>
                    
                    <th scope="col">Amount</th>
                    <th scope="col">Start Time</th>
                    <th scope="col">Tweet Url</th>
                    <th scope="col">Reward Frequency</th>
                    <th scope="col">Reward Token</th>
                    <th scope="col">Category</th>
                  </tr>
                </thead>
                <tbody>
                {state &&
                state.map((invoiceObj) => (
                  <tr>
                    
                  <td>{invoiceObj.amount}</td>
                    <td>{invoiceObj.startTime}</td>
                    <td>{invoiceObj.tweetUrl}</td>
                    <td>{invoiceObj.rewardFrequency}</td>
                    <td>{invoiceObj.splToken}</td>
                    {invoiceObj.category.map((data) => (
                      <td>{data}</td>
                    ))}
                  </tr>
                 
                  ))}
                </tbody>
              </table>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadAllInvoices;
