import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import InvoicePoolFetchDataFunc from "../../../../apis/public/others/InvoicePoolFetchDataFunc";

import Loader from "../../../../helpers/Loader";

import useDispatchFunc from "../../../../hooks/useDispatchFunc";
import useStatesFunc from "../../../../hooks/useStatesFunc";

const ReadOneInvoice = () => {
  const [isRaid, setIsRaid] = useState();

  const [dispatch] = useDispatchFunc();
  const [{ loading }] = useStatesFunc();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getinvoiceData = async () => {
      dispatch({ type: "loadingStart" });

      // this is for Details esssential for invoice
      const { data } = await InvoicePoolFetchDataFunc(id);
      setIsRaid(data?.invoiceFound[0]?.isRaid);
      dispatch({ type: "loadingStop" });
      if (data.type === "success") {
        toast.success(data.msg);
      } else {
        toast.warning(data.msg);
        navigate(-1);
      }
    };
    getinvoiceData();
  }, [dispatch, id, navigate]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div>
      <div className="border border-1 border-info rounded-3 my-5 container">
        <div className="">
          <div className="display-2 p-3 m-3 text-center text-secondary">
            Pool Info
          </div>
          <div className="d-flex flex-column flex-md-row ms-auto justify-content-evenly align-content-center row p-md-5 py-2 ">
            {isRaid ? (
              <div className="col-8 col-md-6 m-3">
                <button
                  className="btn btn-info border-info text-white w-100 my-2"
                  onClick={() =>
                    navigate(
                      `/app/invoice/readOne/readAllPool/readOnePool/readAllTweet/${id}`
                    )
                  }
                >
                  Tweets
                </button>
              </div>
            ) : null}
            <div className="col-8 col-md-6 m-3">
              <button
                className="btn btn-info border-info text-white w-100 my-2"
                onClick={() =>
                  navigate(`/app/invoice/readOne/readAllPool/update/${id}`)
                }
              >
                Update Pool
              </button>
            </div>
            <div className="col-8 col-md-6 m-3">
              <button
                className="btn btn-info border-info text-white w-100 my-2"
                onClick={() =>
                  navigate(`/app/invoice/readOne/readAllPool/delete/${id}`)
                }
              >
                Delete Pool
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOneInvoice;
